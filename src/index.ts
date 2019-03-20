import { Renderer, WebGLRenderer } from "./renderer";
import { eq, World } from "./ecs";


class Main {
	private renderer: Renderer;

	constructor(renderer : Renderer) {
		const world = new World();
		world.find({
			"test": eq(7),
			"bob": eq(true),
		});

		this.renderer = renderer;
        	this.animationLoop();
	}

	private animationLoop(): void {
        // need to bind the current this reference to the callback
        requestAnimationFrame(this.animationLoop.bind(this)); 
		this.renderer.render();
	}
}


window.onload = () => {
	const canvas = <HTMLCanvasElement>document.getElementById('canvas');
		
	if(canvas == null){
		throw Error("unable to locate canvas.");
	}

	const nullableCtx = canvas.getContext("webgl") || 
				canvas.getContext("experimental-webgl") ;
	
	if(nullableCtx == null){
		throw Error("filed to create a webGl context");
	}
		
	let app = new Main(new WebGLRenderer(nullableCtx));
}