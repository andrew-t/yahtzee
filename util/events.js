const callbacks = new WeakMap();

export default function eventorise(x) {
	Object.assign(x, { on, off, emit });
}

function getCallbackLists(emitter) {
	if (!callbacks.has(emitter)) callbacks.set(emitter, []);
	return callbacks.get(emitter);
}

function getCallbacks(emitter, event) {
	const callbackLists = getCallbackLists(emitter);
	if (!callbackLists[event]) callbackLists[event] = [];
	return callbackLists[event];
}

function on(event, callback) {
	getCallbacks(this, event).push(callback);
}

function off(event, callback) {
	const callbacks = getCallbacks(this, event);
	callbacks.splice(callbacks.indexOf(callback), 1);
}

function emit(event, ...args) {
	for (const callback of getCallbacks(this, event))
		callback(...args);
}
