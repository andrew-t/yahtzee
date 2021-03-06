import { shadowDom, importChildren, multiple } from '../../util/dom.js';

import RowBase from './row-base.js';
import style from './row-style.js';

export class NamesRow extends RowBase {
	constructor() {
		super();

		shadowDom(this, `
			<style>
				${style}
				.name { font-weight: bold; }
			</style>
			<span class="name" id="name"></span>
			${multiple(
				`<span
					class="value-cell value"
					taborder="0"
					contenteditable>
				</span>`,
				this.playerCount)}
		`);
		importChildren(this, this.name);
		this.inputs = [ ...this.shadowRoot.querySelectorAll('.value') ];

		this.reset();
	}

	reset() {
		const names = [];
		for (let i = 0; i < this.playerCount; ++i)
			names.push('');
		this.values = names;
	}
}

window.customElements.define('names-row', NamesRow);
