export class Batter {
    constructor(name, runs = 0, balls = 0, fours = 0, sixes = 0, team = "") {
        this.name = name;
        this.runs = runs;
        this.balls = balls;
        this.fours = fours;
        this.sixes = sixes;
        this.team = team;
    }

    addRun(run) {
        this.runs += run;
        if (run === 4) this.fours++;
        else if (run === 6) this.sixes++;
    }

    addBall() {
        this.balls++;
    }

    getCRR() {
        return this.balls ? (this.runs / this.balls) * 6 : 0;
    }
}


export class Bowler {
    constructor(name, balls = 0, overs = 0, runs = 0, wickets = 0, team = "") {
        this.name = name;
        this.balls = balls;
        this.overs = overs;
        this.runs = runs;
        this.wickets = wickets;
        this.team = team;
        this.maidens = 0;
        this.currentOverRuns = 0;
    }

    addRun(run) {
        this.runs += run;
        this.currentOverRuns += run;
    }

    addWicket() {
        this.wickets++;
    }

    addBall() {
        this.balls++;
    }

    addOver() {
        this.overs++;
        if (this.currentOverRuns === 0) {
            this.maidens++;
        }
        this.currentOverRuns = 0;
    }
}



export class Team {
    constructor(name, batters = [], bowlers = [], balls = 0, runs = 0, wickets = 0, batting = true, played = false) {
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

    getCRR() {
        return this.balls ? (this.runs / this.balls) * 6 : 0;
    }

    getRRR(targetRuns, totalOvers) {
        const oversBowled = this.balls / 6;
        const oversRemaining = totalOvers - oversBowled;
        const requiredRuns = targetRuns - this.runs;
        return oversRemaining > 0 ? requiredRuns / oversRemaining : 0;
    }
}



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

    async saveToBackend() {
        const response = await fetch('http://localhost:3000/api/match', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this)
        });

        const result = await response.json();
        console.log("Match saved to backend:", result);
        return result;
    }
}
