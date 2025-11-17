async function loadStats() {
    const res = await fetch("./JSON/players.json");
    const players = await res.json();

    // 射手榜
    const topScorers = [...players]
        .filter(p => Number(p.player_goals) > 0)
        .sort((a, b) => Number(b.player_goals) - Number(a.player_goals))
        .slice(0, 10);

    // 黃牌榜
    const topYellow = [...players]
        .filter(p => Number(p.player_yellow_cards) > 0)
        .sort((a, b) => Number(b.player_yellow_cards) - Number(a.player_yellow_cards))
        .slice(0, 10);

    // 紅牌榜
    const topRed = [...players]
        .filter(p => Number(p.player_red_cards) > 0)
        .sort((a, b) => Number(b.player_red_cards) - Number(a.player_red_cards))
        .slice(0, 10);

    renderStatsTable("stats-top-scorers", topScorers, "player_goals");
    renderStatsTable("stats-top-yellow", topYellow, "player_yellow_cards");
    renderStatsTable("stats-top-red", topRed, "player_red_cards");

    setupStatsTabs();
}

function renderStatsTable(tbodyId, list, key) {
    const tbody = document.getElementById(tbodyId);
    tbody.innerHTML = "";

    list.forEach((p, i) => {
        tbody.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${p.player_name}</td>
                <td>${p.team_name}</td>
                <td>${p[key]}</td>
            </tr>
        `;
    });
}

// Tabs 切換
function setupStatsTabs() {
    const tabs = document.querySelectorAll(".stats-tab");
    const panels = document.querySelectorAll(".stats-panel");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const target = tab.dataset.target;

            tabs.forEach(t => t.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));

            tab.classList.add("active");
            document.getElementById(`panel-${target}`).classList.add("active");
        });
    });
}

document.addEventListener("DOMContentLoaded", loadStats);