"use strict";

import Game from "./modules/Game.js";
import Ticker from "./modules/plugins/Ticker.js";
import Keybinds from "./modules/plugins/Keybinds.js";
import keybindData from "./data/keybinds.js";
import Renderer from "./modules/plugins/Renderer.js";

const game = new Game();
console.log(game);
window.game = game;

void function main () {
	game
		.plugin(Keybinds, keybinds => keybinds
			.add(keybindData))
		.plugin(Renderer, renderer => renderer.viewport
			.style(`
				font: 13px "Fira Code";
				fill: #B3FF1C;
				anti-aliasing: true high;`))
		.plugin(Ticker, ticker => ticker
			.add(() => void game.get("Renderer").viewport //INVESTIGATE WHY THIS USES SO MUCH MEMORY, MAYBE ITS JUST THE INTERNALS?
				.clear("black")
				.text(ticker.tps() + " ticks/s, deltatime: " + ticker.deltatime(), 6, 18)));
}();