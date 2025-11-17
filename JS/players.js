let allPlayers = [];
let filteredPlayers = [];

async function loadPlayers() {
  const resPlayers = await fetch("./JSON/players.json");
  allPlayers = await resPlayers.json();
  filteredPlayers = allPlayers;

  loadTeamFilter();
  renderPlayers(allPlayers);
  setupModal();
  setupSearch();
  setupTeamFilter();
}

function loadTeamFilter() {
  const teamSelect = document.getElementById("player-team-filter");

  const teams = [...new Set(allPlayers.map((p) => p.team_name))];

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

  players.forEach((p) => {
    const card = document.createElement("div");
    card.className = "player-card";

    const imgSrc = p.player_image && p.player_image.trim()
      ? p.player_image
      : "./img/default-player.png"; // ⭐ 沒圖就用預設頭像

    card.innerHTML = `
      <img src="${imgSrc}" alt="${p.player_name}">
      <div class="player-card-name">${p.player_name}</div>
      <div class="player-card-team">${p.team_name}</div>
    `;

    card.onclick = () => openPlayerModal(p);

    grid.appendChild(card);
  });
}
/* 搜尋功能 */
function setupSearch() {
  const search = document.getElementById("player-search");

  search.addEventListener("input", (e) => {
    const key = e.target.value.toLowerCase();

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

  const imgSrc = p.player_image && p.player_image.trim()
    ? p.player_image
    : "./img/default-player.png";

  document.getElementById("player-modal-img").src = imgSrc;
  document.getElementById("player-modal-name").textContent =
    p.player_name || "未知球員";
  document.getElementById("player-modal-team").textContent =
    p.team_name || "Unknown Team";

  document.getElementById("player-modal-position").textContent =
    `位置：${p.player_type || "N/A"}`;

  const goals  = Number(p.player_goals || 0);
  const assists = Number(p.player_assists || 0);
  const yellow  = Number(p.player_yellow_cards || 0);
  const red     = Number(p.player_red_cards || 0);

  document.getElementById("player-modal-stats").textContent =
    `進球：${goals} · 助攻：${assists} · 黃牌：${yellow} · 紅牌：${red}`;
}

document.addEventListener("DOMContentLoaded", loadPlayers);
