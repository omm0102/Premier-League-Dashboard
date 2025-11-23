async function loadOverviewHighlight() {

  // 同時讀 standings.json（積分榜）與 fixtures.json（比賽資料）
  const [standings, fixtures] = await Promise.all([
    fetch("./JSON/standings.json").then(res => res.json()),
    fetch("./JSON/fixtures.json").then(res => res.json()),
  ]);

  // ===== 1. 取排名前三球隊 =====
  const sorted = [...standings].sort(
    (a, b) => Number(a.overall_league_position) - Number(b.overall_league_position)
  );
  const topTeams = sorted.slice(0, 3);

  const topTeamsList = document.getElementById("highlight-top-teams");
  topTeamsList.innerHTML = "";

  // 動態產生前三名球隊卡片
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

  // ===== 2. 射手榜前三名（從 fixtures 裡統計）=====
  const goalsMap = {};       // { 球員名: 進球數 }
  const playerTeamMap = {};  // { 球員名: 所屬球隊 }

  fixtures.forEach(match => {
    const homeTeam = match.match_hometeam_name;
    const awayTeam = match.match_awayteam_name;

    (match.goalscorer || []).forEach(g => {
      // 主隊球員進球
      if (g.home_scorer) {
        const name = g.home_scorer;
        goalsMap[name] = (goalsMap[name] || 0) + 1;
        if (!playerTeamMap[name]) playerTeamMap[name] = homeTeam;
      }
      // 客隊球員進球
      if (g.away_scorer) {
        const name = g.away_scorer;
        goalsMap[name] = (goalsMap[name] || 0) + 1;
        if (!playerTeamMap[name]) playerTeamMap[name] = awayTeam;
      }
    });
  });

  // 轉成可排序陣列
  const scorersArray = Object.entries(goalsMap).map(([name, goals]) => ({
    name,
    goals,
    teamName: playerTeamMap[name] || "未知球隊",
  }));

  scorersArray.sort((a, b) => b.goals - a.goals);
  const topScorers = scorersArray.slice(0, 3);

  // 顯示射手榜前三名
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

// ===== 3. KPI：找出積分榜第一名 =====
async function loadKPI() {
  const standings = await fetch("./JSON/standings.json").then(r => r.json());

  // 找 overall_league_position 為 "1" 的球隊
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

// 載入 KPI 區塊
document.addEventListener("DOMContentLoaded", () => {
  loadKPI();
});

// 載入 overview 區塊
document.addEventListener("DOMContentLoaded", () => {
  loadOverviewHighlight().catch(err => {
    console.error("[overview] 載入失敗：", err);
  });
});
