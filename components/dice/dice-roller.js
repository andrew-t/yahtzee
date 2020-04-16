import { shadowDom, multiple } from '../../util/dom.js';

// You don't need to import these here,
// but it seems like a good way of managing dependencies.
import './rollable-die.js';
import './holdable-die.js';
import '../done-button.js';

export class DiceRoller extends HTMLElement {
	constructor() {
		super();
		const numberOfFaces = this.getAttribute('faces') || 6,
			dieCount = this.getAttribute('count'),
			rollsPerTurn = this.getAttribute('rollsPerTurn'),
			downscaling = parseFloat(this.getAttribute('downscaling')) || 1;

		this.rollsPerTurn = parseInt(rollsPerTurn, 10) || 3;

		shadowDom(this, `
			<style>
				:host {
					text-align: center;
				}
			</style>
			<div>
				${multiple(
					`<holdable-die faces="${numberOfFaces}"
						downscaling="${downscaling}">
					</holdable-die>`,
					dieCount)}
			</div>
			<span id="rollsLeft"></span>
			<done-button id="rerollButton">Next</done-button>
		`);
		this.dice = [ ...this.shadowRoot.querySelectorAll('holdable-die') ];

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

		nextRoll:
		while (true) {
			for (const die of this.dice)
				die.disabled = true;
			await this.roll();

			if (--rollsLeft == 0) break;
			this.rollsLeft.innerHTML = rollsLeft == 1
				? '1 roll left'
				: `${rollsLeft} rolls left`;

			for (const die of this.dice)
				die.disabled = false;
			await this.rerollButton.waitForPress();
			for (const die of this.dice)
				if (!die.held)
					continue nextRoll;

			this.rollsLeft.innerHTML = '';
			break;
		}

		this.classList.remove('active');
		return this.dice.map(die => die.value);
	}
}

window.customElements.define('dice-roller', DiceRoller);
