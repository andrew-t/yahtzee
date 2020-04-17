import { shadowDom, importChildren, multiple } from '../../util/dom.js';

import RowBase from './row-base.js';
import style from './row-style.js';

export class TotalRow extends RowBase {
	constructor() {
		super();

		const description = this.getAttribute('description');

		shadowDom(this, `
			<style>
				${style}
				.name { font-weight: bold; }
				.value-cell {
					display: flex;
					flex-direction: column;
					justify-content: center;
				}
				.current-player { background: #dca; }
			</style>
			<span id="name"
				class="name"
				${description ? `title="${description}"` : ''}>
			</span>
			${multiple(`<span class="value-cell">
				<span class="value">0</span>
			</span>`, this.playerCount)}
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

	increase(i, n) {
		const v = this.values;
		v[i] += n;
		this.values = v;
	}
}

window.customElements.define('total-row', TotalRow);
