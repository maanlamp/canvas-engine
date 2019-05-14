"use strict";
import assert from "./Assert.js";
import { canvasCSSRules } from "./CSSRules.js";
import Types from "./Types.js";

export default class Canvas {
	constructor (options = {
		width: 640,
		height: 480
	}) {
		this.__SAVEDCTX = {};
		this.__ELEMENT = document.createElement("canvas");
		this.__CTX = this.__ELEMENT.getContext(options.contextType || "2d");
		this.resizeTo(options);
	}

	/** Get the actual canvas. */
	get element () {
		return this.__ELEMENT;
	}

	/** Get the canvas width. */
	get width () {
		return this.__WIDTH;
	}

	/** Get the canvas height. */
	get height () {
		return this.__HEIGHT;
	}

	/**
	 * Get the width and height of the canvas.
	 * @returns {{0: number, 1: number, width: number, height: number}} An array that contains the width and height as numeric and literal properties.
	*/
	get size () {
		return Object.assign([this.__WIDTH, this.__HEIGHT], {
			width: this.__WIDTH,
			height: this.__HEIGHT,
		});
	}

	/**
	 * Resizes the canvas.
	 * @param {(number|{width: number, height: number})} width Either a numerical value, or an object with the properties `width` and `height`, to resize to.
	 * @param {number} [height] A numerical value to resize to height-wise. Will default to `width`.
	*/
	resize (width, height = width) {
		if (width instanceof Object) return this.resizeTo(width);
		this.save();
		this.__WIDTH = width;
		this.__HEIGHT = height;
		this.__ELEMENT.width = this.__WIDTH;
		this.__ELEMENT.height = this.__HEIGHT;
		this.restore();
		return this;
	}

	/**
	 * Resizes the canvas to another object.
	 * @param {{width: number, height: number}} targetSize An object with the properties `width` and `height`, to resize to.
	*/
	resizeTo (targetSize) {
		assert(targetSize.innerWidth !== undefined)
			.or(targetSize.width !== undefined)
			.error(`Cannot resize to ${targetSize} because it does not have a (inner)width.`);
		const w = targetSize.innerWidth || targetSize.width;
		const h = targetSize.innerHeight || targetSize.height || w;
		this.resize(w, h);
		return this;
	}

	/** Saves the current drawing context. */
	save () {
		for (const property in this.__CTX) {
			const value = this.__CTX[property];
			if (typeof value === Types.String || typeof value === Types.Number) this.__SAVEDCTX[property] = value;
		}
		return this;
	}

	/** Restores the previous drawing context. */
	restore () {
		Object.assign(this.__CTX, this.__SAVEDCTX);
		return this;
	}

	/**
	 * Clears the canvas.
	 * @param {(number|string)} [x] Either the x-coordinate from where to begin a `clearRect`, or a CSSColor to clear the entire canvas with.
	 * @param {number} [y] The y-coordinate from where to begin a `clearRect`. Defaults to `0`.
	 * @param {number} [w] The width of a `clearRect`. Defaults to `canvas.width`.
	 * @param {number} [h] The height of a `clearRect`. Defaults to `canvas.height`.
	*/
	clear (
		x = 0,
		y = 0,
		w = this.width,
		h = this.height
	)	{
		if (typeof x === Types.String) {
			const prevStyle = this.__CTX.fillStyle;
			this.__CTX.fillStyle = x;
			this.fillRect();
			this.__CTX.fillStyle = prevStyle;
		} else this.__CTX.clearRect(x, y, w, h);
		return this;
	}

	/**
	 * Draws text on the canvas.
	 * @param {string} str The string to draw.
	 * @param {number} [x] The x-coordinate where `str` will be drawn. Defaults to `0`.
	 * @param {number} [y] The y-coordinate where `str` will be drawn. Defaults to `0`.
	 * @param {number} [type] Drawing type. Can be either `"fill"` or `"stroke"`. Defaults to `"fill"`.
	 * @param {any} [maxWidth] The maximum width of the drawn string in pixels. No max by default.
	*/
	text (str, x = 0, y = 0, type = "fill", maxWidth) {
		this.__CTX[`${type}Text`](str, x, y, maxWidth);
		return this;
	}

	/**
	 * Sets the style of the canvas context.
	 * @param {string} css CSS-like declarations.
	 * @param {number} [forceRaw] Determines whether or not to skip valid parsing to increase performance. Set to true only if you are sure `css` is valid canvas styling.
	*/
	style (css, forceRaw) {
		if (forceRaw) css
			.split(/;|\r?\n/)
			.map(line => line.split(/:\s*/))
			.forEach(rule => this.__CTX[rule[0]] = rule[1]);
		else canvasCSSRules
			.process(css)
			.forEach(rule => this.__CTX[rule.property] = rule.value);
		return this;
	}

	/**
	 * Draws an image on the canvas.
	 * @param {CanvasImageSource} image The source of the image to draw.
	 * @param {number} [sx] The x-coordinate for drawing. Defaults to `0`.
	 * @param {number} [sy] The y-coordinate for drawing. Defaults to `0`.
	*/
	drawImage (image, sx = 0, sy = 0, sw = image.width, sh = image.height, dx = 0, dy = 0, dw = image.width, dh = image.height) {
		this.__CTX.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
		return this;
	}

	/**
	 * Gets ImageData from canvas.
	 * @param {number} [sx] The x-coordinate to get data from. Defaults to `0`.
	 * @param {number} [sy] The y-coordinate to get data from. Defaults to `0`.
	 * @param {number} [sw] The width to get data from. Defaults to `this.width`.
	 * @param {number} [sh] The height to get data from. Defaults to `this.height`.
	*/
	getImageData (sx = 0, sy = 0, sw = this.width, sh = this.height) {
		return this.__CTX.getImageData(sx, sy, sw, sh)
	}

	/**
	 * Draw a filled rectangle.
	 * @param {number} [x] The x-coordinate to draw the rectangle at. Defaults to `0`.
	 * @param {number} [y] The y-coordinate to draw the rectangle at. Defaults to `0`.
	 * @param {number} [w] The width of the drawn rectangle. Defaults to `this.width`.
	 * @param {number} [h] The height of the drawn rectangle. Defaults to `this.height`.
	*/
	fillRect (x = 0, y = 0, w = this.width, h = this.height) {
		this.__CTX.fillRect(x, y, w, h);
		return this;
	}
}