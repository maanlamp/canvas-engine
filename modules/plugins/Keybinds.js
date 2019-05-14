"use strict";

import uid from "../uid.js";
import err from "../err.js";

export default class Keybinds {
	constructor () {
		this.__BINDS = new Map();
	}

	__activateNewBinds () {
		Array.from(this.__BINDS)
			.sort((a, b) => a.priority > b.priority) //CHECK IF THIS ACTUALLY SORTS PROPERLY
			.forEach(([_,bind]) => {
				if (bind.active) return;
				function handler (event) {
					if (bind.preventDefault) event.preventDefault();
					const keys = bind.combo
						.split(/\+| /)
						.map(key => key.toLowerCase());
					const keytoCheck = keys[keys.length - 1];
					const ctrl = keys.includes("ctrl");
					const shift = keys.includes("shift");
					if ((bind.when)
						&& (event.key.toLowerCase() === keytoCheck)
						&& (ctrl ? event.ctrlKey : true)
						&& (shift ? event.shiftKey : true)) bind.do(event);
				}
				bind.active = true;
				bind.__INTERNALHANDLER = handler;
				bind.target.addEventListener(bind.type, bind.__INTERNALHANDLER);
			});
	}

	addOne (bind) {
		const id = uid();
		this.__BINDS.set(id, Object.assign({
			preventDefault: false,
			target: window,
			when: true,
			priority: 0
		}, bind));
		this.__activateNewBinds();
		return id;
	}
	addMultiple (binds) {
		return binds.map(bind => this.addOne(bind));
	}
	add (argument) {
		if (argument.length) return this.addMultiple(argument);
		else if (bind.type && argument.combo && argument.do) return this.addOne(argument);
		else err("Unsupported keybind.");
	}

	remove (uid) {
		const bind = this.__BINDS.get(uid);
		if (!bind) return false;
		if (bind.active) bind.target.removeEventListener(bind.type, bind.__INTERNALHANDLER);
		return this.__BINDS.delete(uid);
	}
}