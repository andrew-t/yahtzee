import { shadowDom, multiple } from '../../util/dom.js';

import {
	upperSection, lowerSection, bothSections,
	upperSectionNames,
	isYahtzee
} from './section-rules.js';

import RowBase from './row-base.js';
import style from './row-style.js';

export class ScoreboardRow extends RowBase {
	constructor() {
		super();

		Object.assign(this, bothSections.find(({ id }) => id == this.id));

		shadowDom(this, `
			<style>${style}</style>
			<span class="name" title="${this.description}">${this.name}</span>
			${multiple(`<button class="value-cell value" disabled></button>`, this.playerCount)}
		`);
		this.valueEls = [ ...this.shadowRoot.querySelectorAll('.value') ];

		this.reset();
	}

	reset() {
		for (const el of this.valueEls) {
			if (!el.disabled) {
				el.disabled = true;
				el.removeEventListener('click', this.buttonCallback);
			}
			el.innerHTML = '';
		}
	}

	canScore(dice) {
		// You can score it if the condition matches
		if (this.condition(dice)) return true;
		// You can score Yahtzees in other places...
		// (this logic only applies to the lower section, but
		// condition(dice) is always true in the upper section)
		if (!isYahtzee(dice)) return false;
		// ...but only if you've filled in the right row in the upper section
		const [yahtzeeNumber] = dice,
			row = upperSectionNames[yahtzeeNumber],
			scoreboardRow = this.scoreboard.getRow(row);
		return scoreboardRow.playerHasScored(this.currentPlayer);
	}

	scoreDice(dice, callback) {
		// Can't score the same thing twice
		if (this.playerHasScored(this.currentPlayer)) return;
		const score = this.canScore(dice) * this.score(dice),
			button = this.valueEls[this.currentPlayer];
		button.innerHTML = score;
		button.disabled = false;
		if (score == 0) button.classList.add('zero');
		button.addEventListener('click',
			this.buttonCallback = (e => {
				callback(score);
				button.disabled = true;
				button.removeEventListener('click', this.buttonCallback);
			}));
	}

	cancelScoring() {
		const button = this.valueEls[this.currentPlayer];
		button.classList.remove('zero');
		if (!button.disabled) {
			button.innerHTML = '';
			button.disabled = true;
			button.removeEventListener('click', this.buttonCallback);
		}
	}

	get values() {
		return this.valueEls.map(el => 
			el.disabled ? parseInt(el.innerHTML, 10) || 0 : 0);
	}

	clearScore(player) {
		this.valueEls[player].innerHTML = '';
	}

	playerHasScored(n) {
		const button = this.valueEls[n];
		return button.disabled && !!button.innerHTML;
	}

	get complete() {
		for (let i = 0; i < this.playerCount; ++i)
			if (!this.playerHasScored(i))
				return false;
		return true;
	}
}

window.customElements.define('scoreboard-row', ScoreboardRow);
