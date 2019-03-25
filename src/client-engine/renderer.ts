import { Color } from "./color";
import { Vector3 } from "../core/ecs"
import { createGSGLProgram, vertexShader, fragmentShader } from "./webgl";

export interface Renderer {
  redraw(): void;
  resize(width: number, height: number): void;
  drawChar(character : string, position : Vector3) : void;
}

const verticies = [0.5,0.5,0,-0.5,0.5,0,0.5,-0.5,0,-0.5,-0.5, 0];

export class WebGLRenderer implements Renderer {
  private ctx: WebGLRenderingContext;
  private width: number = 0;
  private height: number = 0;
  private program : WebGLProgram;
  private attribute: GLint;

  constructor(ctx: WebGLRenderingContext) {
	this.ctx = ctx;

	const gl = this.ctx;
	this.program = createGSGLProgram(ctx,"squareShader", vertexShader, fragmentShader);
	this.attribute = gl.getAttribLocation(this.program, "squareVertexPosition");

	const gSquareBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, gSquareBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, gSquareBuffer);
	gl.vertexAttribPointer(this.attribute, 3, gl.FLOAT, false, 0,0);
  }

  public redraw(): void {
	const gl = this.ctx;
	this.clear(gl);

	gl.useProgram(this.program);
	gl.enableVertexAttribArray(this.attribute);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  public resize(width: number, height: number): void {
	this.width, height = width, height;
  }
  																	
  public drawChar(character : string, position: Vector3){

  }

  private clear(gl: WebGLRenderingContext) {
   	//gl.viewport(0, 0, this.width, this.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }
}
