import { Color } from "./color";
import { Vector3 } from "../core/ecs";
import {vertexShader, fragmentShader, GSGLShader } from "./webgl";

export interface Renderer {
  redraw(): void;
  resize(width: number, height: number): void;
  drawChar(character: string, position: Vector3): void;
}

export interface Shader {
  withAttribute(name: string, data: number[]): Shader 
  runProgram() : ProgramShader
}

export interface ProgramShader{
  apply() : Shader;
  withUniformI(name: string, unMappedData: number | number[] | Int32Array) : ProgramShader
  withUniformF(name: string, unMappedData: number | number[] | Float32Array) : ProgramShader
  withUniformM(name : string, unMappedData: number[] | Float32Array) : ProgramShader
}

