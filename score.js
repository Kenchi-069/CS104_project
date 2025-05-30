import {Batter, Bowler, Team, reviveTeam, won, addCommentary} from './match.js'
let team1, team2;
let sBatter = 0, nBatter = 1, cBowler = 0;
let active, inactive;
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
        const overs = document.getElementById("overs").value || 2;
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
        localStorage.setItem("overs", overs);
        window.location.href = "live.html";
    });}
    team1 = reviveTeam(JSON.parse(localStorage.getItem("team1")));
    team2 = reviveTeam(JSON.parse(localStorage.getItem("team2")));
    const toss = localStorage.getItem("toss");
    const tossResult = localStorage.getItem("tossResult");
    const overs = localStorage.getItem("overs");
    active = team1.batting === 1 ? team1 : team2;
    inactive = team1.batting === 1 ? team2 : team1;

    

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
    const progressBar = document.getElementById('progressBar');
    const commentaryBox = document.getElementById('commentary');

    if(savedState){
        const { active : savedActive, inactive : savedInactive, sBatter : savedSBatter, nBatter : savedNBatter, cBowler : savedCBowler, currentInfoHTML, commentaryBoxInfoHTML, batsman1InfoHTML, batsman2InfoHTML, bowlerInfoHTML} = JSON.parse(savedState);
        active = reviveTeam(savedActive);
        inactive = reviveTeam(savedInactive);
        console.log(savedSBatter);
        sBatter = savedSBatter;
        nBatter = savedNBatter;
        cBowler = savedCBowler;
        const totalProgress = ((active.balls+inactive.balls) / (overs * 12)) * 100;
        if(progressBar) progressBar.style.width = `${totalProgress}%`;
        if(commentaryBox) commentaryBox.innerHTML = commentaryBoxInfoHTML;
        if(currentInfo && currentInfoHTML){
            currentInfo.innerHTML = currentInfoHTML;
        }
        if(batsman1){
            batsman1.style.display = batsman1InfoHTML || "none";
            batsman2.style.display = batsman2InfoHTML || "none";
            bowlerDiv.style.display = bowlerInfoHTML || "none";
            updateLive();
        }
    }

    if(document.getElementById("tossInfo")){
        document.getElementById("tossInfo").innerText =  `Toss won by: ${toss} and chose to ${tossResult}`;
        addCommentary(`Match between ${team1.name} and ${team2.name} is ready`);
        addCommentary(`Toss: ${toss} wins and chooses to ${tossResult} first`);
    }
    
    if(storeRun) {
        storeRun.addEventListener('click', (event) => {
            event.preventDefault();


            if (document.getElementById("bowlerName").style.display === "block") return;
            if (batsman1.style.display === "block") return;
            if (batsman2.style.display === "block") return;

            const selectedRun = document.querySelector('input[name="runs"]:checked');

            if (selectedRun) {
                const run = parseInt(selectedRun.value)

                active.addBall();
                var isNoBall = document.getElementById("noBall").checked;
                var isBye = document.getElementById("bye").checked; 
                var isLegBye = document.getElementById("legBye").checked;  
                if(isNoBall) {
                    active.balls--;
                    active.batters[sBatter].balls--;
                    inactive.bowlers[cBowler].balls--;
                    wasNoBall = true;
                    addCommentary(`No ball bowled by ${inactive.bowlers[cBowler].name} to ${active.batters[sBatter].name}`);
                    inactive.bowlers[cBowler].addComment(`No ball bowled by ${inactive.bowlers[cBowler].name} to ${active.batters[sBatter].name}`);
                    active.batters[sBatter].addComment(`No ball bowled by ${inactive.bowlers[cBowler].name} to ${active.batters[sBatter].name}`);
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
                        alert("It's a Free hit!!");
                        wasNoBall = !wasNoBall;
                    }
                    else {
                        active.addWicket();
                        batsman1.style.display = "block";
                        sBatter = active.batters.length;
                        addCommentary(`WICKET! ${inactive.bowlers[cBowler].name} takes the wicket of ${active.batters[sBatter].name}`);
                        inactive.bowlers[cBowler].addComment(`WICKET! ${inactive.bowlers[cBowler].name} takes the wicket of ${active.batters[sBatter].name}`);
                        active.batters[sBatter].addComment(`WICKET! ${inactive.bowlers[cBowler].name} takes the wicket of ${active.batters[sBatter].name}`);
                    }
                }
                else if(run === 7){
                    active.runs++;
                    active.balls--;
                    active.batters[sBatter].addRun(1);
                    inactive.bowlers[cBowler].addRun(1);
                    addCommentary(`WIDE! ${inactive.bowlers[cBowler].name} bowls a wide, extra run given`);
                    inactive.bowlers[cBowler].addComment(`WIDE! ${inactive.bowlers[cBowler].name} bowls a wide, extra run given`);
                }
                else {
                    active.runs += run;
                    active.batters[sBatter].addRun(run);
                    active.batters[sBatter].addBall();
                    inactive.bowlers[cBowler].addBall();
                    inactive.bowlers[cBowler].addRun(run);
                    if (run === 0) {
                        addCommentary(`Good ball by ${inactive.bowlers[cBowler].name}, dot ball`);
                        inactive.bowlers[cBowler].addComment(`Good ball by ${inactive.bowlers[cBowler].name}, dot ball`);
                    } else if (run === 4) {
                        addCommentary(`FOUR! ${active.batters[sBatter].name} hits a boundary off ${inactive.bowlers[cBowler].name}`);
                        inactive.bowlers[cBowler].addComment(`FOUR! ${active.batters[sBatter].name} hits a boundary off ${inactive.bowlers[cBowler].name}`);
                        active.batters[sBatter].addComment(`FOUR! ${active.batters[sBatter].name} hits a boundary off ${inactive.bowlers[cBowler].name}`);
                    } else if (run === 6) {
                        addCommentary(`SIX! ${active.batters[sBatter].name} smashes ${inactive.bowlers[cBowler].name} for a maximum`);
                        inactive.bowlers[cBowler].addComment(`SIX! ${active.batters[sBatter].name} smashes ${inactive.bowlers[cBowler].name} for a maximum`);
                        active.batters[sBatter].addComment(`SIX! ${active.batters[sBatter].name} smashes ${inactive.bowlers[cBowler].name} for a maximum`);
                    } else {
                        addCommentary(`${run} run${run > 1 ? 's' : ''} taken by ${active.batters[sBatter].name}`);
                        active.batters[sBatter].addComment(`${run} run${run > 1 ? 's' : ''} taken by ${active.batters[sBatter].name}`);
                    }
                    if (run%2 === 1) {
                        let temp = sBatter;
                        sBatter = nBatter;
                        nBatter = temp;
                    }
                }
                if(inactive.played) {
                    if(active.runs > inactive.runs){
                        active.played = 1;
                        team1 = team1.batting ? active : inactive;
                        team2 = team2.batting ? active : inactive;
                        team1.batting = 0;
                        team2.batting = 0;
                        localStorage.setItem("team1",JSON.stringify(team1));
                        localStorage.setItem("team2",JSON.stringify(team2));
                        alert("Match is finished. Redirecting.....");
                        window.location.href = "summary.html";
                    }
                }
                if(active.balls === overs*6 || active.wickets === 10) {
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
                        addCommentary(`All out! ${active.name} finishes at ${active.runs}/${active.wickets}`);
                    }
                    else {
                        active.played = 1;
                        team1 = team1.batting ? active : inactive;
                        team2 = team2.batting ? active : inactive;
                        team1.batting = 0;
                        team2.batting = 0;
                        localStorage.setItem("team1",JSON.stringify(team1));
                        localStorage.setItem("team2",JSON.stringify(team2));
                        addCommentary(`MATCH OVER!`);
                        alert("Match is finished. Redirecting.....");
                        window.location.href = "summary.html";
                    }
                }
                if (active.balls % 6 === 0 && active.balls !== 0) {
                    inactive.bowlers[cBowler].addBall();
                    inactive.bowlers[cBowler].addOver();
                    bowlerDiv.style.display = "block";
                    [sBatter, nBatter] = [nBatter, sBatter]
                }
                selectedRun.checked = false;
                updateLive();
            } 
            else {
                alert("No run selected.");
            }
            const totalProgress = ((active.balls+inactive.balls) / (overs * 12)) * 100;
            progressBar.style.width = `${totalProgress}%`;
        });
    }





    if (strikerBtn) {
        strikerBtn.addEventListener('click', (event) => {
            event.preventDefault();
    
            const name = strikerInput.value.trim();
    
            if (name !== "") {
                if (inactive.played && (active.batters.length + active.bowlers.length >= 11 || inactive.batters + inactive.bowlers >= 11)) {
                    if (!active.batters.some(b => b.name === name)) {
                        alert("Team size exceeded, please choose an already played player.");
                        return;
                    }
                }
                
                else if (!active.batters.some(b => b.name === name)) {
                    const striker = new Batter(name, 0, 0, 0, 0, active.name, []);
                    active.addBatter(striker);
                    batsman1.style.display = "none";
                    addCommentary(`New batter ${striker.name} comes to the crease`);
                    striker.addComment(`New batter ${striker.name} comes to the crease`);
                } else {
                    alert(`Batter "${name}" has already played.`);
                }
            } else {
                alert("No name entered for striker.");
            }
    
            updateLive();
        });
    }
    

    if (nStrikerBtn) {
        nStrikerBtn.addEventListener('click', (event) => {
            event.preventDefault();
    
            const name = nonStrikerInput.value.trim();
    
            if (name !== "") {
                if (inactive.played && 
                    (active.batters.length + active.bowlers.length === 11 || 
                     inactive.batters.length + inactive.bowlers.length === 11)) {
                     
                    if (active.bowlers.some(bowler => bowler.name === name)) {
                        alert("Team size exceeded. Please choose an already played player.");
                        return;
                    }
                }
                if (!active.batters.some(b => b.name === name)) {
                    const nStriker = new Batter(name, 0, 0, 0, 0, active.name, []);
                    active.addBatter(nStriker);
                    batsman2.style.display = "none";
                    addCommentary(`New batter ${nStriker.name} comes to the crease`);
                    nStriker.addComment(`New batter ${nStriker.name} comes to the crease`);
                } else {
                    alert(`Batter already exists: ${name}`);
                }
            } else {
                alert("No name entered for non-striker.");
            }
    
            updateLive();
        });
    }
    
    
    if (bowlerBtn) {
        bowlerBtn.addEventListener('click', (event) => {
            event.preventDefault();
    
            const name = bowlerInput.value.trim();
    
            if (name !== "") {
                if (
                    inactive.played &&
                    (active.batters.length + active.bowlers.length >= 11 ||
                     inactive.batters.length + inactive.bowlers.length >= 11)
                ) {
                    const alreadyPlayed = inactive.bowlers.some(bowler => bowler.name === name);
                    if (!alreadyPlayed) {
                        alert("Team size exceeded. Please choose an already played player.");
                        return;
                    }
                }
    
                const existingBowlerIndex = inactive.bowlers.findIndex(b => b.name === name);
                if (existingBowlerIndex === -1) {
                    const bowler = new Bowler(name, 0, 0, 0, 0, inactive.name, []);
                    inactive.addBowler(bowler);
                    cBowler = inactive.bowlers.length - 1;
                    bowlerDiv.style.display = "none";
    
                    if (inactive.bowlers.length === 1) {
                        addCommentary(`First bowler ${bowler.name} comes into the attack`);
                        bowler.addComment(`First bowler ${bowler.name} comes into the attack`);
                    } else {
                        addCommentary(`Over completed. New bowler ${bowler.name} comes into the attack`);
                        bowler.addComment(`Over completed. New bowler ${bowler.name} comes into the attack`);
                    }
                } else {
                    cBowler = existingBowlerIndex;
                    addCommentary(`Over completed. Bowler ${name} once again comes into the attack`);
                    inactive.bowlers[cBowler].addComment(`Over completed. Bowler ${name} once again comes into the attack`);
                }
            } else {
                alert("No name entered for bowler.");
            }
    
            updateLive();
        });
    }
    
    
    if(scoreboardBtn){
        scoreboardBtn.addEventListener('click', (event) => {

            if( batsman1.style.display === "none" && batsman2.style.display === "none" && bowlerDiv.style.display === "none") {
                event.preventDefault();
                saveState();
                window.location.href = "scoreboard.html";
            }
            else alert("Please first fill the required field to go to scoreboard.html")
        });
    }

    if(liveBtn){
        liveBtn.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = "live.html";
        });
    }
    

    function updateLive() {
        const matchInfo = document.getElementById("matchInfo");
        const scoreboard = document.getElementById("scoreboard");
        
        if(!inactive.played){
            matchInfo.textContent = `${active.name} ${active.runs}/${active.wickets} (${Math.floor(active.balls/6)}.${active.balls%6}) vs. ${inactive.name}`;
        }
        else {
            matchInfo.textContent = `${active.name} ${active.runs}/${active.wickets} (${Math.floor(active.balls/6)}.${active.balls%6}) vs. ${inactive.name} ${inactive.runs}/${inactive.wickets} (${Math.floor(inactive.balls/6)}.${inactive.balls%6})`;
        }
        
        if(active.batters[0] && active.batters[1] && inactive.bowlers[0]){
            scoreboard.innerHTML = `
                <h2>Current Match Status</h2>
                <div class="tables-wrapper">
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
                                <td>${((active.batters[sBatter].sr())).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Non-Striker</td>
                                <td>${active.batters[nBatter].name}</td>
                                <td>${active.batters[nBatter].runs}</td>
                                <td>${active.batters[nBatter].fours}</td>
                                <td>${active.batters[nBatter].sixes}</td>
                                <td>${active.batters[nBatter].balls}</td>
                                <td>${((active.batters[sBatter].sr()).toFixed(2))}</td>
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
                                <td>${inactive.bowlers[cBowler].er().toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
        }
    }
    if (document.getElementById("whoWon")) {
        const whoWon = document.getElementById("whoWon");
        const winningTeam = won(team1, team2);
        const firstBatter = localStorage.getItem("firstBatter");
        if (winningTeam === 0) {
            whoWon.textContent = `Draw — both teams at ${team1.runs} Runs in 2 overs`;
        } else if (winningTeam.name === firstBatter) {
            whoWon.textContent = `${firstBatter} won by ${Math.abs(team1.runs - team2.runs)} runs`;
        } else if(winningTeam.name !== firstBatter){
            whoWon.textContent = `${winningTeam.name} won by ${10 - winningTeam.wickets} Wickets (${12 - winningTeam.balls} balls left)`;
        }
    }
    
    if(document.getElementById("scoreboardBatsman")) {
        const BtBody = document.getElementById("batsmanBody");
        const BwBody = document.getElementById("bowlerBody");
        const allBatters = active.batters.concat(inactive.batters);
        const allBowlers = active.bowlers.concat(inactive.bowlers);
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
                    <td>${bowler.er().toFixed(2)}</td>
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
            currentInfoHTML: currentInfo ? currentInfo.innerHTML : "",
            commentaryBoxInfoHTML : commentaryBox ? commentaryBox.innerHTML : "",
            batsman1InfoHTML: batsman1.style.display,
            batsman2InfoHTML: batsman2.style.display,
            bowlerInfoHTML: bowlerDiv.style.display,
            
        };
    
        localStorage.setItem("matchState", JSON.stringify(state));
    }
});

