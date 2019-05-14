"use strict";
import assert from "./Assert.js";

export default class Game {
	constructor () {
		this.__USERDATA = new Object();
		this.plugins = new Map();
	}

	/**
	 * Adds to a key-value pair in `game`'s userdata
	 * @param {string} key - Must be the key to an `Array`.
	 * @param {any} value
	 */
	add (key, value) {
		assert(this.__USERDATA[key] !== undefined)
			.error(`No property "${key}" found in userdata.`);
		assert(this.__USERDATA[key] instanceof Array)
			.error(`Cannot add to a non-array value: [${typeof this.__USERDATA[key]} ${this.__USERDATA[key].constructor.name}]`);
		this.__USERDATA[key].push(
			(value instanceof Function)
				? value(this)
				: value);
		return this;
	}

	/**
	 * Sets a key-value pair in `game`'s userdata
	 * @param {string} key
	 * @param {any} value
	 */
	set (key, value) {
		this.__USERDATA[key] = value;
		return this;
	}

	/**
	 * "Enters" a value from `game`'s userdata.
	 * @param {string} key - `game.get` will be called internally to get the value that belongs to `key`.
	 * @param {function} handler - A function that is called with the value of `game.get(key)`.
	 */
	enter (key, handler) {
		handler(this.get(key));
		return this;
	}

	/**
	 * Gets the value of a key-value pair in `game`'s userdata. If _handler_ is defined, calls `game.enter` instead.
	 * @param {string} key
	 * @param {function} [handler] - A function that is called with the value of `game.get(key)`.
	 */
	get (key, handler) {
		if (typeof handler === "function") return this.enter(key, handler);
		return this[key] || this.__USERDATA[key] || this.plugins.get(key);
	}

	plugin (plugin, handler) {
		//TODO
		//transform to plugin system
		//All big modules should probaly be plugins, and small modules should probably be only used in one plugin
		const instance = new plugin();
		if (handler) handler(instance);
		this.plugins.set(plugin.name, instance);
		return this;
	}
}