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


function startMatch() {
    let team1 = new Team(document.getElementById("team1").value, [], [], 0, 0, 0, 0, 0);
    let team2 = new Team(document.getElementById("team2").value, [], [], 0, 0, 0, 0, 0); ;
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
}

function runMatch() {
    let toss = JSON.parse(localStorage.getItem("toss"));
    let tossResult = JSON.parse(localStorage.getItem("tossResult"));
    let rawTeam1 = JSON.parse(localStorage.getItem("team1"));
    let currentBatsmanIndex = 0;
    let currentBowlerIndex = 0;
    let totalBalls = 0;
    let team1 = new Team(
        rawTeam1.name,
        [], [],
        rawTeam1.runs,
        rawTeam1.balls,
        rawTeam1.wickets,
        rawTeam1.active,
        rawTeam1.played
    );
    let rawTeam2 = JSON.parse(localStorage.getItem("team2"));  
    let team2 = new Team(
        rawTeam2.name,
        [], [], 
        rawTeam2.runs,
        rawTeam2.balls,
        rawTeam2.wickets,
        rawTeam2.active,
        rawTeam2.played
    );    
    let balls = 12;
    let overs = 2;
    
    let striker = document.getElementById("striker").value;
    let nstriker = document.getElementById("ntriker").value;
    let bowler = document.getElementById("bowler").value;
    let active = (team1.active) ? team1 : team2;
    let inactive = (team1.active) ? team2 : team1;

    active.addBatsman(striker, 0, 0, 0, 0);
    active.addBatsman(nstriker, 0, 0, 0, 0);
    inactive.addBowler(bowler, 0, 0, 0);


    document.getElementById("matchInfo").textContent = `${team1.name} vs ${team2.name}`;
    document.getElementById("tossInfo").textContent = `${toss} won the toss and chose to ${tossResult}`;

    function storeRun() {
        let run = parseInt(document.getElementById("run").value);
        console.log(run);
    }
    
}


