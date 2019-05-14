"use strict";

import err from "../err.js";

export default class Ticker {
	constructor () {
		this._speed = 1;
		this._listeners = new Array();
		this._started = false;
		this._lasttime = 0;
		this._deltatime = 1;
		this._id = null;
		this._lasttps = 0;
		this._boundtick = this._tick.bind(this);
		this._listenerLength = this._listeners.length;
	}

	__setSpeed(speed) {
		this.stop();
		this._speed = speed;
		this.start();
	}
	__getSpeed () {
		return this._speed;
	}
	speed (speed) {
		if (!speed)
			return this.__getSpeed();

		this.__setSpeed(speed);
	}

	__setTps (tps) {
		this._baseTicksPerSecond = tps;
	}
	__getTps () {
		//MAYBE IMPLEMENT TICKSMOOTHING
		const tps = Math.floor(1 / this._deltatime);
		const avg = Math.ceil((this._lasttps + tps) / 2);
		this._lasttps = tps;
		return avg;
	}
	tps (tps) {
		if (!tps)
			return this.__getTps();

		this.__setTps(tps);
	}

	isRunning () {
		return this._started;
	}

	deltatime () {
		return this._deltatime;
	}

	_tick (time) {
		if (this._started) {
			this.update(time);
			if (!this._listeners.length)
				this.stop();
		}
	}

	start () {
		if (this._started) return;
		this._started = true;
		this._tick(this._deltatime);
		this._id = setInterval(this._boundtick, 1000 / (60 * this._speed));
	}

	stop () {
		if (this._id) {
			clearInterval(this._id);
			this._id = null;
		}
		this._started = false;
	}

	update (currentTime = performance.now()) {
		if (currentTime > this._lasttime)
			this._deltatime = (currentTime - this._lasttime) / 1000;

		this._lasttime = currentTime;
		let i = this._listenerLength;
		while (i--)
			this._listeners[i].handler(this._deltatime);
	}

	__addListenerObject ({
		handler,
		context = this,
		priority = 0,
		once = false
	} = {}) {
		this._listeners.push({
			handler: handler.bind(context),
			priority,
			once});
	}
	__addListenerFunction (fn) {
		this._listeners.push({
			handler: fn,
			priority: 0,
			once: false});
	}
	add (argument) {
		if (argument.handler)
			this.__addListenerObject(argument);
		else if (typeof argument === "function")
			this.__addListenerFunction(argument);
		else
			throw err("Unsupported tick listener.");

		this._listenerLength = this._listeners.length;
		this.start();
		return this;
	}
}