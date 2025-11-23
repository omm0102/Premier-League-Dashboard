let allPlayers = [];
let filteredPlayers = [];

async function loadPlayers() {
  // 讀取所有球員資料
  const resPlayers = await fetch("./JSON/players.json");
  allPlayers = await resPlayers.json();
  filteredPlayers = allPlayers;

  // 初始化：球隊選單 / 球員清單 / Modal / 搜尋 / 篩選
  loadTeamFilter();
  renderPlayers(allPlayers);
  setupModal();
  setupSearch();
  setupTeamFilter();
}

function loadTeamFilter() {
  const teamSelect = document.getElementById("player-team-filter");

  // 用 Set 取球隊名稱（避免重複）
  const teams = [...new Set(allPlayers.map((p) => p.team_name))];

  // 加入選單
  teams.sort().forEach((t) => {
    const op = document.createElement("option");
    op.value = t;
    op.textContent = t;
    teamSelect.appendChild(op);
  });
}

function renderPlayers(players) {
  const grid = document.getElementById("players-grid");
  grid.innerHTML = "";

  // 依序建立每張球員卡
  players.forEach((p) => {
    const card = document.createElement("div");
    card.className = "player-card";

    // 有球員照片用照片，沒有就用預設圖片
    const imgSrc = p.player_image && p.player_image.trim()
      ? p.player_image
      : "./img/default-player.png";

    card.innerHTML = `
      <img src="${imgSrc}" alt="${p.player_name}">
      <div class="player-card-name">${p.player_name}</div>
      <div class="player-card-team">${p.team_name}</div>
    `;

    // 點擊卡片 → 開啟詳細資訊 Modal
    card.onclick = () => openPlayerModal(p);

    grid.appendChild(card);
  });
}

/* 搜尋功能 */
function setupSearch() {
  const search = document.getElementById("player-search");

  search.addEventListener("input", (e) => {
    const key = e.target.value.toLowerCase();

    // 依名字搜尋
    filteredPlayers = allPlayers.filter((p) =>
      p.player_name.toLowerCase().includes(key)
    );

    renderPlayers(filteredPlayers);
  });
}

/* 球隊篩選 */
function setupTeamFilter() {
  const filter = document.getElementById("player-team-filter");

  filter.addEventListener("change", (e) => {
    const team = e.target.value;

    // 若選特定球隊 → 只顯示該隊球員
    filteredPlayers = team
      ? allPlayers.filter((p) => p.team_name === team)
      : allPlayers;

    renderPlayers(filteredPlayers);
  });
}

/* Modal 開關 */
function setupModal() {
  const modal = document.getElementById("player-modal");
  document.getElementById("player-modal-backdrop").onclick = closePlayerModal;
  document.getElementById("player-modal-close").onclick = closePlayerModal;

  function closePlayerModal() {
    modal.classList.remove("show");
  }
}

function openPlayerModal(p) {
  const modal = document.getElementById("player-modal");
  modal.classList.add("show");

  // 顯示球員照片
  const imgSrc = p.player_image && p.player_image.trim()
    ? p.player_image
    : "./img/default-player.png";

  document.getElementById("player-modal-img").src = imgSrc;

  // 基本資料
  document.getElementById("player-modal-name").textContent =
    p.player_name || "未知球員";
  document.getElementById("player-modal-team").textContent =
    p.team_name || "Unknown Team";

  document.getElementById("player-modal-position").textContent =
    `位置：${p.player_type || "N/A"}`;

  // 統計資料（進球、助攻、牌數）
  const goals  = Number(p.player_goals || 0);
  const assists = Number(p.player_assists || 0);
  const yellow  = Number(p.player_yellow_cards || 0);
  const red     = Number(p.player_red_cards || 0);

  document.getElementById("player-modal-stats").textContent =
    `進球：${goals} · 助攻：${assists} · 黃牌：${yellow} · 紅牌：${red}`;
}

// 頁面載入 → 執行載入流程
document.addEventListener("DOMContentLoaded", loadPlayers);
