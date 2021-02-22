export default `
	:host {
		border: 2px solid black;
		border-radius: 1em;
		display: block;
		overflow: hidden;
		background: white;
	}

	total-row {
		background: #eee;
	}

	names-row:hover,
	scoreboard-row:hover,
	total-row:hover {
		background: #ddd;
	}

	scoreboard-row:not(:first-child),
	total-row {
		border-top: 1px solid black;
	}

	.upper-section,
	.lower-section,
	.totals-section {
		border-top: 2px solid black;
	}

	@media (prefers-color-scheme: dark) {
		:host { background: black; border-color: white; }
		.upper-section,
		.lower-section,
		.totals-section,
		scoreboard-row:not(:first-child),
		total-row { border-color: white; }
		total-row { background: #333; }
		names-row:hover,
		scoreboard-row:hover,
		total-row:hover { background: #333; }
	}
`;
