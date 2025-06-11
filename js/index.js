
console.log("hello world")

const nav = document.querySelector('nav');
navToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
});

document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    toggle.nextElementSibling.classList.toggle('open');
  });
});
