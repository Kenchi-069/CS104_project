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

const searchResultT1 = document.getElementById("searchResultT1");
const dropDownT1 = document.getElementById("myPlayersT1");
const searchResultT2 = document.getElementById("searchResultT2");
const dropDownT2 = document.getElementById("myPlayersT2");

team1P.forEach(player => {
    const option = document.createElement("option");
    option.value = player.name;
    option.textContent = player.name;
    dropDownT1.appendChild(option);
});

team2P.forEach(player => {
    const option = document.createElement("option");
    option.value = player.name;
    option.textContent = player.name;
    dropDownT2.appendChild(option);
});

function fetchCommentaryT1() {
    const selectedName = dropDownT1.value;
    searchResultT1.innerHTML = '';
    let playerObj = team1P.find(p => p.name === selectedName);
    if (!playerObj) {
        console.warn("No player found with that name.");
        return;
    }
    playerObj.commentary.forEach (comment =>{
        const entry = document.createElement('div');
        entry.className = 'commentary-entry';
        entry.textContent = comment;
        searchResultT1.appendChild(entry);
        searchResultT1.scrollTop = searchResultT1.scrollHeight;
    })
}
function fetchCommentaryT2() {
    const selectedName = dropDownT2.value;
    let playerObj = team2P.find(p => p.name === selectedName);
    searchResultT2.innerHTML = '';
    playerObj.commentary.forEach (comment =>{
        const entry = document.createElement('div');
        entry.className = 'commentary-entry';
        entry.textContent = comment;
        searchResultT2.appendChild(entry);
        searchResultT2.scrollTop = searchResultT1.scrollHeight;
    })
}

window.fetchCommentaryT1 = fetchCommentaryT1;
window.fetchCommentaryT2 = fetchCommentaryT2;