import { shadowDom, importChildren } from '../util/dom.js';

export class ButtonOptions extends HTMLElement {
	constructor() {
		super();
		this.buttons = [ ...this.querySelectorAll('button') ];
	}

	connectedCallback() {
		for (const button of this.buttons)
			button.disabled = true;
	}

	waitForPress() {
		return new Promise(resolve => {
			for (const button of this.buttons)
				button.disabled = false;
			const listener = event => {
				for (const button of this.buttons) {
					button.disabled = true;
					button.removeEventListener('click', listener);
				}
				resolve(event.target.id);
			};
			for (const button of this.buttons)
				button.addEventListener('click', listener);
		});
	}
}

window.customElements.define('button-options', ButtonOptions);
