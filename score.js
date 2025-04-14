class Batter {
    constructor(name, runs, balls, fours, sixes) {
        this.name = name;
        this.runs = runs;
        this.balls = balls;
        this.fours = fours;
        this.sixes = sixes;
    }
    addRun(run){
        this.runs+=run;
        if(run === 4) this.fours+=1;
        else if(run === 6) this.sixes+=1;
    }
    addBall(){
        this.balls+=1;
    }
}

class Bowler {
    constructor(name, overs, runs, wickets) {
        this.name = name;
        this.overs = overs;
        this.runs = runs;
        this.wickets = wickets;
    }
    addRun(run){
        this.runs+=run;
    }
    addWicket(){
        this.wickets+=1;
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
        this.batting = batting;
        this.played = played;
    }
    addBatter(batter) {
        this.batters.push(batter);
        console.log(batter);
    }
    addBowler(bowler) {
        this.bowlers.push(bowler);
        console.log(bowler);
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
    crr(){
        return (this.runs/this.balls)*6;
    }
    rrr(run){
        let ans = (run-this.runs)/(overs-(this.balls/6));
        if (ans > 0) return ans;
        else return 0;
    }
}
let team1, team2;
let sBatter = 0, nBatter = 1, cBowler = 0;
let active, inactive;
let overs = 2;
document.addEventListener('DOMContentLoaded', () => {

    const startMatch = document.getElementById("startMatch");


    if(startMatch) {startMatch.addEventListener('click', (event) => {
        event.preventDefault(); 
        const toss = document.getElementById("toss").value;
        const tossResult = document.getElementById("tossResult").value
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
            if (tossResult === "bowl") {
                team1.batting = 0;
                team2.batting = 1;
            }
            else {
                team1.batting = 1;
                team2.batting = 0;
            }
        }
        console.log(`Match started: ${team1.name} vs ${team2.name}`);
        console.log(`Toss won by: ${toss} and chose to ${tossResult}`);

        localStorage.setItem("team1", JSON.stringify(team1));
        localStorage.setItem("team2", JSON.stringify(team2));
        localStorage.setItem("toss", toss);
        localStorage.setItem("tossResult", tossResult);
        window.location.href = "live.html";
    });}
    team1 = JSON.parse(localStorage.getItem("team1"));
    team2 = JSON.parse(localStorage.getItem("team2"));
    active = team1.batting === 1 ? new Team(
        team1.name, team1.batters, team1.bowlers, team1.balls, team1.runs, team1.wickets, team1.batting, team1.played) : new Team(
        team2.name, team2.batters, team2.bowlers, team2.balls, team2.runs, team2.wickets, team2.batting, team2.played
    );
    inactive = team1.batting === 1 ? new Team(
        team2.name, team2.batters, team2.bowlers, team2.balls, team2.runs, team2.wickets, team2.batting, team2.played) : new Team(
        team1.name, team1.batters, team1.bowlers, team1.balls, team1.runs, team1.wickets, team1.batting, team1.played
    );
    console.log("Loaded team1:", team1);
    console.log("Loaded team2:", team2);
    const storeRun = document.getElementById("playBall");
    const batsman1 = document.getElementById("batsman1");
    const batsman2 = document.getElementById("batsman2");
    const bowler = document.getElementById("bowler");
    const strikerBtn = document.getElementById("setcBatter");
    const strikerInput = document.getElementById("striker");
    const nStrikerBtn = document.getElementById("setnBatter");
    const nonStrikerInput = document.getElementById("nstriker");
    const bowlerBtn = document.getElementById("setBowler");
    const bowlerInput = document.getElementById("bowlerName");



    if(storeRun) {
        storeRun.addEventListener('click', (event) => {
        event.preventDefault();

        // Don't accept runs if we're waiting for a bowler input
        if (document.getElementById("bowlerName").style.display === "block") return;
        if (batsman1.style.display === "block") return;
        if (batsman2.style.display === "block") return;


        const selectedRun = document.querySelector('input[name="runs"]:checked');
        console.log(selectedRun);

        if (selectedRun) {
            const run = parseInt(selectedRun.value)
            console.log(`Ball ${active.balls + 1}: ${selectedRun.value} run(s) | Total: ${active.runs} | Bowler: ${inactive.bowlers[cBowler].name} | Current run rate: ${active.crr()}`);
            active.addBall();
            if (run === -1) {
                active.addWicket();
                active.batters[sBatter].addBall();
                inactive.bowlers[cBowler].addWicket();
                console.log(`Wicket! ${active.batters[sBatter].name} is out.`);
                batsman1.style.display = "block";
                sBatter = active.batters.length - 1;
            }
            else {
                active.runs += run
                active.batters[sBatter].addRun(run);
                active.batters[sBatter].addBall();
                inactive.bowlers[cBowler].addRun(run);
                if (run%2 === 1) {
                    let temp = sBatter;
                    sBatter = nBatter;
                    nBatter = temp;
                }
            }
            if(inactive.played) console.log(`Required run rate: ${active.rrr(inactive.runs)}`);
            console.log("I reach just before")
            if(!active.played && (active.balls === overs*6 || active.wickets === 10)) {
                console.log("I am inside of changing the batting and bowling")
                if(!inactive.played){
                    active.played = 1;
                    team1 = team1.batting ? active : inactive;
                    team2 = team2.batting ? active : inactive;
                    active = team1.played ? team2 : team1;
                    inactive = team1.played ? team1 : team2;
                    batsman1.style.display = "block";
                    batsman2.style.display = "block";
                    document.getElementById("bowlerName").style.display = "block";
                    sBatter = 0; 
                    nBatter = 1;
                    cBowler = 0;
                }
                else {
                    console.log("Match is finished. Redirecting.....");
                    windows.location.href = "summary.html";
                }
            }
            if (active.balls % 6 === 0) {
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
    }

    strikerBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form from reloading the page
        console.log(active);
    
        const name = strikerInput.value.trim(); // Get value from the input box
        if (name !== "") {
            // Create a new batter with the entered name
            const striker = new Batter(name, 0, 0, 0, 0);
            console.log("Striker batter set to: " + name);
    
            // Add the batter to the active team
            active.addBatter(striker);
    
            // Hide the striker input form
            batsman1.style.display = "none";
        } else {
            console.log("No name entered for striker.");
        }
    });

    nStrikerBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form from reloading the page

        const name = nonStrikerInput.value.trim(); // Get value from the input box
        if (name !== "") {
            // Create a new batter with the entered name
            const nStriker = new Batter(name, 0, 0, 0, 0);
            console.log("Non-striker batter set to: " + name);

            // Add the batter to the active team
            active.addBatter(nStriker);

            // Hide the non-striker input form
            batsman2.style.display = "none";
        } else {
            console.log("No name entered for non-striker.");
        }
    });

    bowlerBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form from reloading the page
    
        const name = bowlerInput.value.trim();
        if (name !== "") {
            // Create a new bowler with the entered name
            const bowler = new Bowler(name, 0, 0, 0);
            console.log("Bowler set to: " + name);
    
            // Add the bowler to the inactive team
            inactive.addBowler(bowler);
    
            // Hide the bowler input form (DOM element with id 'bowler')
            const bowlerInputElement = document.getElementById("bowlerName");
            if (bowlerInputElement) {
                bowlerInputElement.closest('div').style.display = "none"; // Hide the parent div containing the input form
            } else {
                console.log("Bowler input element not found.");
            }
        } else {
            console.log("No name entered for bowler.");
        }
    });
});