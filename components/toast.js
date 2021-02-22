import { shadowDom, importChildren, map } from '../util/dom.js';

const rackStyle = `
	:host {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
	}
`;

const sliceStyle = `
	:host {
		margin: 0.5em;
		background: #444;
		color: white;
		font-family: sans-serif;
		border-radius: 1em;
		padding: 1em;
		box-shadow: 0 0.25em 0.5em black;
		display: flex;
		justify-content: stretch;
	}

	#message {
		flex: auto 1 0;
	}

	button {
		flex: auto 0 0;
		text-transform: uppercase;
		font-weight: bold;
		font-family: inherit;
		font-size: inherit;
		color: #4fc;
		padding: 0;
		margin: 0 0 0 1em;
		background: none;
		border: none;
		cursor: pointer;
	}

	@media (prefers-color-scheme: dark) {
		:host { background: #bbb; color: black; }
		button { color: #041; }
	}
`;

function createButton(text, callback) {
	const button = document.createElement('button');
	button.innerHTML = text;
	button.addEventListener('click', callback);
	return button;
}

class ToastSlice extends HTMLElement {
	constructor() {
		super();
		shadowDom(this, `
			<style>${sliceStyle}</style>
			<span id="message"></span>
		`);
		importChildren(this.message);
	}

	set html(html) {
		this.message.innerHTML = html;
	}

	addButton({ html, callback, thenHide }) {
		const button = document.createElement('button');
		button.innerHTML = html;
		button.addEventListener('click', e => {
			if (this.hidden) return;
			callback(e);
			if (thenHide !== false) this.hide();
		});
		this.shadowRoot.appendChild(button);
	}

	hide() {
		if (this.hidden) return;
		this.hidden = true;
		this.parentElement.removeChild(this);
	}
}

window.customElements.define('toast-slice', ToastSlice);

function createToast(html, ...buttons) {
	const toast = document.createElement('toast-slice');
	toast.html = html;
	for (const button of buttons) toast.addButton(button);
	setTimeout(() => toast.hide(), 5000);
	return toast;
}

export class ToastRack extends HTMLElement {
	constructor() {
		super();
		shadowDom(this, `
			<style>${rackStyle}</style>
			<div id="toasts"></div>
		`);
	}

	toast(message, ...buttons) {
		const toast = createToast(message, ...buttons);
		this.toasts.appendChild(toast);
		return toast;
	}

	clear() {
		for (const toast of [ ...this.shadowRoot.querySelectorAll('toast-slice') ])
			toast.hide();
	}
}

window.customElements.define('toast-rack', ToastRack);
