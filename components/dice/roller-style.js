export const buttonStyle = `
	button {
		font-family: sans-serif;
		font-size: inherit;
		padding: 0.5em 2em;
		margin: 0.5em 2em;
		border: 1px solid black;
		cursor: pointer;
	}
	button:not(:disabled):hover {
		box-shadow: 0 0 0 1px #000;
	}
	button:focus {
		outline: none;
		box-shadow: 0 0 0 3px #fd8;
	}
	button:not(:disabled):hover:focus {
		outline: none;
		box-shadow: 0 0 0 1px #000, 0 0 0 3px #fd8;
	}
`;

export default `
	:host {
		text-align: center;
		display: grid;
		grid-template-columns: 1fr 2fr;
		grid-template-rows: auto auto;
	}

	holdable-die {
		width: 18vmin;
		height: 18vmin;
	}

	.dice,
	done-button {
		grid-column: 1 / span 2;
		grid-row: 1 / span 1;
	}

	#rollsLeft {
		grid-column: 1 / span 1;
		grid-row: 2 / span 1;
		font-family: sans-serif;
		padding: calc(2em + 1px) 2em;
		text-align: right;
	}

	#rerollButtons {
		grid-column: 2 / span 1;
		grid-row: 2 / span 1;
		font-family: sans-serif;
		padding: 1em;
		text-align: left;
	}

	${buttonStyle}

	done-button:not(.active) {
		display: none;
	}
	done-button {
		z-index: 1;
		display: inline-block;
		padding: 2.5em;
	}
`;
