export function shadowDom(host, template) {
	host.attachShadow(({ mode: 'open' }));
	host.shadowRoot.innerHTML = template;
	for (const element of [ ...host.shadowRoot.querySelectorAll('[id]') ])
		host[element.id] = element;
}

export function multiple(template, count) {
	let dom = '';
	for (let i = 0; i < count; ++i)
		dom += template;
	return dom;
}

export function map(array, toTemplate) {
	return [ ...array ].map(toTemplate).join('');
}

export function importChildren(host, node) {
	for (const child of host.childNodes)
		node.appendChild(child);
}
