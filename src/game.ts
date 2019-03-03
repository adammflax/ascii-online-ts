export class Game {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D | null;
	private height: number = window.innerHeight;
	private width: number = window.innerWidth;

	constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
		this.canvas.width = this.width;
		this.canvas.height = this.height;
        let ctxNullable = this.canvas.getContext("2d");
        
        if(ctxNullable == null){
            throw Error('missing context');
        }

        this.ctx = ctxNullable;
	}

	public render(): void {
		//console.log('test!');
	}
}