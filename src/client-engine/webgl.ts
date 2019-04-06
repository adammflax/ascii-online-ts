import { stringify } from "querystring";
import { Shader, Renderer, ProgramShader } from "./renderer";
import { Vector3 } from "../core/ecs";
import { mat4 } from "gl-matrix";

export const vertexShader = `
    attribute vec3 squareVertexPosition;
    uniform mat4 transform;

    void main(void){
        gl_Position = transform * vec4(squareVertexPosition, 1.0);
    }
`;

export const fragmentShader = `
precision mediump float;
uniform vec4 color;

void main(void){
    gl_FragColor = color;   
}                    
`;

const verticies = [0.5, 0.5, 0, -0.5, 0.5, 0, 0.5, -0.5, 0, -0.5, -0.5, 0];

export class WebGLRenderer implements Renderer {
  private ctx: WebGLRenderingContext;
  private width: number = 0;
  private height: number = 0;
  private program: Shader;

  constructor(ctx: WebGLRenderingContext) {
    this.ctx = ctx;

    const gl = this.ctx;
    this.program = new GSGLShader(
      ctx,
      "squareShader",
      vertexShader,
      fragmentShader
    ).withAttribute("squareVertexPosition", verticies);
  }

  public redraw(): void {
    const gl = this.ctx;
    this.clear(gl);

    this.program
      .runProgram()
      .withUniformF("color", [1.0, 0.0, 0.0, 1.0])
      .withUniformM(
        "transform",
        mat4.rotateZ(mat4.create(), mat4.create(), -0.785)
      )
      .apply();
  }

  public resize(width: number, height: number): void {
    this.width, (height = width), height;
  }

  public drawChar(character: string, position: Vector3) {}

  private clear(gl: WebGLRenderingContext) {
    //gl.viewport(0, 0, this.width, this.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }
}

export class GSGLProgramShader implements ProgramShader {
  private uniformData: Map<String, WebGLUniformLocation>;

  constructor(
    private shader: GSGLShader,
    private gl: WebGLRenderingContext,
    private program: WebGLProgram
  ) {
    this.uniformData = new Map();
  }

  withUniformF(
    name: string,
    unMappeData: number | number[] | Float32Array
  ): GSGLProgramShader {
    const gl = this.gl;
    const uniformFloatMapper = new Map()
      .set(1, gl.uniform1fv)
      .set(2, gl.uniform2fv)
      .set(3, gl.uniform3fv)
      .set(4, gl.uniform4fv);

    return this.withUniform(uniformFloatMapper, name, unMappeData);
  }

  withUniformI(
    name: string,
    unMappeData: number | number[] | Int32Array
  ): GSGLProgramShader {
    const gl = this.gl;
    const uniformIntMapper = new Map()
      .set(1, gl.uniform1iv)
      .set(2, gl.uniform2iv)
      .set(3, gl.uniform3iv)
      .set(4, gl.uniform4iv);

    return this.withUniform(uniformIntMapper, name, unMappeData);
  }

  withUniformM(
    name: string,
    unMappeData: number[] | Float32Array
  ): GSGLProgramShader {
    const gl = this.gl;

    //the gl uniform matrix function signature is different to the uniform float and
    //uniform int function. Therefore we need to construct a partial function so that the
    //signiture is the same as those functions
    const uniformMatrixMapper = new Map()
      .set(4, this.partialUniformMatrix(gl, gl.uniformMatrix2fv))
      .set(9, this.partialUniformMatrix(gl,gl.uniformMatrix3fv))
      .set(16, this.partialUniformMatrix(gl,gl.uniformMatrix4fv));

    return this.withUniform(uniformMatrixMapper, name, unMappeData);
  }

  //maps a uniform matrix function to a function that takes a webglUniformLocation and a
  //float32 list as an argument. the transpoe argument should always be set to false
  //for browser compatability.
  private partialUniformMatrix(
    gl : WebGLRenderingContext,
    fn: (
      loc: WebGLUniformLocation,
      transpose: boolean,
      value: Float32List
    ) => void
  ): (loc: WebGLUniformLocation, value: Float32List) => void {
    return (loc: WebGLUniformLocation, value: Float32List) =>
      fn.apply(gl, [loc, false, value]);
  }

  private withUniform(
    fnLookupByDataLength: Map<
      number,
      (uniform: WebGLUniformLocation, data: any) => void
    >,
    name: string,
    unMappedData: number | number[] | Int32Array | Float32Array
  ): GSGLProgramShader {
    const gl = this.gl;
    const data =
      typeof unMappedData === "number" ? [unMappedData] : unMappedData;

    if (!this.uniformData.has(name)) {
      const uniform = gl.getUniformLocation(this.program, name);

      if (uniform == null) {
        throw `failed to generate uniform ${name}`;
      }

      this.uniformData.set(name, uniform);
    }

    const uniform = this.uniformData.get(name);

    if (uniform == null) {
      throw `we are missing uniform for name ${name}`;
    }

    let uniformFunction: (
      uniform: WebGLUniformLocation,
      data: Float32List
    ) => void;

    const fn = fnLookupByDataLength.get(data.length);

    if (fn) {
      fn.apply(gl, [uniform, data]);
      return this;
    } else {
      throw `supplied ${data.length} array to the uniform webgl function`;
    }
  }

  apply(): GSGLShader {
    const gl = this.gl;

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    return this.shader;
  }
}

export class GSGLShader implements Shader {
  private program: WebGLProgram;
  private attributes: Map<String, GLint>;

  public constructor(
    private gl: WebGLRenderingContext,
    private id: string,
    private vertexShaderSrc: string,
    private fragmentShaderSrc: string
  ) {
    var program = gl.createProgram();

    if (program == null) {
      throw `Failed to create program ${id} as createProgram returned null`;
    }

    // attach the shaders.
    gl.attachShader(
      program,
      compileShader(gl, vertexShaderSrc, gl.VERTEX_SHADER)
    );
    gl.attachShader(
      program,
      compileShader(gl, fragmentShaderSrc, gl.FRAGMENT_SHADER)
    );

    // link the program.
    gl.linkProgram(program);

    // Check if it linked.
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
      // something went wrong with the link
      throw "program filed to link:" + gl.getProgramInfoLog(program);
    }
    this.attributes = new Map();
    this.program = program;
  }

  withAttribute(name: string, data: number[]): GSGLShader {
    const gl = this.gl;

    const attribute = gl.getAttribLocation(this.program, name);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(attribute, 3, gl.FLOAT, false, 0, 0);

    this.attributes.set(name, attribute);

    return this;
  }

  runProgram(): GSGLProgramShader {
    const gl = this.gl;
    gl.useProgram(this.program);

    this.attributes.forEach((attribute: GLint, key: String) => {
      gl.enableVertexAttribArray(attribute);
    });

    return new GSGLProgramShader(this, gl, this.program);
  }
}

function compileShader(
  gl: WebGLRenderingContext,
  src: string,
  shaderType: GLenum
) {
  gl.VERTEX_SHADER;

  // Create the shader object
  const shader = gl.createShader(shaderType);

  if (shader == null) {
    throw `Failed to create the shader for src\n ${src}\n as null was returned.`;
  }

  // Set the shader source code.
  gl.shaderSource(shader, src);

  // Compile the shader
  gl.compileShader(shader);

  // Check if it compiled
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    // Something went wrong during compilation; get the error
    throw "could not compile shader:" + gl.getShaderInfoLog(shader);
  }

  return shader;
}
