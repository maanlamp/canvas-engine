"use strict";

import { loadImage, loadJSON } from "./modules/Load.js";
import { fpsFromDeltatime } from "./modules/Frames.js";
import ResetableTimeout from "./modules/ResetableTimeout.js";
import Canvas from "./modules/Canvas.js";
import Game from "./modules/Game.js";
import keybinds from "./data/keybinds.js";
import Spritesheet from "./modules/Spritesheet.js";
import assert from "./modules/Assert.js";

const game = new Game();
console.log(game);
window.game = game;

void function createMainView () {
	const canvas = new Canvas(window);
	const resizeTimeout = new ResetableTimeout({
		timeout: 200,
		handler () {canvas.resize(window)}
	});

	document.body.appendChild(canvas.element);
	window.addEventListener("resize", () => resizeTimeout.reset());

	return game
		.bindkeys(keybinds)
		.set("viewport", canvas)
		.set("views", new Array())
		.set("entities", new Array())
		.set("spritesheet", new Spritesheet())
		.add("views", game.get("viewport"))
		.enter("viewport")
			.clear()
			.style(`
				font: 13px "Fira Code";
				fill: black;
				image-smoothing: true high;`)
			.exit();
}();

// void function tick (game) {
// 	const deltaTime = game.deltaTime();

// 	game
// 		.enter("viewport")
// 			.clear(6, 8, 15, 12)
// 			.text(fpsFromDeltatime(deltaTime), 6, 18)
// 			.drawImage(game.get("spritesheet").canvas.element, 50, 50);

// 	return requestAnimationFrame(timestamp => {
// 		game.update(timestamp);
// 		tick(game)});
// }(game);

game
	.enter("spritesheet")
		.canvas
		.style(`fill: red`)
		.fillRect();

game
	.enter("viewport")
	.drawImage(game.get("spritesheet").canvas.element);

// game.__USERDATA.viewport.__CTX.drawImage(game.__USERDATA.spritesheet.canvas.element, 0, 0)

// void function delegateRenderingOffscreen () {
// 	const renderThread = new Worker("modules/Worker.js");
// 	const offscreenCanvas = document
// 		.querySelector("canvas")
// 		.transferControlToOffscreen();

// 	renderThread.postMessage({
// 		message: "init",
// 		canvas: offscreenCanvas
// 	}, [offscreenCanvas]);
// }();