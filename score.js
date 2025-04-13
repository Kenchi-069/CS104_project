class Batter {
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
    constructor(name, batters, bowlers, balls, runs, wickets, batting, played) {
        this.name = name;
        this.batters = batters;
        this.bowlers = bowlers;
        this.balls = balls;
        this.runs = runs;
        this.wickets = wickets;
    }
    addBatter(batter) {
        this.batters.push(batter);
    }
    addBowler(bowler) {
        this.bowlers.push(bowler);
    }
    addBall() {
        this.balls++;
    }
    addRun(run) {
        this.runs += run;
    }
    addWicket() {
        this.wickets++;
    }
    getScore() {
        return `${this.runs}/${this.wickets} in ${Math.floor(this.balls / 6)}.${this.balls % 6} overs`;
    }
}
let team1, team2;
let sBatter = 0, nBatter = 1, cBowler = 0;

document.addEventListener('DOMContentLoaded', () => {

    const matchForm = document.getElementById("matchForm");
    const storeRun = document.getElemenBytId("runForm");
    const batsman1 = document.getElementById("batsman1");
    const batsman2 = document.getElementById("batsman2");
    const bowler = document.getElementById("bowler");
    const strikerBtn = document.getElementById("setcBatter");
    const strikerInput = document.getElementById("striker");
    const nStrikerBtn = document.getElementById("setnBatter");
    const nonStrikerInput = document.getElementById("nonStriker");
    const bowlerBtn = document.getElementById("setBowler");
    const bowlerInput = document.getElementById("bowlerInput");



    matchForm.addEventListener('submit', (event) => {
        let toss = document.getElementById("toss").value;
        let tossResult = document.getElementById("tossResult").value
        team1 = new Team(document.getElementById("team1").value, [], [], 0, 0, 0, 0, 0);
        team2 = new Team(document.getElementById("team2").value, [], [], 0, 0, 0, 0, 0);

        if (toss === "team1") {
            if (tossResult === "bat") {
                team1.batting = 1;
                team2.batting = 0;
            }
            else {
                team1.batting = 0;
                team2.batting = 1;
            }
        }
        else {
            if (tossResult === "bat") {
                team1.batting = 0;
                team2.batting = 1;
            }
            else {
                team1.batting = 1;
                team2.batting = 0;
            }
        }

        window.location.href = "live.html";
    });

    let active = team1.batting ? team1 : team2;
    let inactive = team1.batting ? team2 : team1;


    storeRun.addEventListener('submit', (event) => {
        event.preventDefault();

        // Don't accept runs if we're waiting for a bowler input
        if (bowler.style.display === "block") return;
        if (batsman1.style.display === "block") return;
        if (batsman2.style.display === "block") return;


        const selectedRun = document.querySelector('input[name="run"]:checked');

        if (selectedRun) {
            active.run += parseInt(selectedRun.value);
            console.log(`Ball ${ball + 1}: ${selectedRun.value} run(s) | Total: ${run} | Bowler: ${bowler}`);
            active.addBall();
            if (run === -1) {
                active.batters[sBatter].addWicket();
                active.batters[sBatter].addBall();
                inactive.bowlers[cBowler].addWicket();
                console.log(`Wicket! ${active.batters[sBatter].name} is out.`);
                batsman1.style.display = "block";
                sBatter = active.batters.length - 1;
            }
            else {
                active.batters[sBatter].addRun(run);
                active.batters[sBatter].addBall();
                inactive.bowlers[cBowler].addRun(run);
                if (run%2 === 1) {
                    let temp = sBatter;
                    sBatter = nBatter;
                    nBatter = temp;
                }
            }
            if (ball % 6 === 0) {
                bowler.style.display = "block";
                cBowler++;
                let temp = sBatter;
                sBatter = nBatter;
                nBatter = temp;
            }

            selectedRun.checked = false;
        } else {
            console.log("No run selected.");
        }
    });

    strikerBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form from reloading the page

        const name = strikerInput.value.trim();
        if (name !== "") {
            striker = name;
            console.log("Striker batter set to: " + striker);
        } else {
            console.log("No name entered for striker.");
        }

        active.addBatter(new Batter(striker, 0, 0, 0, 0));
        batsman1.style.display = "none";
    });

    nStrikerBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form from reloading the page

        const name = nonStrikerInput.value.trim();
        if (name !== "") {
            nonStriker = name;
            console.log("Non-striker batter set to: " + nonStriker);
        } else {
            console.log("No name entered for non-striker.");
        }

        active.addBatter(new Batter(nonStriker, 0, 0, 0, 0));
        batsman2.style.display = "none";
    });

    bowlerBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form from reloading the page

        const name = bowlerInput.value.trim();
        if (name !== "") {
            bowler = name;
            console.log("Bowler set to: " + bowler);
        } else {
            console.log("No name entered for bowler.");
        }

        inactive.addBowler(new Bowler(bowler, 0, 0, 0));
        bowler.style.display = "none";
    });
});