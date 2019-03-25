import { stringify } from "querystring";

export const vertexShader = `
    attribute vec3 squareVertexPosition;

    void main(void){
        gl_Position = vec4(squareVertexPosition, 1.0);
    }
`;

export const fragmentShader = `
void main(void){
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);      
}                    
`;

export function createGSGLProgram(
  gl: WebGLRenderingContext,
  programName: string,
  vertexShaderSrc: string,
  fragmentShaderSrc: string
): WebGLProgram {
  // create a program.
  var program = gl.createProgram();

  if (program == null) {
    throw `Failed to create program ${programName} as createProgram returned null`;
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

  return program;
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
