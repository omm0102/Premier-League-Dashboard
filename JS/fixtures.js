let allFixtures = [];

async function loadFixturesSection() {
  // 讀本地 fixtures.json
  const res = await fetch("./JSON/fixtures.json");
  allFixtures = await res.json();

  // 填「球隊」下拉選單
  populateTeamFilter();

  // 一開始顯示全部賽程（可以只顯示未來或全部，看你需求）
  renderFixtures(allFixtures);

  // 綁定篩選事件
  setupFixturesFilters();
}

function populateTeamFilter() {
  const teamSelect = document.getElementById("filter-team");
  if (!teamSelect) return;

  // 從 fixtures 裡取出有出現過的球隊名稱
  const teamSet = new Set();
  allFixtures.forEach(m => {
    teamSet.add(m.match_hometeam_name);
    teamSet.add(m.match_awayteam_name);
  });

  const teams = Array.from(teamSet).sort();

  teams.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    teamSelect.appendChild(option);
  });
}

function setupFixturesFilters() {
  const dateInput   = document.getElementById("filter-date");
  const teamSelect  = document.getElementById("filter-team");
  const resetBtn    = document.getElementById("filter-reset");

  function applyFilter() {
    const dateValue = dateInput.value;        // "2024-08-16" 這種格式
    const teamValue = teamSelect.value;       // 球隊名稱或空字串

    let filtered = allFixtures;

    // 依日期篩選
    if (dateValue) {
      filtered = filtered.filter(m => m.match_date === dateValue);
    }

    // 依球隊篩選（主客隊任一方符合）
    if (teamValue) {
      filtered = filtered.filter(m =>
        m.match_hometeam_name === teamValue ||
        m.match_awayteam_name === teamValue
      );
    }

    renderFixtures(filtered);
  }

  dateInput.addEventListener("change", applyFilter);
  teamSelect.addEventListener("change", applyFilter);

  resetBtn.addEventListener("click", () => {
    dateInput.value = "";
    teamSelect.value = "";
    renderFixtures(allFixtures);
  });
}

function renderFixtures(fixtures) {
  const list = document.getElementById("fixtures-list");
  if (!list) return;

  list.innerHTML = "";

  if (!fixtures.length) {
    list.innerHTML = `<p class="no-fixtures">目前沒有符合條件的比賽</p>`;
    return;
  }

  fixtures.forEach(match => {
    const card = document.createElement("div");
    card.className = "fixture-card";

    const homeTeam = match.match_hometeam_name;
    const awayTeam = match.match_awayteam_name;
    const homeMeta = getTeamMeta(homeTeam);
    const awayMeta = getTeamMeta(awayTeam);

    const status = match.match_status; // "Finished", "Not Started", etc.
    let centerText = "";

    if (status === "Finished") {
      centerText = `${match.match_hometeam_score} : ${match.match_awayteam_score}`;
    } else {
      centerText = match.match_time;
    }

    card.innerHTML = `
      <div class="fixture-date-time">
        <span class="fixture-date">${match.match_date}</span>
        <span class="fixture-round">Matchday ${match.match_round || ""}</span>
      </div>
      <div class="fixture-main">
        <div class="fixture-team">
          ${homeMeta ? `<img src="${homeMeta.crest}" alt="${homeTeam}" class="fixture-team-crest">` : ""}
          <span class="fixture-team-name">${homeTeam}</span>
        </div>
        <div class="fixture-center">
          <span class="fixture-score">${centerText}</span>
          <span class="fixture-status">${status}</span>
        </div>
        <div class="fixture-team-away">
          <span class="fixture-team-name">${awayTeam}</span>
          ${awayMeta ? `<img src="${awayMeta.crest}" alt="${awayTeam}" class="fixture-team-crest">` : ""}
        </div>
      </div>
    `;

    list.appendChild(card);
  });
}

// 頁面載入完成就把賽程載進來
document.addEventListener("DOMContentLoaded", () => {
  loadFixturesSection().catch(err => console.error("載入賽程失敗：", err));
});
