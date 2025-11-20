// 1. 只抓有 id 的區塊（對應導航）
const sections = document.querySelectorAll("section[id]");

// 2. 對應的導覽列按鈕
const navItems = document.querySelectorAll(".nav-item");

// 3. 建立 sectionID => navItem 的對照表
const navMap = {};
navItems.forEach(item => {
  const targetId = item.dataset.target; // 例如 "overview"
  if (targetId) {
    navMap[targetId] = item;
  }
});

// 4. 建立 Intersection Observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id; // 例如 "overview"
        const activeNav = navMap[id];
        if (!activeNav) return; // 沒對應就跳過，避免報錯

        // 先全部移除 active
        navItems.forEach(item => item.classList.remove("active"));

        // 設定目前這一區的按鈕為 active
        activeNav.classList.add("active");
      }
    });
  },
  {
    threshold: 0.8 // 區塊有80% 進到畫面裡才算「目前區塊」
  }
);

// 5. 開始監聽每個 section
sections.forEach(sec => observer.observe(sec));

// 6. 可選：一開始就先把「總覽」設為 active（載入頁面會比較自然）
const defaultNav = navMap["overview"];
if (defaultNav) {
  defaultNav.classList.add("active");
}


const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      } else {
        entry.target.classList.remove("show");
      }
    });
  },
  {
    threshold: 0.2,
  }
);

revealEls.forEach(el => revealObserver.observe(el));