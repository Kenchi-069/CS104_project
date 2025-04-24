class Match {
    constructor(id, team1, team2, winner, team1Score, team2Score, timestamp = new Date()) {
        this.id = id;
        this.team1 = team1;
        this.team2 = team2;
        this.winner = winner;
        this.team1Score = team1Score;
        this.team2Score = team2Score;
        this.timestamp = timestamp;
    }

    static generateID() {
        return `match-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
}
const matches = [];

document.getElementById("saveMatch").addEventListener('click', (event) => {
    event.preventDefault();

    const team1 = JSON.parse(localStorage.getItem("team1"));
    const team2 = JSON.parse(localStorage.getItem("team2"));

    const winner = won(team1, team2);
    const matchData = new Match(
        Match.generateID(),
        team1.name,
        team2.name,
        winner === 0 ? "Draw" : winner.name,
        `${team1.runs}/${team1.wickets}`,
        `${team2.runs}/${team2.wickets}`
    );

    let storedMatches = JSON.parse(localStorage.getItem("matches")) || [];
    storedMatches.push(matchData);
    localStorage.setItem("matches", JSON.stringify(storedMatches));

    console.log("[DEBUG] Match saved:", matchData);
});


document.getElementById("newMatch").addEventListener('click',(event)=> {
    event.preventDefault();
    clearLocalStorage(["matches"]);
    window.location.href="setup.html";
});

function won(team1,team2) {
    if(team1.runs > team2.runs) return team1;
    else if(team2.runs > team1.runs) return team2;
    else return 0;
}
function clearLocalStorage(excludeKeys = []) {
    const keysToKeep = new Set(excludeKeys);
    const keys = Object.keys(localStorage);

    for (const key of keys) {
        if (!keysToKeep.has(key)) {
            localStorage.removeItem(key);
        }
    }
}
const team1 = JSON.parse(localStorage.getItem("team1"));
const team2 = JSON.parse(localStorage.getItem("team2"));
const team1P = team1.batters.concat(team1.bowlers);
const team2P = team2.batters.concat(team2.bowlers);
const players = team1P.concat(team2P)

const searchResult = document.getElementById("searchResult");
const dropDown = document.getElementById("myPlayers");

players.forEach(player => {
    const option = document.createElement("option");
    option.value = player;
    option.textContent = player;
    dropDown.appendChild(option);
});

function fetchCommentary() {
    const selectedName = dropDown.value;
    let team;
    let playerObj = team1P.find(p => p.name === selectedName);
    if (playerObj) {
        team = team1;
    } else {
        playerObj = team2P.find(p => p.name === selectedName);
        team = team2;
    }

    playerObj.commentary.forEach (comment =>{
        searchResult.textContent(comment);
    })
}