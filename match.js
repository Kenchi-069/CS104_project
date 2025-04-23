
export class Match {
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
export class Batter {
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

export class Bowler {
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



export class Team {
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
    crr(){
        return (this.runs/this.balls)*6;
    }
    rrr(run){
        let ans = (run-this.runs)/(overs-(this.balls/6));
        if (ans > 0) return ans;
        else return 0;
    }
}

export function clearLocalStorage(excludeKeys = []) {
    const keysToKeep = new Set(excludeKeys);
    const keys = Object.keys(localStorage);

    for (const key of keys) {
        if (!keysToKeep.has(key)) {
            localStorage.removeItem(key);
        }
    }
}


export function reviveTeam(raw) {
    const team = new Team(raw.name, [], [], raw.balls, raw.runs, raw.wickets, raw.batting, raw.played);
    raw.batters.forEach(b => {
        team.batters.push(Object.assign(new Batter(), b));
    });
    raw.bowlers.forEach(bw => {
        team.bowlers.push(Object.assign(new Bowler(), bw));
    });
    return team;
}

export function won(team1,team2) {
    if(team1.runs > team2.runs) return team1;
    else if(team2.runs > team1.runs) return team2;
    else return 0;
}

const commentaryBox = document.getElementById('commentary');

export function addCommentary(text) {
    const entry = document.createElement('div');
    entry.className = 'commentary-entry';
    entry.textContent = text;
    commentaryBox.appendChild(entry);
    commentaryBox.scrollTop = commentaryBox.scrollHeight;
    let commentaryString = localStorage.getItem("commentary") || [];
    commentaryString.append(text);
    localStorage.setItem("commentary", commentaryString);
}

