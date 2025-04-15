class Batter {
    constructor(name, runs, balls, fours, sixes, team) {
        this.name = name;
        this.runs = runs;
        this.balls = balls;
        this.fours = fours;
        this.sixes = sixes;
        this.team = team;
    }
    addRun(run){
        this.runs+=run;
        if(run === 4) this.fours+=1;
        else if(run === 6) this.sixes+=1;
    }
    addBall(){
        this.balls+=1;
    }
    crr(){
        return this.balls ? (this.runs/this.balls)*6 : 0;
    }
}

class Bowler {
    constructor(name, balls, overs, runs, wickets, team) {
        this.name = name;
        this.balls = balls;
        this.overs = overs;
        this.runs = runs;
        this.wickets = wickets;
        this.team = team;
        this.maidens = 0;
        this.currentOverRuns = 0;
    }

    addRun(run){
        this.runs += run;
        this.currentOverRuns += run;
    }

    addWicket(){
        this.wickets += 1;
    }

    addBall(){
        this.balls++;
    }

    addOver(){
        this.overs++;
        if (this.currentOverRuns === 0) {
            this.maidens++;
        }
        this.currentOverRuns = 0;
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
    const bowlerDiv = document.getElementById("bowler");
    const strikerBtn = document.getElementById("setcBatter");
    const strikerInput = document.getElementById("striker");
    const nStrikerBtn = document.getElementById("setnBatter");
    const nonStrikerInput = document.getElementById("nstriker");
    const bowlerBtn = document.getElementById("setBowler");
    const bowlerInput = document.getElementById("bowlerName");
    const scoreboardBtn = document.getElementById("navigateScoreboard")
    const liveBtn = document.getElementById("navigateLive")

    if(storeRun) {
        storeRun.addEventListener('click', (event) => {
        event.preventDefault();


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
                inactive.bowlers[cBowler].addBall();
                console.log(`Wicket! ${active.batters[sBatter].name} is out.`);
                batsman1.style.display = "block";
                sBatter = active.batters.length;
            }
            else {
                active.runs += run;
                active.batters[sBatter].addRun(run);
                active.batters[sBatter].addBall();
                inactive.bowlers[cBowler].addBall();
                inactive.bowlers[cBowler].addRun(run);
                if (run%2 === 1) {
                    let temp = sBatter;
                    sBatter = nBatter;
                    nBatter = temp;
                }
            }
            if(inactive.played) console.log(`Required run rate: ${active.rrr(inactive.runs)}`);
            if(!active.played && (active.balls === overs*6 || active.wickets === 10)) {
                console.log("I am inside of changing the batting and bowling")
                if(!inactive.played){
                    sBatter = 0; 
                    nBatter = 1;
                    cBowler = 0;
                    active.played = 1;
                    team1 = team1.batting ? active : inactive;
                    team2 = team2.batting ? active : inactive;
                    active = team1.batting ? team2 : team1;
                    inactive = team1.batting ? team1 : team2;
                    localStorage.setItem("team1", JSON.stringify(team1));
                    localStorage.setItem("team2", JSON.stringify(team2));
                    active.batting = 1;
                    inactive.batting = 0;
                    batsman1.style.display = "block";
                    batsman2.style.display = "block";
                    bowlerDiv.style.display = "block";
                }
                else {
                    active.played = 1;
                    team1 = team1.batting ? active : inactive;
                    team2 = team2.batting ? active : inactive;
                    team1.batting = 0;
                    team2.batting = 0;
                    localStorage.setItem("team1",JSON.stringify(team1));
                    localStorage.setItem("team2",JSON.stringify(team2));
                    console.log("Match is finished. Redirecting.....");
                    window.location.href = "summary.html";
                }
            }
            if (active.balls % 6 === 0 && active.balls !== 0) {
                bowlerDiv.style.display = "block";
                cBowler++;
                inactive.bowlers[cBowler].addBall();
                inactive.bowlers[cBowler].addOver();
                [sBatter, nBatter] = [nBatter, sBatter]
            }
            selectedRun.checked = false;
            updateLive();
        } else {
            console.log("No run selected.");
        }
    });
    }

    strikerBtn.addEventListener('click', (event) => {
        event.preventDefault(); 

    
        const name = strikerInput.value.trim(); 
        if (name !== "") {
            const striker = new Batter(name, 0, 0, 0, 0, active.name);
            console.log("Striker batter set to: " + name);
            active.addBatter(striker);
            batsman1.style.display = "none";
            console.log(active.batters);
        } else {
            console.log("No name entered for striker.");
        }
        updateLive();
    });

    nStrikerBtn.addEventListener('click', (event) => {
        event.preventDefault();

        const name = nonStrikerInput.value.trim();
        if (name !== "") {
            const nStriker = new Batter(name, 0, 0, 0, 0, active.name);
            console.log("Non-striker batter set to: " + name);
            active.addBatter(nStriker);
            batsman2.style.display = "none";
            console.log(active.batters);
        } else {
            console.log("No name entered for non-striker.");
        }
        updateLive();
    });

    bowlerBtn.addEventListener('click', (event) => {
        event.preventDefault(); 
    
        const name = bowlerInput.value.trim();
        if (name !== "") {
            if (!inactive.bowlers.some(b => b.name === name)) {
                const bowler = new Bowler(name, 0, 0, 0, 0, inactive.name);
                inactive.addBowler(bowler);
                console.log("New bowler added:", name);
                bowlerDiv.style.display = "none";
            } else {
                console.log("Bowler already exists:", name);
            }
        } else {
            console.log("No name entered for bowler.");
        }
        updateLive();
    });

    scoreboardBtn.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = "scoreboard.html";
        updateScoreboard();
    });

    liveBtn.addEventListener('click', (event) =>{
        event.preventDefault();
        window.location.href = "live.html";
    });

    function updateLive(){
        const matchInfo = document.getElementById("matchInfo");
        const currentInfo = document.getElementById("currentInfo");
        if(!inactive.played){
            matchInfo.textContent = `${active.name} ${active.runs}/${active.wickets} (${Math.floor(active.balls/6)}.${active.balls%6}) vs. ${inactive.name}`;
        }
        else {
            matchInfo.textContent = `${active.name} ${active.runs}/${active.wickets} (${Math.floor(active.balls/6)}.${active.balls%6}) vs. ${inactive.name} ${inactive.runs}/${inactive.wickets} (${Math.floor(inactive.balls/6)}.${inactive.balls%6})`;
        }
        if(active.batters[0] && active.batters[1] && inactive.bowlers[0]){
            currentInfo.innerHTML = `
            <table id="currentBatters">
                <tr>
                    <th>Position</th>
                    <th>Name</th>
                    <th>Runs scored</th>
                    <th>Fours</th>
                    <th>Sixes</th>
                    <th>Balls played</th>
                    <th>Current Run Rate</th>
                </tr>
                <tr>
                    <td>Striker Batsman</td>
                    <td>${active.batters[sBatter].name}</td>
                    <td>${active.batters[sBatter].runs}</td>
                    <td>${active.batters[sBatter].fours}</td>
                    <td>${active.batters[sBatter].sixes}</td>
                    <td>${active.batters[sBatter].balls}</td>
                    <td>${active.batters[sBatter].crr()}</td>
                </tr>
                <tr>
                    <td>Non-Striker Batsman</td>
                    <td>${active.batters[nBatter].name}</td>
                    <td>${active.batters[nBatter].runs}</td>
                    <td>${active.batters[nBatter].fours}</td>
                    <td>${active.batters[nBatter].sixes}</td>
                    <td>${active.batters[nBatter].balls}</td>
                    <td>${active.batters[nBatter].crr()}</td>
                </tr>
            </table>
            <table id="currentBowler">
                <tr>
                    <th>Bowler no.</th>
                    <th>Name</th>
                    <th>Balls</th>
                    <th>Overs</th>
                    <th>Maidens</th>
                    <th>Runs conceded</th>
                    <th>Wickets Taken</th>
                    <th>Economy Rate</th>
                </tr>
                <tr>
                    <td>${cBowler+1}</td>
                    <td>${inactive.bowlers[cBowler].name}</td>
                    <td>${inactive.bowlers[cBowler].balls}</td>
                    <td>${inactive.bowlers[cBowler].overs}</td>
                    <td>${inactive.bowlers[cBowler].maidens}</td>
                    <td>${inactive.bowlers[cBowler].runs}</td>
                    <td>${inactive.bowlers[cBowler].wickets}</td>
                    <td>${!inactive.bowlers[cBowler].runs/inactive.bowlers[cBowler].overs ? 0 :  inactive.bowlers[cBowler].runs/inactive.bowlers[cBowler].balls*6}</td>
                </tr>
            </table>
            `
        }
    }
    function updateScoreboard() {
        const BtBody = document.getElementById("batsmanBody");
        BtBody.innerHTML = ""; 
        const BwBody = document.getElementById("bowlerBody");
        BwBody.innerHTML = "";
        const allBatters = [...active.batters, ...inactive.batters];
        const allBowlers = [...inactive.bowlers, ...active.bowlers];

        let i = 1;
        allBatters.forEach(batter => {
            BtBody.innerHTML += `
                <tr>
                    <td>${i++}</td>
                    <td>${batter.name}</td>
                    <td>${batter.team}</td>
                    <td>${batter.runs}</td>
                    <td>${batter.balls}</td>
                    <td>${batter.fours}</td>
                    <td>${batter.sixes}</td>
                    <td>${(batter.crr()).toFixed(2)}</td>
                </tr>
            `;
        });
        i = 1;
        allBowlers.forEach(bowler => {
            BwBody.innerHTML += `
                <tr>
                    <td>${i++}</td>
                    <td>${bowler.name}</td>
                    <td>${bowler.team}</td>
                    <td>${bowler.overs}</td>
                    <td>${bowler.maidens}</td>
                    <td>${bowler.runs}</td>
                    <td>${bowler.wickets}</td>
                    <td>${!bowler.runs/bowler.overs ? 0 :  (bowler.runs/bowler.overs*6).toFixed(2)}</td>
                </tr>
            `;
        });
    }
    
});