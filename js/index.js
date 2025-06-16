const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  
  document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.nextElementSibling.classList.toggle('open');
    });
  });
}


let selectedLevel = null;
let selectedType = null;

const levelButtons = document.querySelectorAll(".filter-buttons button");
const typeButtons = document.querySelectorAll(".subfilter-buttons button");
const kaarten = document.querySelectorAll(".kaart");

for (var i = 0; i < levelButtons.length; i++) {
  levelButtons[i].addEventListener("click", function () {
    selectedLevel = this.className;
    setActive(levelButtons, this);
    updateFilters();
  });
}

for (var i = 0; i < typeButtons.length; i++) {
  typeButtons[i].addEventListener("click", function () {
    selectedType = this.className;
    setActive(typeButtons, this);
    updateFilters();
  });
}

function updateFilters() {
  for (var i = 0; i < kaarten.length; i++) {
    var kaart = kaarten[i];
    var matchLevel = selectedLevel ? kaart.classList.contains(selectedLevel) : true;
    var matchType = selectedType ? kaart.classList.contains(selectedType) : true;

    kaart.style.display = (matchLevel && matchType) ? "block" : "none";
  }
}

function setActive(buttons, selected) {
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }
  selected.classList.add("active");
}
