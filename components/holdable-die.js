import { shadowDom } from '../dom.js';

export class HoldableDie extends HTMLElement {
	constructor() {
		super();
		const numberOfFaces = parseInt(this.getAttribute('faces'), 10) || 6;

		const elementsById = shadowDom(this, `
			<button id="button">
				<rollable-die
					id="innerDie"
					faces="${numberOfFaces}">
				</rollable-die>
			</button>
		`);
		this.button = elementsById.button;
		this.innerDie = elementsById.innerDie;

		this.button.addEventListener('click', e => {
			this.held = !this.held;
		});

		this._held = false;
		this._disabled = false;
	}

	set held(value) {
		this._held = value;
		this.render();
	}
	get held() { return this._held; }

	set disabled(value) { this.button.disabled = value; }
	get disabled() { return this.button.disabled; }

	get value() { return this.innerDie.value; }

	async roll() {
		if (!this.held) await this.innerDie.roll();
		return !this.held;
	}

	render() {
		if (this.held) this.classList.add('held');
		else this.classList.remove('held');
	}
}

window.customElements.define('holdable-die', HoldableDie);
