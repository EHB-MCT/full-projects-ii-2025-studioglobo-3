document.addEventListener('DOMContentLoaded', function() {
  //
  // 1) NAV TOGGLE & DROPDOWNS
  //
  var navToggle = document.querySelector('.nav-toggle');
  var nav       = document.querySelector('nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function() {
      nav.classList.toggle('open');
    });

    var ddToggles = document.querySelectorAll('.dropdown-toggle');
    for (var i = 0; i < ddToggles.length; i++) {
      ddToggles[i].addEventListener('click', function() {
        var menu = this.nextElementSibling;
        if (menu) {
          menu.classList.toggle('open');
        }
      });
    }
  }

  //
  // 2) SCHOOL‐CARD FILTERS
  //
  var selectedLevel = null;
  var selectedType  = null;
  var levelButtons  = document.querySelectorAll('.filter-buttons button');
  var typeButtons   = document.querySelectorAll('.subfilter-buttons button');
  var kaarten       = document.querySelectorAll('.card');

  function updateFilters() {
    for (var k = 0; k < kaarten.length; k++) {
      var kaart      = kaarten[k];
      var matchLevel = selectedLevel ? kaart.classList.contains(selectedLevel) : true;
      var matchType  = selectedType  ? kaart.classList.contains(selectedType)  : true;
      kaart.style.display = (matchLevel && matchType) ? 'block' : 'none';
    }
  }

  function setActive(buttons, selected) {
    for (var m = 0; m < buttons.length; m++) {
      buttons[m].classList.remove('active');
    }
    selected.classList.add('active');
  }

  for (var i = 0; i < levelButtons.length; i++) {
    (function(btn) {
      btn.addEventListener('click', function() {
        selectedLevel = this.className;
        setActive(levelButtons, this);
        updateFilters();
      });
    })(levelButtons[i]);
  }

  for (var j = 0; j < typeButtons.length; j++) {
    (function(btn) {
      btn.addEventListener('click', function() {
        selectedType = this.className;
        setActive(typeButtons, this);
        updateFilters();
      });
    })(typeButtons[j]);
  }

  //
  // 3) MULTI‐STEP FORM (only if #cf-form exists)
  //
  var cfForm = document.getElementById('cf-form');
  if (cfForm) {
    var cfCurrent = 1;
    var cfTotal   = 3;
    var cfPrev    = cfForm.querySelector('.cf-prev-btn');
    var cfNext    = cfForm.querySelector('.cf-next-btn');
    var cfSteps   = document.querySelectorAll('.cf-form-step');
    var cfCircles = document.querySelectorAll('.cf-step');

    function cfUpdate() {
      for (var x = 0; x < cfCircles.length; x++) {
        var circle = cfCircles[x];
        circle.classList.toggle('active', Number(circle.dataset.step) === cfCurrent);
      }
      for (var y = 0; y < cfSteps.length; y++) {
        var step = cfSteps[y];
        step.classList.toggle('active', Number(step.dataset.step) === cfCurrent);
      }
      cfPrev.disabled    = (cfCurrent === 1);
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

    cfPrev.addEventListener('click', function() { cfChangeStep(-1); });
    cfNext.addEventListener('click', function() { cfChangeStep(1); });
    cfUpdate();
  }

  //
  // 4) PROVINCE‐SEARCH MODAL
  //
  var provinceModal = document.getElementById('provinceModal');
  if (provinceModal) {
    var modalTitle = document.getElementById('modalTitle');
    var modalBody  = document.getElementById('modalBody');
    var spanClose  = provinceModal.querySelector('.close');
    var schools    = [];

    fetch('../js/api.json')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        schools = data.items || [];
        var pops = document.querySelectorAll('.kaartpopup');
        for (var i = 0; i < pops.length; i++) {
          (function(div) {
            div.addEventListener('click', function() {
              openProvinceModal(div);
            });
          })(pops[i]);
        }
      })
      .catch(function(err) {
        console.error('Failed to load schools:', err);
      });

    function openProvinceModal(div) {
      var name  = div.dataset.provincienaam;
      var count = div.querySelector('h2').innerText;
      var inProv = [];
      for (var i = 0; i < schools.length; i++) {
        if (schools[i].province === name) {
          inProv.push(schools[i]);
        }
      }

      var options = '';
      for (var i = 0; i < inProv.length; i++) {
        options += '<option value="' + inProv[i].name + '">';
      }

      modalTitle.innerText = name + ' (' + count + ' scholen)';
      modalBody.innerHTML  =
        '<div class="search-bar">' +
          '<input type="text" id="modalSearch" list="modalDatalist" ' +
                  'placeholder="Zoek op scholen in ' + name + '…">' +
          '<datalist id="modalDatalist">' + options + '</datalist>' +
        '</div>' +
        '<div id="searchResult" style="margin-top:1rem;"></div>';

      var input  = document.getElementById('modalSearch');
      var result = document.getElementById('searchResult');
      input.addEventListener('input', function() {
        var val = this.value, found = null;
        for (var i = 0; i < inProv.length; i++) {
          if (inProv[i].name === val) {
            found = inProv[i];
            break;
          }
        }
        if (!found) {
          result.innerHTML = '';
        } else {
          result.innerHTML =
            '<h3>' + found.name + '</h3>' +
            '<p>' + found.address + '</p>' +
            '<p>' + found.num_students + ' leerlingen</p>';
        }
      });

      provinceModal.style.display = 'block';
    }

    spanClose.addEventListener('click', function() {
      provinceModal.style.display = 'none';
    });
    window.addEventListener('click', function(e) {
      if (e.target === provinceModal) {
        provinceModal.style.display = 'none';
      }
    });
  }

  //
  // 5) READ‐MORE MODAL #1
  //
  var readModal = document.getElementById('readMoreModal');
  if (readModal) {
    var openReadBtn = document.getElementById('openReadMoreBtn');
    var closeRead   = readModal.querySelector('.close2');

    openReadBtn.addEventListener('click', function() {
      readModal.style.display = 'block';
    });
    closeRead.addEventListener('click', function() {
      readModal.style.display = 'none';
    });
    window.addEventListener('click', function(e) {
      if (e.target === readModal) {
        readModal.style.display = 'none';
      }
    });
  }

  //
  // 6) READ‐MORE MODAL #2
  //
  var readModal2 = document.getElementById('readMoreModal2');
  if (readModal2) {
    var openReadBtn2 = document.getElementById('openReadMoreBtn2');
    var closeRead2   = readModal2.querySelector('.close3');

    openReadBtn2.addEventListener('click', function() {
      readModal2.style.display = 'block';
    });
    closeRead2.addEventListener('click', function() {
      readModal2.style.display = 'none';
    });
    window.addEventListener('click', function(e) {
      if (e.target === readModal2) {
        readModal2.style.display = 'none';
      }
    });
  }

  //
  // 7) ACTIVITEITEN MODALS (A–H)
  //
  function wireActModal(btnId, modalId, closeClass) {
    var btn   = document.getElementById(btnId);
    var modal = document.getElementById(modalId);
    var close = modal && modal.querySelector(closeClass);
    if (btn && modal && close) {
      btn.addEventListener('click', function() {
        modal.style.display = 'block';
      });
      close.addEventListener('click', function() {
        modal.style.display = 'none';
      });
      window.addEventListener('click', function(e) {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    }
  }

  wireActModal('openNieuwsBtnA','nieuwsModalA','.closeA');
  wireActModal('openNieuwsBtnB','nieuwsModalB','.closeB');
  wireActModal('openNieuwsBtnC','nieuwsModalC','.closeC');
  wireActModal('openNieuwsBtnD','nieuwsModalD','.closeD');
  wireActModal('openNieuwsBtnE','nieuwsModalE','.closeE');
  wireActModal('openNieuwsBtnF','nieuwsModalF','.closeF');
  wireActModal('openNieuwsBtnG','nieuwsModalG','.closeG');
  wireActModal('openNieuwsBtnH','nieuwsModalH','.closeH');
});
