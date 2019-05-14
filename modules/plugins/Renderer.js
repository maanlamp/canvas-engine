"use strict";

import Canvas from "../Canvas.js";
import ResetableTimeout from "../ResetableTimeout.js";

export default class Renderer {
	constructor () {
		const canvas = new Canvas(window);
		const resizeTimeout = new ResetableTimeout({
			timeout: 200,
			handler () {canvas.resize(window)}
		});
		document.body.prepend(canvas.element);
		window.addEventListener("resize", () => resizeTimeout.reset());
		this.viewport = canvas;
	}
}