import { Renderer} from "./client-engine/renderer";
import { eq, World, Vector3 } from "./core/ecs";
import {Screen} from "./client-engine/screen"
import {WebGLRenderer} from "./client-engine/webgl"


class Main {
	constructor(private screen : Screen) {
		const world = new World();
		const player = world.createEntity("cln", {
			'position': new Vector3(32, 0, 32),
			'sprite': '@',
			'visible': true
		})

        this.animationLoop();
	}

	private animationLoop(): void {
        // need to bind the current this reference to the callback
		this.screen.redraw();
		requestAnimationFrame(this.animationLoop.bind(this)); 
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

	const renderer = new WebGLRenderer(nullableCtx);
	let app = new Main(new Screen(canvas.clientWidth, canvas.clientHeight, renderer));
}