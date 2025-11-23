let allFixtures = [];

async function loadFixturesSection() {
  // 從本地讀取 fixtures.json（全部賽程資料）
  const res = await fetch("./JSON/fixtures.json");
  allFixtures = await res.json();

  // 填入球隊下拉選單
  populateTeamFilter();

  // 預設顯示全部賽程
  renderFixtures(allFixtures);

  // 綁定「日期 / 球隊」篩選事件
  setupFixturesFilters();
}

function populateTeamFilter() {
  const teamSelect = document.getElementById("filter-team");
  if (!teamSelect) return;

  // 以 Set 收集出現過的所有球隊（避免重複）
  const teamSet = new Set();
  allFixtures.forEach(m => {
    teamSet.add(m.match_hometeam_name);
    teamSet.add(m.match_awayteam_name);
  });

  const teams = Array.from(teamSet).sort();

  // 將球隊名稱加入 <select>
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
    const dateValue = dateInput.value;  // 篩選日期（YYYY-MM-DD）
    const teamValue = teamSelect.value; // 篩選球隊名稱

    let filtered = allFixtures;

    // 依日期篩選
    if (dateValue) {
      filtered = filtered.filter(m => m.match_date === dateValue);
    }

    // 依球隊篩選（主隊或客隊符合即可）
    if (teamValue) {
      filtered = filtered.filter(m =>
        m.match_hometeam_name === teamValue ||
        m.match_awayteam_name === teamValue
      );
    }

    renderFixtures(filtered);
  }

  // 當日期或球隊選擇改變 → 重新篩選
  dateInput.addEventListener("change", applyFilter);
  teamSelect.addEventListener("change", applyFilter);

  // 清除篩選條件
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

  // 無資料時顯示提示文字
  if (!fixtures.length) {
    list.innerHTML = `<p class="no-fixtures">目前沒有符合條件的比賽</p>`;
    return;
  }

  fixtures.forEach(match => {
    const card = document.createElement("div");
    card.className = "fixture-card";

    // 主隊 / 客隊資訊
    const homeTeam = match.match_hometeam_name;
    const awayTeam = match.match_awayteam_name;

    // 透過 getTeamMeta 取得隊徽等資料（來自 data-teams.js）
    const homeMeta = getTeamMeta(homeTeam);
    const awayMeta = getTeamMeta(awayTeam);

    // 判斷比賽狀態：已結束就顯示分數，否則顯示比賽時間
    const status = match.match_status;
    let centerText = "";

    if (status === "Finished") {
      centerText = `${match.match_hometeam_score} : ${match.match_awayteam_score}`;
    } else {
      centerText = match.match_time;
    }

    // 建立一張賽事卡片
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

// 頁面載入後立即載入賽程資料
document.addEventListener("DOMContentLoaded", () => {
  loadFixturesSection().catch(err => console.error("載入賽程失敗：", err));
});
