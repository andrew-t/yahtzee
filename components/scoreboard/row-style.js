export default `
	:host {
		display: flex;
		width: 100%;
	}

	@media (min-width: 30em) {
		.name {
			padding-left: 1.5em !important;
		}
	}

	.name, .value-cell {
		padding: 0.5em;
		font-family: sans-serif;
		box-sizing: content-box;
	}

	.name {
		flex: 15em 0.2 1;
	}

	.value-cell {
		flex: 4em 1 0;
		width: 4em;
		text-align: center;
		font-size: inherit;
		color: inherit;
		border: none;
		border-left: 1px solid black;
		background: none;
		margin: 0;
	}

	.current-player { background: #fec; }

	.value:focus {
		outline: none;
		box-shadow: 0 0 0 2px inset #fc4;
	}

	button.value:not(:disabled) {
		background: #ffc;
		cursor: pointer;
	}

	button.value.zero:not(:disabled) {
		background: #fcc;
	}

	button.value:not(:disabled):hover {
		color: blue;
		background: #ff8;
		text-decoration: underline;
	}

	button:disabled:not(:empty) {
		background: white !important;
	}
`;
