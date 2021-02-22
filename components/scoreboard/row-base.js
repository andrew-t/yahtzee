export default class RowBase extends HTMLElement {
	constructor() {
		super();
		this.playerCount = parseInt(this.getAttribute('players'), 10) || 1;
	}

	set currentPlayer(c) {
		this._currentPlayer = c;
		const cells = [ ...this.shadowRoot.querySelectorAll('.value-cell') ];
		for (let i = 0; i < this.playerCount; ++i)
			if (i == c) cells[i].classList.add('current-player');
			else cells[i].classList.remove('current-player');
	}
	get currentPlayer() { return this._currentPlayer; }
}