//This has to be a js file so that you can define functions. If JSON input is desired we
//either need to write a custom parser for allowing function declarations,
//or have a specific syntax to mutate the parsed JS object after its parsing.

export default [
	{
		combo: "ctrl+r",
		type: "keydown",
		do (event) {
			console.log("hey");
			// window.location.reload(true);
		}
	}
];