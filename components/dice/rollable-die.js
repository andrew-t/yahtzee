import { shadowDom } from '../../util/dom.js';

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

export class RollableDie extends HTMLElement {
	constructor() {
		super();
		// one fine day we will change this...
		this.numberOfFaces = parseInt(this.getAttribute('faces'), 10) || 6;
		shadowDom(this, `
			<style>${style}</style>
			<span id="output"></span>
		`);
	}

	connectedCallback() {
		this.roll();
	}

	async roll() {
		this.value = Math.floor(Math.random() * this.numberOfFaces) + 1;
		this.render();
	}

	render() {
		this.output.innerHTML = this.value.toString();
	}
}

window.customElements.define('rollable-die', RollableDie);
