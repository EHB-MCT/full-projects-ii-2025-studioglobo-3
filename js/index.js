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
const kaarten = document.querySelectorAll(".card");

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
let cfCurrent = 1;
const cfTotal = 3;
const cfForm = document.getElementById('cf-form');
const cfPrev = cfForm.querySelector('.cf-prev-btn');
const cfNext = cfForm.querySelector('.cf-next-btn');
const cfSteps = [...document.querySelectorAll('.cf-form-step')];
const cfCircles = [...document.querySelectorAll('.cf-step')];

function cfUpdate() {
  cfCircles.forEach(c => {
    c.classList.toggle('active', +c.dataset.step === cfCurrent);
  });
  cfSteps.forEach(f => {
    f.classList.toggle('active', +f.dataset.step === cfCurrent);
  });
  cfPrev.disabled = cfCurrent === 1;
  cfNext.textContent = cfCurrent === cfTotal ? 'Verzenden' : 'Volgende';
}

function cfChangeStep(dir) {
  if (cfCurrent === cfTotal && dir === 1) {
    cfForm.submit();
    return;
  }
  cfCurrent = Math.max(1, Math.min(cfTotal, cfCurrent + dir));
  cfUpdate();
}

cfUpdate();



// API

document.addEventListener('DOMContentLoaded', () => {
  // 1) grab modal elements
  const modal      = document.getElementById('provinceModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody  = document.getElementById('modalBody');
  const spanClose  = modal.querySelector('.close');

  // 2) fetch your schools API
  let schools = [];
  fetch('../js/api.json')
    .then(r => r.json())
    .then(data => {
      schools = data.items || [];

      // 3) only after schools are loaded, attach click‐handlers
      document.querySelectorAll('.kaartpopup').forEach(div => {
        div.addEventListener('click', () => openProvinceModal(div));
      });
    })
    .catch(err => console.error('Failed to load schools:', err));

  // 4) function to build & show the modal for one province
  function openProvinceModal(div) {
    const name  = div.dataset.provincienaam;
    const count = div.querySelector('h2').innerText;

    // filter schools in this province
    const inProv = schools.filter(s => s.province === name);

    // build datalist options
    const options = inProv
      .map(s => `<option value="${s.name}">`)
      .join('');

    // inject the search-bar + result container
    modalTitle.innerText = `${name} (${count} scholen)`;
    modalBody.innerHTML = `
      <div class="search-bar">
        <input 
          type="text"
          id="modalSearch"
          list="modalDatalist"
          placeholder="Zoek op scholen in ${name}…"
        >
        <datalist id="modalDatalist">
          ${options}
        </datalist>
      </div>
      <div id="searchResult" style="margin-top:1rem;"></div>
    `;

    // hook up the input → result
    const input  = document.getElementById('modalSearch');
    const result = document.getElementById('searchResult');
    input.addEventListener('input', () => {
      const val    = input.value;
      const school = inProv.find(s => s.name === val);
      if (!school) {
        result.innerHTML = '';
        return;
      }
      result.innerHTML = `
        <h3>${school.name}</h3>
        <p>${school.address}</p>
        <p>${school.num_students} leerlingen</p>
      `;
    });

    // show modal
    modal.style.display = 'block';
  }

  // 5) close‐modal handlers
  spanClose.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });
});