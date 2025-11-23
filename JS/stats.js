async function loadStats() {
    // 讀取所有球員資料
    const res = await fetch("./JSON/players.json");
    const players = await res.json();

    // ===== 射手榜（依進球數排序，取前 10 名）=====
    const topScorers = [...players]
        .filter(p => Number(p.player_goals) > 0)
        .sort((a, b) => Number(b.player_goals) - Number(a.player_goals))
        .slice(0, 10);

    // ===== 黃牌榜（依黃牌數排序）=====
    const topYellow = [...players]
        .filter(p => Number(p.player_yellow_cards) > 0)
        .sort((a, b) => Number(b.player_yellow_cards) - Number(a.player_yellow_cards))
        .slice(0, 10);

    // ===== 紅牌榜（依紅牌數排序）=====
    const topRed = [...players]
        .filter(p => Number(p.player_red_cards) > 0)
        .sort((a, b) => Number(b.player_red_cards) - Number(a.player_red_cards))
        .slice(0, 10);

    // 把資料渲染到三張表格
    renderStatsTable("stats-top-scorers", topScorers, "player_goals");
    renderStatsTable("stats-top-yellow", topYellow, "player_yellow_cards");
    renderStatsTable("stats-top-red", topRed, "player_red_cards");

    // 設定 tab 切換事件
    setupStatsTabs();
}

function renderStatsTable(tbodyId, list, key) {
    const tbody = document.getElementById(tbodyId);
    tbody.innerHTML = "";

    // 依序生成每一列
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

// ===== Tab 切換（射手、黃牌、紅牌）=====
function setupStatsTabs() {
    const tabs = document.querySelectorAll(".stats-tab");
    const panels = document.querySelectorAll(".stats-panel");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const target = tab.dataset.target;

            // 清除全部 active
            tabs.forEach(t => t.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));

            // 啟用被點擊的 tab 與對應 panel
            tab.classList.add("active");
            document.getElementById(`panel-${target}`).classList.add("active");
        });
    });
}

// 頁面載入 → 執行統計資料載入
document.addEventListener("DOMContentLoaded", loadStats);
