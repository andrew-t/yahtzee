import buttonStyle from './dice/roller-style.js';
import { waitForClick, shadowDom, importChildren } from '../util/dom.js';

export class DoneButton extends HTMLElement {
	constructor() {
		super();
		shadowDom(this, `
			<style>${buttonStyle}</style>
			<button id="button" disabled></button>
		`);
		importChildren(this, this.button);
	}

	async waitForPress() {
		this.classList.add('active');
		await waitForClick(this.button);
		this.classList.remove('active');
	}
}

window.customElements.define('done-button', DoneButton);
