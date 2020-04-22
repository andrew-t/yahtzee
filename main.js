import './components/dice/dice-roller.js';
import './components/scoreboard/yahtzee-scoreboard.js';
import './components/toast.js';

if ('serviceWorker' in navigator)
  navigator.serviceWorker.register('service-worker.js');

const numberOfPlayers = prompt('How many players?');

document.getElementById('game').innerHTML += `
	<yahtzee-scoreboard
		id="scores"
		players="${numberOfPlayers}">
	</yahtzee-scoreboard>
	<dice-roller
		id="roller"
		count="5"
		downscaling="1">
	</dice-roller>
`;

const dice = document.getElementById('roller'),
	scoreboard = document.getElementById('scores');

play();

async function play() {
	while (!scoreboard.gameOver) {
		const roll = await dice.runCompleteTurn();
		await scoreboard.scoreDice(roll);
	}
}
