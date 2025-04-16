import { Match } from 'match.js';
console.log("teri maa ka bhosdaa");
document.addEventListener('DOMContentLoaded', async () => {
    const team1 = JSON.parse(localStorage.getItem("team1"));
    const team2 = JSON.parse(localStorage.getItem("team2"));
    
    console.log("[DEBUG] Team1:", team1); // Verify data exists
    console.log("[DEBUG] Team2:", team2);

    const match = new Match(
        Match.generateID(),
        team1.name,
        team2.name,
        team1.runs > team2.runs ? team1.name : team2.name,
        `${team1.runs}/${team1.wickets}`,
        `${team2.runs}/${team2.wickets}`
    );

    console.log("[DEBUG] Match to save:", match);
    
    try {
        console.log("[DEBUG] Attempting to save match...");
        const result = await match.saveToBackend();
        console.log("[DEBUG] Save result:", result);
    } catch (error) {
        console.error("[ERROR] Save failed:", error);
    }
});
document.getElementById("resetMatch").addEventListener('click',(event)=> {
    event.preventDefault();
    localStorage.clear();
});

function won(team1,team2) {
    if(team1.runs > team2.runs) return team1;
    else if(team2.runs > team1.runs) return team2;
    else return 0;
}