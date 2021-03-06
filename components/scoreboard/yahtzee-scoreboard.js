import './scoreboard-row.js';
import './total-row.js';
import './names-row.js';

import style from './scoreboard-style.js';

import { shadowDom, map } from '../../util/dom.js';
import eventorise from '../../util/events.js';

import { upperSection, lowerSection, bothSections, isYahtzee } from './section-rules.js';

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

		const totalRow = (id, name, description) => {
			return `<total-row id="${id}"
				players="${this.playerCount}"
				${description ? `description="${description}"` : ''}
			>
				${name}
			</total-row>`;
		};

		shadowDom(this, `
			<style>${style}</style>
			<div class="names-section">
				<names-row players="${this.playerCount}" id="nameRow">
					Player names
				</names-row>
			</div>
			<div class="upper-section">
				${map(upperSection, scoreboardRow)}
				${totalRow('upperSubtotal', 'Upper section subtotal',
					'The number in brackets is how you’re doing compared to the three-of-every-number needed to get your bonus.')}
				${totalRow('upperBonus', 'Upper section bonus',
					'35 bonus points if you score a total of 63 in the upper section, equivalent to getting three ones, three twos, and so on.')}
				${totalRow('upperTotal', 'Upper section total')}
			</div>
			<div class="lower-section">
				${map(lowerSection, scoreboardRow)}
				${totalRow('yahtzeeBonus', 'Yahtzee bonus',
					'100 bonus points for subsequent yahtzees, if you scored your first one')}
				${totalRow('lowerTotal', 'Lower section total')}
			</div>
			<div class="totals-section">
				${totalRow('grandTotal', 'Grand total')}
			</div>
		`);

		this.allRows = [ ...this.shadowRoot.querySelectorAll('scoreboard-row') ];
		this.allDisplayRows = [
			...this.allRows,
			...this.shadowRoot.querySelectorAll('total-row'),
			this.nameRow
		];
		for (const row of this.allRows)
			row.scoreboard = this;
		this.reset();
	}

	reset() {
		this.rowScores = Object.fromEntries(bothSections.map(row => [ row.id, [] ]));
		this.currentPlayer = 0;
		this.updateTotals();
	}

	set currentPlayer(c) {
		this._currentPlayer = c;
		for (const row of this.allDisplayRows)
			row.currentPlayer = c;
	}
	get currentPlayer() { return this._currentPlayer; }

	// accepts a full row definition or just the id
	getRow(definition) {
		const id = definition.id || definition;
		return this.allRows.find(row => row.id == id);
	}

	updateTotals() {
		const upperSubtotal = [], upperSurplus = [],
			anyScored = [], anyUnscored = [];
		for (let player = 0; player < this.playerCount; ++player) {
			upperSubtotal[player] = 0;
			upperSurplus[player] = 0;
			for (let i = 0; i < 6; ++i) {
				const row = this.getRow(upperSection[i]);
				if (row.playerHasScored(player)) {
					const value = row.values[player];
					upperSubtotal[player] += value;
					upperSurplus[player] += value - (i + 1) * 3;
					anyScored[player] = true;
				} else anyUnscored[player] = true;
			}
		}
		this.upperSubtotal.values = upperSubtotal.map((total, i) => {
			const surplus = upperSurplus[i];
			return (anyScored[i] && anyUnscored[i] && total < 63)
				? `${total} (${surplus < 0 ? '−' : '+'}${Math.abs(surplus)})`
				: total;
		});
		this.upperBonus.values = upperSubtotal.map(n => 35 * (n >= 63));
		this.upperTotal.values = sumArrays([
			upperSubtotal,
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
		// in hindsight this should not be a getter
		this.gameOver;
	}

	async scoreDice(dice) {
		// yahtzee bonus...
		if (isYahtzee(dice) && this.getRow('yahtzee').values[this.currentPlayer] > 0)
			this.yahtzeeBonus.increase(this.currentPlayer, 100);

		// regular points...
		for (const row of this.allRows)
			row.scoreDice(dice, () => {
				for (const row of this.allRows)
					row.cancelScoring();
				this.updateTotals();
				if (++this.currentPlayer == this.playerCount)
					this.currentPlayer = 0;
				this.emit('score', row, dice);
			});
	}

	unscore(row) {
		if (!this.currentPlayer--) this.currentPlayer = this.playerCount - 1;
		row.clearScore(this.currentPlayer);
		this.updateTotals();
	}

	get gameOver() {
		for (const row of this.allRows)
			if (!row.complete)
				return false;
		this.currentPlayer = null;
		return true;
	}
}

eventorise(YahtzeeScoreboard.prototype);
window.customElements.define('yahtzee-scoreboard', YahtzeeScoreboard);
