"use strict";
import Types from "./Types.js";

export class CSSRules {
	constructor () {
		this.shorthands = new Map();
		this.aliases = new Map();
	}

	_replaceAliases (rule) {
		const alias = this.aliases.get(rule.property);
		if (alias === undefined) return rule;
		rule.property = alias
		return rule;
	}

	_expandShorthands (rule) {
		const shorthands = this.shorthands.get(rule.property);
		if (shorthands === undefined) return rule;
		return Object.entries(shorthands).map(([shorthand, ...tempValues], i) => {
			const possibleValues = tempValues.flat();
			if (typeof possibleValues[0] !== Types.Number && !possibleValues.includes(rule.values[i])) {
				console.warn(`Value "${rule.values[i]}" is not allowed for property "${shorthand}", and is therefore set to the default value of "${possibleValues[0]}". It must be one of the following: ${possibleValues.map(str => `"${str}"`).slice(0, -1).join(", ")} or "${possibleValues[possibleValues.length - 1]}".`);
				return {property: shorthand, value: possibleValues[0]};
			}
			return {property: shorthand, value: rule.values[i]};
		});
	}

	_stringToLiteral (rule) {
		rule.value = (rule.value === "true" && true)
			|| (rule.value === "false" && false)
			|| (/\d+/.test(rule.value) && Number(rule.value))
			|| rule.value
			|| rule.values.join(" ");
		delete rule.values;
		return rule;
	}

	alias (pattern, replacement) {
		this.aliases.set(pattern, replacement);
		return this;
	}

	shorthand (pattern, replacements) {
		this.shorthands.set(pattern, replacements);
		return this;
	}

	process (css) {
		return css
			.split(/;|\r?\n/)
			.filter(line => !/^\s*$/.test(line))
			.map(line => line
				.split(/:/)
				.map(str => str.trim()))
			.map(([property, values]) => ({
				property,
				values: values.split(/ /)}))
			.map(rule => this._replaceAliases(rule))
			.map(rule => this._expandShorthands(rule))
			.flat()
			.map(rule => this._stringToLiteral(rule));
	}
}

export const canvasCSSRules = (new CSSRules())
	.alias("colour", "color")
	.alias("fill", "fillStyle")
	.alias("stroke", "strokeStyle")
	.alias("alpha", "globalAlpha")
	.alias("anti-aliasing", "imageSmoothing")
	.shorthand("global", {
		globalAlpha: 1,
		globalCompositeOperation: ["source-over", "source-in", "source-out", "source-atop", "destination-over", "destination-in", "destination-out", "destination-atop", "lighter", "copy", "xor", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"]})
	.shorthand("imageSmoothing", {
		imageSmoothingEnabled: ["true", "false"],
		imageSmoothingQuality: ["high", "medium", "low"]})
	.shorthand("line", {
		lineWidth: 2,
		lineJoin: ["bevel", "round", "miter"],
		lineCap: ["butt", "round", "square"],
		lineDashOffset: 0,
		miterLimit: 10})
	.shorthand("shadow", {
		shadowOffsetX: 0,
		shadowOffsetY: 0,
		shadowBlur: 5,
		shadowColor: "black"})
	.shorthand("text-align", {
		textAlign: ["start", "end", "left", "right", "center"],
		textBaseline: ["alphabetic", "top", "hanging", "middle", "ideographic", "bottom"]});