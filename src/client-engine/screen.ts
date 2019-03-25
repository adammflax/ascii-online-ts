import { Renderer } from "./renderer";

export class Screen {
  public constructor(
    private width: number,
    private height: number,
    private renderer: Renderer
  ) {
    this.renderer.resize(width, height);
  }

  public redraw() : void{
      this.renderer.redraw();
  }
}
