// 1. Selecteer de button
const navToggle = document.querySelector('.nav-toggle');
// 2. Selecteer de nav-list
const nav = document.querySelector('nav');

// 3. Wacht tot de button bestaat (optioneel als script onderaan staat)
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  
  // dropdown op mobile
  document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.nextElementSibling.classList.toggle('open');
    });
  });
}
