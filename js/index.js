document.addEventListener('DOMContentLoaded', function() {
  //
  // 1) NAV TOGGLE & DROPDOWNS
  //
  const navToggle = document.querySelector('.nav-toggle');
  const nav       = document.querySelector('nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => nav.classList.toggle('open'));
    document.querySelectorAll('.dropdown-toggle').forEach(dd => {
      dd.addEventListener('click', () => {
        const menu = dd.nextElementSibling;
        if (menu) menu.classList.toggle('open');
      });
    });
  }

  //
  // 2) SCHOOL-CARD FILTERS
  //
  let selectedLevel = null;
  let selectedType  = null;
  const levelButtons = document.querySelectorAll('.filter-buttons button');
  const typeButtons  = document.querySelectorAll('.subfilter-buttons button');
  const kaarten      = document.querySelectorAll('.card');

  function updateFilters() {
    kaarten.forEach(kaart => {
      const matchLevel = selectedLevel ? kaart.classList.contains(selectedLevel) : true;
      const matchType  = selectedType  ? kaart.classList.contains(selectedType)  : true;
      kaart.style.display = (matchLevel && matchType) ? 'block' : 'none';
    });
  }

  function setActive(buttons, selected) {
    buttons.forEach(btn => btn.classList.remove('active'));
    selected.classList.add('active');
  }

  levelButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedLevel = btn.className;
      setActive(levelButtons, btn);
      updateFilters();
    });
  });

  typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedType = btn.className;
      setActive(typeButtons, btn);
      updateFilters();
    });
  });

  //
  // 3) MULTI-STEP FORM (if present)
  //
  const cfForm    = document.getElementById('cf-form');
  if (cfForm) {
    let cfCurrent = 1;
    const cfTotal   = 3;
    const cfPrev    = cfForm.querySelector('.cf-prev-btn');
    const cfNext    = cfForm.querySelector('.cf-next-btn');
    const cfSteps   = document.querySelectorAll('.cf-form-step');
    const cfCircles = document.querySelectorAll('.cf-step');

    function cfUpdate() {
      cfCircles.forEach(circle => {
        circle.classList.toggle('active', Number(circle.dataset.step) === cfCurrent);
      });
      cfSteps.forEach(step => {
        step.classList.toggle('active', Number(step.dataset.step) === cfCurrent);
      });
      cfPrev.disabled    = cfCurrent === 1;
      cfNext.textContent = (cfCurrent === cfTotal) ? 'Verzenden' : 'Volgende';
    }

    function cfChangeStep(dir) {
      if (cfCurrent === cfTotal && dir === 1) {
        cfForm.submit();
        return;
      }
      cfCurrent = Math.max(1, Math.min(cfTotal, cfCurrent + dir));
      cfUpdate();
    }

    cfPrev.addEventListener('click', () => cfChangeStep(-1));
    cfNext.addEventListener('click', () => cfChangeStep(1));
    cfUpdate();
  }

  //
  // 4) PROVINCE-SEARCH MODAL + GLOBAL SEARCH (shared fetch)
  //
  let schools = [];

  fetch('../js/api.json')
    .then(res => res.json())
    .then(data => {
      schools = data.items || [];
      attachProvinceModalHandlers();
      initGlobalSearch();
    })
    .catch(err => console.error('Failed to load schools:', err));

  // — Province modal handlers
  const provinceModal = document.getElementById('provinceModal');
  const modalTitle    = document.getElementById('modalTitle');
  const modalBody     = document.getElementById('modalBody');
  const spanClose     = provinceModal && provinceModal.querySelector('.close');

  function attachProvinceModalHandlers() {
    document.querySelectorAll('.kaartpopup').forEach(div => {
      div.addEventListener('click', () => openProvinceModal(div));
    });
    if (spanClose) {
      spanClose.addEventListener('click', () => provinceModal.style.display = 'none');
      window.addEventListener('click', e => {
        if (e.target === provinceModal) provinceModal.style.display = 'none';
      });
    }
  }

  function openProvinceModal(div) {
    const name  = div.dataset.provincienaam;
    const count = div.querySelector('h2').innerText;
    const inProv = schools.filter(s => s.province === name);
    const options = inProv.map(s => `<option value="${s.name}">`).join('');

    modalTitle.innerText = `${name} (${count} scholen)`;
    modalBody.innerHTML = `
      <div class="search-bar">
        <input 
          type="text"
          id="modalSearch"
          list="modalDatalist"
          placeholder="Zoek op scholen in ${name}…"
        >
        <datalist id="modalDatalist">${options}</datalist>
      </div>
      <div id="searchResult" style="margin-top:1rem;"></div>
    `;

    const input  = document.getElementById('modalSearch');
    const result = document.getElementById('searchResult');
    input.addEventListener('input', () => {
      const val    = input.value;
      const school = inProv.find(s => s.name === val);
      result.innerHTML = school
        ? `<h3>${school.name}</h3>
           <p>${school.address}</p>
           <p>${school.num_students} leerlingen</p>`
        : '';
    });

    provinceModal.style.display = 'block';
  }

  // — Global search bar (outside modal)
  function initGlobalSearch() {
    const input      = document.getElementById('globalSearch');
    const datalist   = document.getElementById('schoolDatalist');
    const resultsDiv = document.getElementById('globalResults');
    if (!input) return;

    function updateOptions(list) {
      datalist.innerHTML = list.map(s => `<option value="${s.name}">`).join('');
    }

    function renderResults(list) {
      if (!list.length) {
        resultsDiv.innerHTML = '<p>Geen resultaten gevonden.</p>';
        return;
      }
      resultsDiv.innerHTML = list.map(s => `
        <div class="school-card">
          <h3>${s.name}</h3>
          <p>${s.city}</p>
        </div>
      `).join('');
    }

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        datalist.innerHTML = '';
        resultsDiv.innerHTML = '';
        return;
      }
      const matches = schools.filter(s => s.name.toLowerCase().includes(q));
      updateOptions(matches);
      renderResults(matches);
    });

    input.addEventListener('change', () => {
      const exact = schools.find(s => s.name.toLowerCase() === input.value.trim().toLowerCase());
      if (exact) renderResults([ exact ]);
    });
  }

  //
  // 5) READ-MORE MODAL #1
  //
  const readModal1   = document.getElementById('readMoreModal');
  const openReadBtn1 = document.getElementById('openReadMoreBtn');
  if (readModal1 && openReadBtn1) {
    const close1 = readModal1.querySelector('.close2');
    openReadBtn1.addEventListener('click', () => readModal1.style.display = 'block');
    close1.addEventListener('click', () => readModal1.style.display = 'none');
    window.addEventListener('click', e => { if (e.target === readModal1) readModal1.style.display = 'none'; });
  }

  //
  // 6) READ-MORE MODAL #2
  //
  const readModal2   = document.getElementById('readMoreModal2');
  const openReadBtn2 = document.getElementById('openReadMoreBtn2');
  if (readModal2 && openReadBtn2) {
    const close2 = readModal2.querySelector('.close3');
    openReadBtn2.addEventListener('click', () => readModal2.style.display = 'block');
    close2.addEventListener('click', () => readModal2.style.display = 'none');
    window.addEventListener('click', e => { if (e.target === readModal2) readModal2.style.display = 'none'; });
  }

  //
  // 7) ACTIVITEITEN MODALS (A–H)
  //
  function wireActModal(btnId, modalId, closeClass) {
    const btn   = document.getElementById(btnId);
    const modal = document.getElementById(modalId);
    const close = modal && modal.querySelector(closeClass);
    if (btn && modal && close) {
      btn.addEventListener('click',  () => modal.style.display = 'block');
      close.addEventListener('click', () => modal.style.display = 'none');
      window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
    }
  }

  ['A','B','C','D','E','F','G','H'].forEach(letter => {
    wireActModal(`openNieuwsBtn${letter}`, `nieuwsModal${letter}`, `.close${letter}`);
  });

});
