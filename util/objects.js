export function map(input, transform) {
	const output = {};
	for (const [ key, value ] of Object.entries(input))
		output[key] = transform(value);
	return output;
}
