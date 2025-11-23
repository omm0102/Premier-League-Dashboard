async function loadStandings() {
  // 讀取積分榜資料
  const res = await fetch("./JSON/standings.json");
  const standings = await res.json();

  // 依排名排序（由小到大 → 第 1 名在最前面）
  standings.sort(
    (a, b) => Number(a.overall_league_position) - Number(b.overall_league_position)
  );

  const tbody = document.getElementById("standings-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  // 建立表格列
  standings.forEach(team => {
    const tr = document.createElement("tr");

    // 基本資料轉為數字
    const pos    = Number(team.overall_league_position);
    const name   = team.team_name;
    const played = Number(team.overall_league_payed);
    const win    = Number(team.overall_league_W);
    const draw   = Number(team.overall_league_D);
    const loss   = Number(team.overall_league_L);
    const pts    = Number(team.overall_league_PTS);

    // 拿隊徽資料（來自 getTeamMeta）
    const meta = typeof getTeamMeta === "function" ? getTeamMeta(name) : null;

    tr.innerHTML = `
      <td class="col-rank">${pos}</td>
      <td class="col-club">
        <div class="club-cell">
          ${meta ? `<img src="${meta.crest}" alt="${name}" class="club-crest">` : ""}
          <span class="club-name">${name}</span>
        </div>
      </td>
      <td>${played}</td>
      <td>${win}</td>
      <td>${draw}</td>
      <td>${loss}</td>
      <td class="col-pts">${pts}</td>
    `;

    tbody.appendChild(tr);
  });
}

// 頁面載入完成 → 顯示積分榜
document.addEventListener("DOMContentLoaded", () => {
  loadStandings().catch(err => console.error("載入戰績失敗：", err));
});
