export function shadowDom(host, template) {
	host._shadowRoot = host.attachShadow(({ mode: 'open' }));
	host._shadowRoot.innerHTML = template;
	const elementsById = {};
	for (const element of [ ...host._shadowRoot.querySelectorAll('[id]') ])
		elementsById[element.id] = element;
	return elementsById;
}

export function multiple(template, count) {
	let dom = '';
	for (let i = 0; i < count; ++i)
		dom += template;
	return dom;
}
