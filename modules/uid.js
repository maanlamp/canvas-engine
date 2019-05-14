"use strict";

function rand () {
	return ((Math.random() * 16) | 0).toString(16);
}

export default function uid () {
	return "x"
		.repeat(16)
		.replace(/x/g, rand)
}