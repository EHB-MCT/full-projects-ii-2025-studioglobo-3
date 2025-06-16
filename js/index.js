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


//deelnemen

document.addEventListener('DOMContentLoaded', () => {
  const steps = Array.from(document.querySelectorAll('.step-circle'));
  const forms = Array.from(document.querySelectorAll('.step-form'));
  let current = 1;

  function showStep(n) {
    // highlight circles
    steps.forEach(c => c.classList.toggle('active', +c.dataset.step === n));
    // show correct form
    forms.forEach(f => f.classList.toggle('active', +f.dataset.step === n));
  }

  // init
  showStep(current);

  // click on circles
  steps.forEach(circle =>
    circle.addEventListener('click', () => {
      current = +circle.dataset.step;
      showStep(current);
    })
  );

  // next / prev buttons
  document.querySelectorAll('.next-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      if (current < forms.length) showStep(++current);
    })
  );
  document.querySelectorAll('.prev-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      if (current > 1) showStep(--current);
    })
  );
});
