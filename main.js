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

const diceRoller = document.getElementById('roller'),
	scoreboard = document.getElementById('scores'),
	coasts = document.getElementById('toasts');

diceRoller.runCompleteTurn().then(roll => scoreboard.scoreDice(roll));

scoreboard.on('score', (scoredRow, dice) => {
	toasts.clear();
	toasts.toast(
		`Scored as ${scoredRow.name.toLowerCase()}`,
		{
			html: 'Undo',
			callback: () => {
				scoreboard.unscore(scoredRow);
				scoreboard.scoreDice(dice);
			}
		});

	if (!scoreboard.gameOver)
		diceRoller.runCompleteTurn().then(roll => scoreboard.scoreDice(roll));
});
