async function loadOverviewHighlight() {


  // 讀本地 JSON
  const [standings, fixtures] = await Promise.all([
    fetch("./JSON/standings.json").then(res => res.json()),
    fetch("./JSON/fixtures.json").then(res => res.json()),
  ]);

  // ===== 1. 排名前三球隊 =====
  const sorted = [...standings].sort(
    (a, b) => Number(a.overall_league_position) - Number(b.overall_league_position)
  );
  const topTeams = sorted.slice(0, 3);

  const topTeamsList = document.getElementById("highlight-top-teams");
  topTeamsList.innerHTML = "";

  topTeams.forEach(team => {
    const meta = getTeamMeta(team.team_name);
    const li = document.createElement("li");
    li.className = "highlight-team-item";
    li.innerHTML = `
      <div class="highlight-team">
        ${meta ? `<img src="${meta.crest}" alt="${team.team_name} crest" class="highlight-team-crest">` : ""}
        <div class="highlight-team-text">
          <span class="highlight-team-name">
            ${team.overall_league_position}. ${team.team_name}
          </span>
          <span class="highlight-team-pts">
            ${team.overall_league_PTS} 分 · 進球數： ${team.overall_league_GF} 失球數： ${team.overall_league_GA}
          </span>
        </div>
      </div>
    `;
    topTeamsList.appendChild(li);
  });

  // ===== 2. 射手榜前三名 =====
  const goalsMap = {};
  const playerTeamMap = {};

  fixtures.forEach(match => {
    const homeTeam = match.match_hometeam_name;
    const awayTeam = match.match_awayteam_name;

    (match.goalscorer || []).forEach(g => {
      if (g.home_scorer) {
        const name = g.home_scorer;
        goalsMap[name] = (goalsMap[name] || 0) + 1;
        if (!playerTeamMap[name]) playerTeamMap[name] = homeTeam;
      }
      if (g.away_scorer) {
        const name = g.away_scorer;
        goalsMap[name] = (goalsMap[name] || 0) + 1;
        if (!playerTeamMap[name]) playerTeamMap[name] = awayTeam;
      }
    });
  });

  const scorersArray = Object.entries(goalsMap).map(([name, goals]) => ({
    name,
    goals,
    teamName: playerTeamMap[name] || "未知球隊",
  }));
  scorersArray.sort((a, b) => b.goals - a.goals);
  const topScorers = scorersArray.slice(0, 3);

  const scorersList = document.getElementById("highlight-top-scorers");
  scorersList.innerHTML = "";

  topScorers.forEach(p => {
    const meta = getTeamMeta(p.teamName);
    const li = document.createElement("li");
    li.className = "highlight-scorer-item";
    li.innerHTML = `
      <div class="highlight-scorer">
        ${meta ? `<img src="${meta.crest}" alt="${p.teamName} crest" class="highlight-scorer-crest">` : ""}
        <div class="highlight-scorer-text">
          <span class="highlight-scorer-name">${p.name}</span>
          <span class="highlight-scorer-detail">${p.teamName} · ${p.goals} 球</span>
        </div>
      </div>
    `;
    scorersList.appendChild(li);
  });
}

// ===== 3. 榜首 =====
async function loadKPI() {
  const standings = await fetch("./JSON/standings.json").then(r => r.json());

  // 尋找排名第一名
  const leader = standings.find(t => t.overall_league_position === "1");

  const leaderBox = document.getElementById("kpi-leader");

  if (leader) {
    leaderBox.innerHTML = `
      <img src="${getTeamMeta(leader.team_name)?.crest || ''}" 
           class="kpi-leader-crest" 
           alt="${leader.team_name}">
      <span>${leader.team_name}</span>
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadKPI();
});

// 頁面載入完成就跑
document.addEventListener("DOMContentLoaded", () => {
  loadOverviewHighlight().catch(err => {
    console.error("[overview] 載入失敗：", err);
  });
});
