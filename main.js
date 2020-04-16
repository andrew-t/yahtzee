import './components/dice/dice-roller.js';
import './components/scoreboard/yahtzee-scoreboard.js';

const dice = document.getElementById('roller'),
	scoreboard = document.getElementById('scores');

async function play() {
	while (!scoreboard.gameOver) {
		const roll = await dice.runCompleteTurn();
		await scoreboard.scoreDice(roll);
	}
}

play();
