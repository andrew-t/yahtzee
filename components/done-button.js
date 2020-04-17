import buttonStyle from './dice/roller-style.js';
import { shadowDom, importChildren } from '../util/dom.js';

export class DoneButton extends HTMLElement {
	constructor() {
		super();
		shadowDom(this, `
			<style>${buttonStyle}</style>
			<button id="button" disabled></button>
		`);
		importChildren(this, this.button);
	}

	waitForPress() {
		return new Promise(resolve => {
			this.button.disabled = false;
			this.classList.add('active');
			const listener = () => {
				this.button.disabled = true;
				this.classList.remove('active');
				this.button.removeEventListener('click', listener);
				resolve();
			};
			this.button.addEventListener('click', listener);
		});
	}
}

window.customElements.define('done-button', DoneButton);
