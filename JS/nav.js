const menu = document.querySelector('.menu-icon');
const navPanel = document.querySelector('.nav-panel');

menu.addEventListener('click', () => {
  navPanel.classList.toggle('active');
});