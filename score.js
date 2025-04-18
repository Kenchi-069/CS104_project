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
let wasNoBall = false;

document.addEventListener('DOMContentLoaded', () => {
    const startMatch = document.getElementById("startMatch");
    if(startMatch) {
        startMatch.addEventListener('click', (event) => {
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
        
        const firstBatter = team1.batting ? team1.name : team2.name;
        localStorage.setItem("firstBatter", firstBatter);
        localStorage.setItem("team1", JSON.stringify(team1));
        localStorage.setItem("team2", JSON.stringify(team2));
        localStorage.setItem("toss", toss);
        localStorage.setItem("tossResult", tossResult);
        window.location.href = "live.html";
    });}
    team1 = reviveTeam(JSON.parse(localStorage.getItem("team1")));
    team2 = reviveTeam(JSON.parse(localStorage.getItem("team2")));
    const toss = localStorage.getItem("toss");
    const tossResult = localStorage.getItem("tossResult");
    active = team1.batting === 1 ? team1 : team2;
    inactive = team1.batting === 1 ? team2 : team1;
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
    const scoreboardBtn = document.getElementById("navigateScoreboard");
    const liveBtn = document.getElementById("navigateLive");
    const savedState = localStorage.getItem("matchState");
    const currentInfo = document.getElementById("currentInfo");
    if(document.getElementById("tossInfo")){
        document.getElementById("tossInfo").innerText =  `Toss won by: ${toss} and chose to ${tossResult}`;
    }
    
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
            var isNoBall = document.getElementById("noBall").checked;
            var isBye = document.getElementById("bye").checked; 
            var isLegBye = document.getElementById("legBye").checked;  
            if(isNoBall) {
                active.balls--;
                active.batters[sBatter].balls--;
                inactive.bowlers[cBowler].balls--;
                wasNoBall = true;
            }
            else if(isBye) {
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
            else if(isLegBye) {
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
            if (run === -1) {
                if(wasNoBall) {
                    console.log("It's a Free hit!!");
                    wasNoBall = !wasNoBall;
                }
                else {
                    active.addWicket();
                    active.batters[sBatter].addBall();
                    inactive.bowlers[cBowler].addWicket();
                    inactive.bowlers[cBowler].addBall();
                    console.log(`Wicket! ${active.batters[sBatter].name} is out.`);
                    batsman1.style.display = "block";
                    sBatter = active.batters.length;
                }
            }
            else if(run === 7){
                active.runs++;
                active.balls--;
                active.batters[sBatter].addRun(1);
                inactive.bowlers[cBowler].addRun(1);
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
            if(inactive.played) {
                console.log(`Required run rate: ${active.rrr(inactive.runs)}`);
                if(active.runs > inactive.runs){
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


    if(savedState){
        const { active : savedActive, inactive : savedInactive, sBatter : savedSBatter, nBatter : savedNBatter, cBowler : savedCBowler, currentInfoHTML} = JSON.parse(savedState);
        active = reviveTeam(savedActive);
        inactive = reviveTeam(savedInactive);
        sBatter = savedSBatter;
        nBatter = savedNBatter;
        cBowler = savedCBowler;
        if(currentInfo && currentInfoHTML){
            currentInfo.innerHTML = currentInfoHTML;
        }
        if(batsman1){
            batsman1.style.display="none";
            batsman2.style.display="none";
            bowlerDiv.style.display="none";
            updateLive();
        }
    }


    if(strikerBtn) {
        strikerBtn.addEventListener('click', (event) => {
            event.preventDefault(); 

        
            const name = strikerInput.value.trim(); 
            if (name !== "") {
                if (!active.batters.some(b => b.name === name)) {
                    const striker = new Batter(name, 0, 0, 0, 0, active.name);
                    active.addBatter(striker);
                    console.log("New batter added:", name);
                    batsman1.style.display = "none";
                } else {
                    console.log("Batter already exists:", name);
                }
            } else {
                console.log("No name entered for striker.");
            }
            updateLive();
        });
    }

    if(nStrikerBtn){
        nStrikerBtn.addEventListener('click', (event) => {
            event.preventDefault();
    
            const name = nonStrikerInput.value.trim();
            if (name !== "") {
                if (!active.batters.some(b => b.name === name)) {
                    const nStriker = new Batter(name, 0, 0, 0, 0, active.name);
                    active.addBatter(nStriker);
                    console.log("New batter added:", name);
                    batsman2.style.display = "none";
                } else {
                    console.log("Batter already exists:", name);
                }
            } else {
                console.log("No name entered for non-striker.");
            }
            updateLive();
        });
    }
    
    if(bowlerBtn){
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
    }
    
    if(scoreboardBtn){
        scoreboardBtn.addEventListener('click', (event) => {
            event.preventDefault();
            saveState();
            window.location.href = "scoreboard.html";
            console.log("Iss webpage ki maaa ka bhosdaa");
        });
    }
    console.log("Iss webpage ki maaa ka bhosdaa");
    if(liveBtn){
        liveBtn.addEventListener('click', (event) => {
            event.preventDefault();
            console.log("wtf wont it goooooooo!!!!!!!")
            window.location.href = "live.html";
        });
    }
    

    function updateLive(){
        const matchInfo = document.getElementById("matchInfo");
        const currentInfo = document.getElementById("scoreboard");
        if(!inactive.played){
            matchInfo.textContent = `${active.name} ${active.runs}/${active.wickets} (${Math.floor(active.balls/6)}.${active.balls%6}) vs. ${inactive.name}`;
        }
        else {
            matchInfo.textContent = `${active.name} ${active.runs}/${active.wickets} (${Math.floor(active.balls/6)}.${active.balls%6}) vs. ${inactive.name} ${inactive.runs}/${inactive.wickets} (${Math.floor(inactive.balls/6)}.${inactive.balls%6})`;
        }
        if(active.batters[0] && active.batters[1] && inactive.bowlers[0]){
            currentInfo.innerHTML = `
                <h2>Current score</h2>
                <div class="tables-container">
                    <!-- Current Batters Table -->
                    <table id="currentBatters" class="scoretable">
                        <thead>
                            <tr>
                                <th>Position</th>
                                <th>Name</th>
                                <th>Runs</th>
                                <th>4s</th>
                                <th>6s</th>
                                <th>Balls</th>
                                <th>Run Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Striker</td>
                                <td>${active.batters[sBatter].name}</td>
                                <td>${active.batters[sBatter].runs}</td>
                                <td>${active.batters[sBatter].fours}</td>
                                <td>${active.batters[sBatter].sixes}</td>
                                <td>${active.batters[sBatter].balls}</td>
                                <td>${(active.batters[sBatter].crr()).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Non-Striker</td>
                                <td>${active.batters[nBatter].name}</td>
                                <td>${active.batters[nBatter].runs}</td>
                                <td>${active.batters[nBatter].fours}</td>
                                <td>${active.batters[nBatter].sixes}</td>
                                <td>${active.batters[nBatter].balls}</td>
                                <td>${(active.batters[nBatter].crr()).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table id="currentBowler" class="scoretable">
                        <thead>
                            <tr>
                                <th>Bowler</th>
                                <th>Name</th>
                                <th>Balls</th>
                                <th>Overs</th>
                                <th>Maidens</th>
                                <th>Runs</th>
                                <th>Wickets</th>
                                <th>Economy</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${cBowler+1}</td>
                                <td>${inactive.bowlers[cBowler].name}</td>
                                <td>${inactive.bowlers[cBowler].balls}</td>
                                <td>${inactive.bowlers[cBowler].overs}</td>
                                <td>${inactive.bowlers[cBowler].maidens}</td>
                                <td>${inactive.bowlers[cBowler].runs}</td>
                                <td>${inactive.bowlers[cBowler].wickets}</td>
                                <td>${!inactive.bowlers[cBowler].runs/inactive.bowlers[cBowler].overs ? 0 :  (inactive.bowlers[cBowler].runs/inactive.bowlers[cBowler].balls*6).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `
        }
    }
    if (document.getElementById("whoWon")) {
        const whoWon = document.getElementById("whoWon");
        const winningTeam = won(team1, team2);
        const firstBatter = localStorage.getItem("firstBatter");
        console.log(winningTeam.name);
        console.log(firstBatter);
        if (winningTeam === 0) {
            whoWon.textContent = `Draw — both teams at ${team1.runs} Runs in 2 overs`;
        } else if (winningTeam.name === firstBatter) {
            whoWon.textContent = `${firstBatter} won by ${Math.abs(team1.runs - team2.runs)} runs`;
            console.log(winningTeam.name);
        } else if(winningTeam.name !== firstBatter){
            whoWon.textContent = `${winningTeam.name} won by ${10 - winningTeam.wickets} Wickets (${12 - winningTeam.balls} balls left)`;
        }
    }
    
    if(document.getElementById("scoreboardBatsman")) {
        const BtBody = document.getElementById("batsmanBody");
        const BwBody = document.getElementById("bowlerBody");
        const allBatters = active.batters.concat(inactive.batters);
        const allBowlers = active.bowlers.concat(inactive.bowlers);
        console.log(allBatters);
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

    function saveState() {
        const state = {
            active,
            inactive,    
            sBatter,     
            nBatter,     
            cBowler,
            currentInfoHTML: currentInfo ? currentInfo.innerHTML : ""     
        };

        localStorage.setItem("matchState", JSON.stringify(state));
    }
    
    function reviveTeam(raw) {
        const team = new Team(raw.name, [], [], raw.balls, raw.runs, raw.wickets, raw.batting, raw.played);
        raw.batters.forEach(b => {
            team.batters.push(Object.assign(new Batter(), b));
        });
        raw.bowlers.forEach(bw => {
            team.bowlers.push(Object.assign(new Bowler(), bw));
        });
        return team;
    }

    function won(team1,team2) {
        if(team1.runs > team2.runs) return team1;
        else if(team2.runs > team1.runs) return team2;
        else return 0;
    }
});

