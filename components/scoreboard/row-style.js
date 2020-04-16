export default `
	:host {
		display: flex;
		width: 100vw;
	}

	.name {
		flex: 5em 1 1;
	}

	.value {
		flex: 4em 0 0;
		text-align: center;
		font-size: inherit;
		font-family: inherit;
		color: inherit;
		border: 0;
		background: none;
		margin: 0;
		padding: 0;
	}

	button.value:not(:disabled) {
		animation: pulse 300ms infinite alternate;
	}
	button.value:not(:disabled):hover {
		color: blue;
		text-decoration: underline;
		animation: none;
	}

	@keyframes pulse {
		from { opacity: 0.6; }
		to { opacity: 0.4; }
	}
`;
