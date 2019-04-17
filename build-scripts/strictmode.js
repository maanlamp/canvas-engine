"use strict";
const firstline = require("firstline");
const insertline = require("insert-line");
const fs = require("fs").promises;
const args = process.argv.slice(2);
const [fromDir, toDir = fromDir] = args;
const path = require("path");
const normalise = path.normalize;

if (!fromDir) err("Please provide a source folder.");
fs.stat(fromDir).catch(mkErr(`Source directory '${fromDir}' does not exist.`));
fs.stat(toDir).catch(mkErr(`Target directory '${toDir}' does not exist.`));

fs
	.readdir(fromDir, "utf8")
	.catch(mkErr(`Source directory '${fromDir}' cannot be accessed.`))
	.then(urls => urls
		.forEach(url => (path.extname(url) === ".js")
			&& firstline(`${fromDir}/${url}`)
				.then(firstLine => (!firstLine.startsWith(`"use strict"`))
					&& ((fromDir === toDir)
						?	Promise.resolve(`${toDir}/${url}`)
						: fs.copyFile(`${fromDir}/${url}`, `${toDir}/${url}`).then(() => `${toDir}/${url}`))
							.then(url => (console.log(`Set strict: ${normalise(`${fromDir}/${url}`)} -> ${normalise(`${toDir}/${url}`)}`),
								insertline(url)
									.prepend(`"use strict";`)))
							.catch(err))
				.catch(err)))
	.catch(err);

console.log("Done\n");

function mkErr (reason) {
	return () => err(reason);
}

function err (err, code = 1) {
	const reason = (typeof err === "string")
		? err
		: err.toString();
	console.error(reason);
	return process.exit(err.errno || code);
}