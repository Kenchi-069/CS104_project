
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
        const url = 'http://localhost:3000/api/match';
        console.log("[DEBUG] Saving to:", url);
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this)
            });
            
            console.log("[DEBUG] Response status:", response.status);
            const result = await response.json();
            console.log("[DEBUG] Save response:", result);
            return result;
        } catch (error) {
            console.error("[ERROR] Save failed:", error);
            throw error;
        }
    }
}
