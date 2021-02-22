export const buttonStyle = `
	button {
		font-family: sans-serif;
		font-size: inherit;
		padding: 0.5em 1em;
		margin: 0.5em 1em;
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
	@media (prefers-color-scheme: dark) {
		:host { background: black; border-color: white; }
	}
`;

export default `
	:host {
		text-align: center;
		display: grid;
		grid-template-columns: 1fr 2fr;
		grid-template-rows: auto auto;
		border-top: 2px solid black;
		background: white;
		padding: 0.5em 0;
	}

	holdable-die {
		width: 18vmin;
		height: 18vmin;
	}

	.dice,
	#startButton {
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

	#startButton:disabled {
		display: none;
	}
	#startButton {
		z-index: 1;
		display: inline-block;
		padding: calc(9vmin - 1.75em) 0;
	}
`;
