import { shadowDom, multiple } from '../dom.js';

export class DiceRoller extends HTMLElement {
	constructor() {
		super();
		const numberOfFaces = this.getAttribute('faces'),
			dieCount = this.getAttribute('count'),
			rollsPerTurn = this.getAttribute('rollsPerTurn');

		this.rollsPerTurn = parseInt(rollsPerTurn, 10) || 3;

		const elementsById = shadowDom(this, `
			<div>
				${multiple(
					`<holdable-die faces="${numberOfFaces}"></holdable-die>`,
					dieCount)}
			</div>
			<span id="rollsLeft">3</span> rounds left
			<done-button id="rerollButton">Re-roll</done-button>
		`);
		this.dice = [ ...this._shadowRoot.querySelectorAll('holdable-die') ];
		this.rollsLeft = elementsById.rollsLeft;
		this.rerollButton = elementsById.rerollButton;

		for (const die of this.dice)
			die.disabled = true;

		this.roll();
	}

	async roll() {
		await Promise.all(this.dice.map(die => die.roll()));
	}

	async runCompleteTurn() {
		this.classList.add('active');
		let rollsLeft = this.rollsPerTurn;
		for (const die of this.dice)
			die.held = false;

		while (true) {
			for (const die of this.dice)
				die.disabled = true;
			await this.roll();

			if (--rollsLeft == 0) break;
			this.rollsLeft.innerHTML = rollsLeft;

			for (const die of this.dice)
				die.disabled = false;
			await this.rerollButton.waitForPress();
		}

		this.classList.remove('active');
		return this.dice.map(die => die.value);
	}
}

window.customElements.define('dice-roller', DiceRoller);
