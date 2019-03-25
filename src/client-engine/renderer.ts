import { Color } from "./color";
import { Vector3 } from "../core/ecs";
import {vertexShader, fragmentShader, GSGLShader } from "./webgl";

export interface Renderer {
  redraw(): void;
  resize(width: number, height: number): void;
  drawChar(character: string, position: Vector3): void;
}

export interface Shader {
  apply(): void;
}

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

    this.program.apply();
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
