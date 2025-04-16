import { Match } from './classes.js';

document.addEventListener('DOMContentLoaded', async () => {
    const team1 = JSON.parse(localStorage.getItem("team1"));
    const team2 = JSON.parse(localStorage.getItem("team2"));
    const winnerObj = won(team1, team2); // use your score.js logic
    const winner = winnerObj === 0 ? "Draw" : winnerObj.name;

    const match = new Match(
        Match.generateID(),
        team1.name,
        team2.name,
        winner,
        `${team1.runs}/${team1.wickets}`,
        `${team2.runs}/${team2.wickets}`
    );

    await match.saveToBackend();
});