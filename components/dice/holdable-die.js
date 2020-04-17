import { shadowDom } from '../../util/dom.js';

const style = `
	button {
		border: 2px solid green;
		padding: 0;
	}
	button.held {
		border: 2px solid red;
	}
	button:disabled {
		border: 2px solid black;
		color: black;
	}
	button:focus {
		outline: none;
		box-shadow: 0 0 0 4px #fd8;
	}
`;

export class HoldableDie extends HTMLElement {
	constructor() {
		super();
		const numberOfFaces = this.getAttribute('faces') || 6;
		const downscaling = parseFloat(this.getAttribute('downscaling')) || 1;

		shadowDom(this, `
			<style>${style}</style>
			<button id="button">
				<rollable-die
					id="innerDie"
					downscaling="${downscaling}"
					faces="${numberOfFaces}">
				</rollable-die>
			</button>
		`);

		this.button.addEventListener('click', () => this.held = !this.held);
	}

	set held(value) {
		if (value) this.button.classList.add('held');
		else this.button.classList.remove('held');
	}
	get held() { return this.button.classList.contains('held'); }

	set disabled(value) { this.button.disabled = value; }
	get disabled() { return this.button.disabled; }

	get value() { return this.innerDie.value; }

	async roll() {
		if (!this.held) await this.innerDie.roll();
		return !this.held;
	}
}

window.customElements.define('holdable-die', HoldableDie);
