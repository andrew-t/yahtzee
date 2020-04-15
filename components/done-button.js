import { shadowDom } from '../dom.js';

const style = `
	:host {
		display: inline-block;
		width: 2em;
		line-height: 2em;
		text-align: center;
		line-height: 2em;
		border: 1px solid black;
		background: white;
		margin: 0.5em;
	}
`;

export class DoneButton extends HTMLElement {
	constructor() {
		super();
		const elementsById = shadowDom(this, `
			<button id="button" disabled></button>
		`);
		this.button = elementsById.button;
		for (const child of this.childNodes)
			this.button.appendChild(child);
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
