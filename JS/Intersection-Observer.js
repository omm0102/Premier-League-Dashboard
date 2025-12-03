// 1. 取得所有有 id 的 section（用來追蹤目前在畫面中的區塊）
const sections = document.querySelectorAll("section[id]");

// 2. 導覽列按鈕（.nav-item）
const navItems = document.querySelectorAll(".nav-item");

// 3. 建立 sectionID -> navItem 的對照表（用 ID 找到對應的按鈕）
const navMap = {};
navItems.forEach(item => {
  const targetId = item.dataset.target; // HTML 上 data-target
  if (targetId) {
    navMap[targetId] = item;
  }
});

// 4. 建立 IntersectionObserver：用來偵測 section 是否進入視窗
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;      // 當前進入視窗的區塊 ID
        const activeNav = navMap[id];    // 取得對應的導覽按鈕
        if (!activeNav) return;

        // 清除所有 active 樣式
        navItems.forEach(item => item.classList.remove("active"));

        // 目前區塊的按鈕加上 active
        activeNav.classList.add("active");
      }
    });
  },
  {
    threshold: 0.2 // 區塊 20% 出現在視窗內時觸發
  }
);

// 5. 讓 observer 監聽每個 section
sections.forEach(sec => observer.observe(sec));

// 6. 預設讓 overview 按鈕亮起（畫面載入時更自然）
const defaultNav = navMap["overview"];
if (defaultNav) {
  defaultNav.classList.add("active");
}


// -------------------
// 元素淡入效果 Observer
// -------------------

// 取得所有需要 reveal 效果的元素
const revealEls = document.querySelectorAll(".reveal");

// 建立 observer：當元素進入畫面就加 show（淡入）
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");   // 進入 → 顯示動畫
      } else {
        entry.target.classList.remove("show"); // 離開 → 拿掉動畫
      }
    });
  },
  {
    threshold: 0.2, // 只要 20% 進入就觸發（比上面的寬鬆）
  }
);

// 監聽所有 .reveal 元素
revealEls.forEach(el => revealObserver.observe(el));
