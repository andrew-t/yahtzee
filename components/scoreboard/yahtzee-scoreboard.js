import './scoreboard-row.js';
import './total-row.js';

import { shadowDom, map } from '../../util/dom.js';

import { upperSection, lowerSection, bothSections } from './section-rules.js';

const style = `

`;

function sumArrays(arrays) {
	return arrays.reduce((p, n) => p.map((v, i) => v + n[i]));
}

export class YahtzeeScoreboard extends HTMLElement {
	constructor() {
		super();

		this.playerCount = parseInt(this.getAttribute('players'), 10) || 1;

		const scoreboardRow = row => {
			return `<scoreboard-row
				id="${row.id}"
				players="${this.playerCount}">
			</scoreboard-row>`;
		};

		const totalRow = (id, name) => {
			return `<total-row id="${id}" players="${this.playerCount}">
				${name}
			</total-row>`;
		};

		shadowDom(this, `
			<style>${style}</style>
			<div class="upper-section">
				${map(upperSection, scoreboardRow)}
				${totalRow('upperSubtotal', 'Upper section subtotal')}
				${totalRow('upperBonus', 'Upper section bonus')}
				${totalRow('upperTotal', 'Upper section total')}
			</div>
			<div class="lower-section">
				${map(lowerSection, scoreboardRow)}
				${totalRow('yahtzeeBonus', 'Yahtzee bonus')}
				${totalRow('lowerTotal', 'Lower section total')}
			</div>
			<div class="totals-section">
				${totalRow('grandTotal', 'Grand total')}
			</div>
		`);

		this.allRows = [ ...this.shadowRoot.querySelectorAll('scoreboard-row') ];
		for (const row of this.allRows)
			row.scoreboard = this;
		this.reset();
	}

	reset() {
		this.rowScores = Object.fromEntries(bothSections.map(row => [ row.id, [] ]));
		this.currentPlayer = 0;
		this.updateTotals();
	}

	// accepts a full row definition or just the id
	getRow(definition) {
		const id = definition.id || definition;
		return this.allRows.find(row => row.id == id);
	}

	updateTotals() {
		this.upperSubtotal.values = sumArrays(
			upperSection.map(r => this.getRow(r).values));
		this.upperBonus.values = this.upperSubtotal.values.map(n => 35 * (n >= 63));
		this.upperTotal.values = sumArrays([
			this.upperSubtotal.values,
			this.upperBonus.values
		]);
		this.lowerTotal.values = sumArrays([
			...lowerSection.map(r => this.getRow(r).values),
			this.yahtzeeBonus.values
		]);
		this.grandTotal.values = sumArrays([
			this.upperTotal.values,
			this.lowerTotal.values
		]);
	}

	scoreDice(dice) {
		return new Promise(resolve => {
			for (const row of this.allRows)
				row.scoreDice(dice, () => resolve(row.id));
		}).then(row => {
			for (const row of this.allRows)
				row.cancelScoring();
			if (++this.currentPlayer == this.playerCount)
				this.currentPlayer = 0;
			this.updateTotals();
		});
	}

	get gameOver() {
		for (const row of this.allRows)
			if (!row.complete)
				return false;
		return true;
	}
}

window.customElements.define('yahtzee-scoreboard', YahtzeeScoreboard);
