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
function clearRunSelection() {
    document.querySelectorAll('input[name="runs"]').forEach(r => r.checked = false);
}
function startMatch() {
    team1 = new Team(document.getElementById("team1").value, [], [], 0, 0, 0, 0, 0);
    team2 = new Team(document.getElementById("team2").value, [], [], 0, 0, 0, 0, 0); ;
    let toss = document.getElementById("toss").value;
    let tossResult = document.getElementById("toss_d").value;
    if (team1.name == "") {
        alert("Please enter team 1 name");
        return;
    }
    if (team2.name == "") {
        alert("Please enter team 2 name");
        return;
    }
    if (toss == "") {
        alert("Please enter toss name");
        return;
    }
    if (tossResult == "") {
        alert("Please enter toss result name");
        return;
    }
    if (tossResult == "bat") {
        team1.active = Boolean(toss == "team1");
        team2.active = Boolean(toss == "team2");
    }
    else if (tossResult == "bowl") {
        team1.active = Boolean(toss == "team2");
        team2.active = Boolean(toss == "team1");
    } 

    localStorage.setItem("team1", JSON.stringify(team1));
    localStorage.setItem("team2", JSON.stringify(team2));
    localStorage.setItem("toss", JSON.stringify(toss));
    localStorage.setItem("tossResult", JSON.stringify(tossResult));

    

    window.location.href = "./live.html";
};

let strikerIndex = 0;
let nstrikerIndex = 1;
let currentBowlerIndex = 0;
let totalBalls = 0
let balls = 12;
let overs = 2;
    
function storeRun() {
    let active = (team1.active) ? team1 : team2;
    let inactive = (team1.active) ? team2 : team1;
    let selectedRun = document.querySelector('input[name="runs"]:checked');
    if (!selectedRun) {
        alert("Please select a run value");
        return;
    }
    let runValue = selectedRun.value;
    if(runValue == "W") {
        handleWicket(team1, team2)
    }
    else {
        active.runs += parseInt(runValue);
        active.batsmans[strikerIndex].runs += parseInt(runValue);
        active.batsmans[strikerIndex].balls++;
        inactive.bowlers[currentBowlerIndex].runs += parseInt(runValue);
        if(parseInt(runValue)%2) {
            let temp = strikerIndex;
            strikerIndex = nstrikerIndex;
            nstrikerIndex = temp;
        }
        totalBalls++;
        active.balls++;
    }
    clearRunSelection();
}

function handleWicket() {
    let active = (team1.active) ? team1 : team2;
    let inactive = (team1.active) ? team2 : team1;
    active.wickets++;
    active.batsmans[strikerIndex].balls++;
    inactive.bowlers[currentBowlerIndex].wickets++;
    strikerIndex++;
    if(strikerIndex == 10) {
        alert("All out");
        return;
    }
    else {
        alert("New batsman comes in");

    }
    alert("Wicket taken");
}

function submitNewBatter(team1, team2) {
    let active = (team1.active) ? team1 : team2;
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
    
}