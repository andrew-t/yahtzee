import { shadowDom, importChildren } from '../util/dom.js';

export class DoneButton extends HTMLElement {
	constructor() {
		super();
		shadowDom(this, `
			<button id="button" disabled></button>
		`);
		importChildren(this, this.button);
	}

	waitForPress() {
		return new Promise(resolve => {
			this.button.disabled = false;
			const listener = () => {
				this.button.disabled = true;
				this.button.removeEventListener('click', listener);
				resolve();
			};
			this.button.addEventListener('click', listener);
		});
	}
}

window.customElements.define('done-button', DoneButton);
