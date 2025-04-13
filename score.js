class Batsman {
    constructor(name, runs, balls, fours, sixes) {
        this.name = name;
        this.runs = runs;
        this.balls = balls;
        this.fours = fours;
        this.sixes = sixes;
    }
}

class Bowler {
    constructor(name, overs, runs, wickets) {
        this.name = name;
        this.overs = overs;
        this.runs = runs;
        this.wickets = wickets;
    }
}

class Team {
    constructor(name, batsmans, bowlers, runs, balls, wickets, active, played) {
        this.name = name;
        this.batsmans = batsmans;
        this.bowlers = bowlers;
        this.runs = runs;
        this.balls = balls;
        this.wickets = wickets;
        this.active = active;
        this.played = played;
    }

    addBatsman(name, runs, balls, fours, sixes) {
        this.batsmans.push(new Batsman(name, runs, balls, fours, sixes));
    }
    addBowler(name, overs, runs, wickets) {
        this.bowlers.push(new Bowler(name, overs, runs, wickets));
    }
    crr() {
        if (this.balls == 0) return 0;
        return (this.runs / this.balls) * 6;
    }
}

let team1, team2;
let strikerIndex = 0;
let nstrikerIndex = 1;
let currentBowlerIndex = 0;
let totalBalls = 0;
let balls = 12;
let overs = 2;

function clearRunSelection() {
    document.querySelectorAll('input[name="runs"]').forEach(r => r.checked = false);
}

function startMatch() {
    team1 = new Team(document.getElementById("team1").value, [], [], 0, 0, 0, 0, 0);
    team2 = new Team(document.getElementById("team2").value, [], [], 0, 0, 0, 0, 0);
    let toss = document.getElementById("toss").value;
    let tossResult = document.getElementById("toss_d").value;
    if (team1.name == "" || team2.name == "" || toss == "" || tossResult == "") {
        alert("Please fill all fields");
        return;
    }
    if (tossResult == "bat") {
        team1.active = toss == "team1";
        team2.active = toss == "team2";
    } else {
        team1.active = toss == "team2";
        team2.active = toss == "team1";
    }

    localStorage.setItem("team1", JSON.stringify(team1));
    localStorage.setItem("team2", JSON.stringify(team2));
    localStorage.setItem("toss", toss);
    localStorage.setItem("tossResult", tossResult);

    try {
        if (!window.location.href.includes("live.html")) {
            window.location.href = "./live.html";
        }
    } catch (error) {
        console.error("Error navigating to live.html:", error);
    }
}

function storeRun(event) {
    event.preventDefault();
    let active = team1.active ? team1 : team2;
    let inactive = team1.active ? team2 : team1;
    let selectedRun = document.querySelector('input[name="runs"]:checked');

    if (!selectedRun) {
        alert("Please select a run value");
        return;
    }

    let runValue = selectedRun.value;

    if (runValue === "W") {
        handleWicket();
    } else {
        let run = parseInt(runValue);
        active.runs += run;
        active.batsmans[strikerIndex].runs += run;
        active.batsmans[strikerIndex].balls++;
        inactive.bowlers[currentBowlerIndex].runs += run;

        if (run % 2) {
            let temp = strikerIndex;
            strikerIndex = nstrikerIndex;
            nstrikerIndex = temp;
        }

        totalBalls++;
        active.balls++;
    }

    updateScoreboard();
    clearRunSelection();

    if (totalBalls >= balls || active.wickets === 2) {
        if (active.played === 0) {
            alert("First innings over");
            changeInnings();
        } else {
            alert("Match over");
            declareWinner();
        }
    }
}

function handleWicket() {
    let active = team1.active ? team1 : team2;
    let inactive = team1.active ? team2 : team1;
    active.wickets++;
    active.batsmans[strikerIndex].balls++;
    inactive.bowlers[currentBowlerIndex].wickets++;
    strikerIndex++;

    if (strikerIndex == 10) {
        alert("All out");
        return;
    }

    alert("Wicket taken. New batsman comes in.");
}

