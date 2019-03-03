import { Game } from "./game";

class App {
	private _game: Game;

	constructor(game: Game) {
        this._game = game;
        this.gameLoop();
	}

	private gameLoop(): void {
        // need to bind the current this reference to the callback
        requestAnimationFrame(this.gameLoop.bind(this)); 
        
		this._game.render();
	}
}

window.onload = () => {
	let app = new App(new Game());
}