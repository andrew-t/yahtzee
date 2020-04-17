import { shadowDom } from '../../util/dom.js';
import shader from './shader.js';

const style = `
	:host {
		display: inline-block;
		width: 1em;
		height: 1em;
		box-sizing: border-box;
		font-size: 15vmin;
		text-align: center;
		vertical-align: middle;
	}

	#shader {
		width: 1em;
		height: 1em;
	}
`;

export class RollableDie extends HTMLElement {
	constructor() {
		super();
		// one fine day we will change this...
		this.numberOfFaces = parseInt(this.getAttribute('faces'), 10) || 6;
		this.downscaling = parseFloat(this.getAttribute('downscaling')) || 1;

		shadowDom(this, `
			<style>${style}</style>
			<canvas id="shader"></canvas>
		`);

		this.glslCanvas = new GlslCanvas(this.shader);
		this.glslCanvas.pause();
		this.glslCanvas.on('error', console.error);
		this.glslCanvas.on('load', () => this.render());
		this.shader.width = this.shader.clientWidth * devicePixelRatio / this.downscaling;
		this.shader.height = this.shader.clientHeight * devicePixelRatio / this.downscaling;
		setTimeout(() => {
			console.log('Compiling shader...');
			this.glslCanvas.load(shader);
		});
	}

	connectedCallback() {
		this.roll();
	}

	render() {
		this.glslCanvas.setUniform('VALUE', this.value);
		this.glslCanvas.setUniform('u_tumbliness_a', randTumble());
		this.glslCanvas.setUniform('u_tumbliness_b', randTumble());
		this.shader.title = this.value;
	}

	roll() {
		this.value = Math.floor(Math.random() * this.numberOfFaces) + 1;
		this.render();
		// reset the tumble
		this.glslCanvas.timeLoad = performance.now();
		this.glslCanvas.play();
		return new Promise(resolve => setTimeout(resolve, 1000));
	}
}

window.customElements.define('rollable-die', RollableDie);

function randTumble() {
	const x = Math.random() - 0.5;
	return x + Math.sign(x) * 0.5;
}