function submitNewBatter(team1, team2) {
    let active = team1.active ? team1 : team2;
    document.getElementById("newBatterPrompt").style.display = "block";
    let newBatsmanName = document.getElementById("newBatsman").value;
    active.addBatsman(newBatsmanName, 0, 0, 0, 0);
    strikerIndex = active.batsmans.length - 1;
    document.getElementById("newBatterPrompt").style.display = "none";
    updateScoreboard();
}

function startInnings() {
    let striker = document.getElementById("striker").value;
    let nstriker = document.getElementById("ntriker").value;
    let bowler = document.getElementById("bowler").value;

    let active = team1.active ? team1 : team2;
    let inactive = team1.active ? team2 : team1;

    active.addBatsman(striker, 0, 0, 0, 0);
    active.addBatsman(nstriker, 0, 0, 0, 0);
    inactive.addBowler(bowler, 0, 0, 0);

    document.getElementById("batsman1").style.display = "none";
    document.getElementById("batsman2").style.display = "none";
    document.getElementById("bowler").style.display = "none";

    runMatch();
}

function runMatch() {
    let active = team1.active ? team1 : team2;
    let inactive = team1.active ? team2 : team1;

    while (totalBalls < balls) {
        if (active.balls == balls) {
            alert("Innings over");
            break;
        }
        if (totalBalls % 6 == 0) {
            currentBowlerIndex++;
            if (currentBowlerIndex == inactive.bowlers.length) {
                alert("All bowlers bowled");
                break;
            }
        }
        if (totalBalls % 2 == 0) {
            let temp = strikerIndex;
            strikerIndex = nstrikerIndex;
            nstrikerIndex = temp;
        }
        updateScoreboard();
    }
}

function changeInnings() {
    let active = team1.active ? team1 : team2;
    let inactive = team1.active ? team2 : team1;

    active.active = false;
    inactive.active = true;
    active.played = 1;

    strikerIndex = 0;
    nstrikerIndex = 1;
    currentBowlerIndex = 0;
    totalBalls = 0;
    balls = overs * 6;

    updateScoreboard();

    document.getElementById("batsman1").style.display = "block";
    document.getElementById("batsman2").style.display = "block";
    document.getElementById("bowler").style.display = "block";

    alert("Second innings setup: Enter new batters and bowler, then click Start Match");
}

function updateScoreboard() {
    let active = team1.active ? team1 : team2;
    let inactive = team1.active ? team2 : team1;
    let scoreboard = document.getElementById("scoreboard");
    scoreboard.innerHTML += `
        <h2>${active.name} vs ${inactive.name}</h2>
        <h3>${active.runs}/${active.wickets} in ${active.balls} balls</h3>
        <h4>Current Run Rate: ${active.crr().toFixed(2)}</h4>
        <h4>Overs: ${Math.floor(active.balls / 6)}.${active.balls % 6}</h4>
        <h4>Striker: ${active.batsmans[strikerIndex].name} (${active.batsmans[strikerIndex].runs})</h4>
        <h4>Non-Striker: ${active.batsmans[nstrikerIndex].name} (${active.batsmans[nstrikerIndex].runs})</h4>
        <h4>Bowler: ${inactive.bowlers[currentBowlerIndex].name}</h4>
        <h4>Total Balls: ${totalBalls}</h4>
    `;
}

function declareWinner() {
    let result = "";

    if (team1.runs > team2.runs) {
        result = `${team1.name} wins by ${team1.runs - team2.runs} runs`;
    } else if (team2.runs > team1.runs) {
        let remainingWickets = 2 - team2.wickets;
        result = `${team2.name} wins by ${remainingWickets} wicket${remainingWickets !== 1 ? "s" : ""}`;
    } else {
        result = "Match tied!";
    }

    alert(result);
}

