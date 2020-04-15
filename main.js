import './components/rollable-die.js';
import './components/holdable-die.js';
import './components/done-button.js';
import './components/dice-roller.js';

class MyElement extends HTMLElement {
	constructor() {
		super(); 
		console.log('constructed!');

		this._shadowRoot = this.attachShadow({ mode: 'open' });
		// this._shadowRoot.innerHTML = 'test';
	}

	connectedCallback() {
		console.log('connected!');
		console.log(this.innerHTML);
		console.log(this._shadowRoot.innerHTML);
	}

	disconnectedCallback() {
		console.log('disconnected!');
	}

	static get observedAttributes() {
		return ['my-attr'];
	}

	attributeChangedCallback(name, oldVal, newVal) {
		console.log(`Attribute: ${name} changed!`);
	}

	adoptedCallback() {
		console.log('adopted!');
	}
}

window.customElements.define('my-element', MyElement);
