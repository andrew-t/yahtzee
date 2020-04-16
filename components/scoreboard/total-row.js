import { shadowDom, importChildren, multiple } from '../../util/dom.js';

import style from './row-style.js';

export class TotalRow extends HTMLElement {
	constructor() {
		super();

		this.playerCount = parseInt(this.getAttribute('players'), 10) || 1;

		shadowDom(this, `
			<style>${style}</style>
			<span class="name" id="name"></span>
			${multiple(`<span class="value">0</span>`, this.playerCount)}
		`);
		importChildren(this, this.name);
		this.valueSpans = [ ...this.shadowRoot.querySelectorAll('.value') ];

		this.reset();
	}

	reset() {
		const totals = [];
		for (let i = 0; i < this.playerCount; ++i)
			totals.push(0);
		this.values = totals;
	}

	get values() {
		return this.valueSpans.map(span => parseInt(span.innerHTML, 10) || 0);
	}

	set values(totals) {
		for (let i = 0; i < this.playerCount; ++i)
			this.valueSpans[i].innerHTML = totals[i];
	}
}

window.customElements.define('total-row', TotalRow);
