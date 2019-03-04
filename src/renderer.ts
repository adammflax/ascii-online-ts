export interface Renderer{
	render() : void
}


export class WebGLRenderer implements Renderer{
	private ctx: WebGLRenderingContext;

	constructor(ctx : WebGLRenderingContext) {
		this.ctx = ctx;
	}


	public render(): void {
		//console.log('test!');
	}
}