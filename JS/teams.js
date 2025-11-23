let allTeams = [];

async function loadTeamsSection() {
    try {
        // 讀取所有球隊資料
        const res = await fetch("./JSON/teams.json");
        allTeams = await res.json();

        // 顯示球隊卡片＋設定 Modal 功能
        renderTeamCards(allTeams);
        setupTeamModal();
    } catch (err) {
        console.error("載入 teams.json 失敗：", err);
    }
}

function getLocalCrest(teamName) {
    // 嘗試從 data-teams.js 找本地隊徽（若有）
    if (typeof getTeamMeta === "function") {
        const meta = getTeamMeta(teamName);
        if (meta && meta.crest) return meta.crest;
    }
    return null;
}

function renderTeamCards(teams) {
    const grid = document.getElementById("teams-grid");
    if (!grid) return;

    grid.innerHTML = "";

    teams.forEach(team => {
        const card = document.createElement("div");
        card.className = "team-card";
        card.dataset.teamKey = team.team_key;

        // 若本地有隊徽就用本地圖，否則用 API 提供的 team_badge
        const localCrest = getLocalCrest(team.team_name);
        const crestSrc = localCrest || team.team_badge;

        const venueName = team.venue?.venue_name || "Stadium N/A";
        const venueCity = team.venue?.venue_city || "";

        card.innerHTML = `
            <div class="team-card-header">
                <img src="${crestSrc}" alt="${team.team_name} crest" class="team-card-crest">
                <div>
                    <div class="team-card-name">${team.team_name}</div>
                    <div class="team-card-meta">${venueName}${venueCity ? " · " + venueCity : ""}</div>
                </div>
            </div>
            <div class="team-card-meta">
                成立：${team.team_founded || "N/A"}
            </div>
        `;

        // 點擊卡片 → 打開球隊詳細資料 Modal
        card.addEventListener("click", () => openTeamModal(team.team_key));
        grid.appendChild(card);
    });
}

function setupTeamModal() {
    const modal = document.getElementById("team-modal");
    const backdrop = document.getElementById("team-modal-backdrop");
    const closeBtn = document.getElementById("team-modal-close");

    function close() {
        modal.classList.remove("show");
    }

    // 三種關閉方法：背景、關閉鈕、ESC
    backdrop.addEventListener("click", close);
    closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") close();
    });
}

function openTeamModal(teamKey) {
    const modal = document.getElementById("team-modal");
    const crestEl = document.getElementById("team-modal-crest");
    const nameEl = document.getElementById("team-modal-name");
    const metaEl = document.getElementById("team-modal-meta");
    const venueEl = document.getElementById("team-modal-venue");
    const coachEl = document.getElementById("team-modal-coach");
    const squadListEl = document.getElementById("team-modal-squad-list");

    const team = allTeams.find(t => t.team_key === teamKey);
    if (!team) return;

    // 隊徽：優先用本地版本
    const localCrest = getLocalCrest(team.team_name);
    crestEl.src = localCrest || team.team_badge;
    crestEl.alt = team.team_name + " crest";

    nameEl.textContent = team.team_name;

    // 基本資料（國家、成立年份）
    metaEl.textContent = `國家：${team.team_country || "N/A"} · 成立：${team.team_founded || "N/A"}`;

    // 主場資料
    const venue = team.venue || {};
    venueEl.textContent = `主場：${venue.venue_name || "N/A"}（${venue.venue_city || ""}${
        venue.venue_capacity ? ` · 容納 ${venue.venue_capacity} 人` : ""
    }）`;

    // 主教練（只取第一個）
    const coach = (team.coaches && team.coaches[0]) || null;
    coachEl.textContent = coach
        ? `主教練：${coach.coach_name || "N/A"}`
        : "主教練：N/A";

    // 球員列表（簡單版：只顯示前 10 名）
    const players = Array.isArray(team.players) ? team.players.slice(0, 10) : [];
    squadListEl.innerHTML = "";
    players.forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.player_name} · ${p.player_type || ""}`;
        squadListEl.appendChild(li);
    });

    modal.classList.add("show");
}

document.addEventListener("DOMContentLoaded", () => {
    loadTeamsSection();
});
