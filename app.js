document.addEventListener('DOMContentLoaded', () => {
  // --- STATE ---
  let currentTheme = localStorage.getItem('theme') || 'light';
  let isAuthenticated = false;
  const protectedViews = ['portal'];
  
  // --- MOCK DATABASE FOR PORTAL ---
  const mockBills = {
    'land': {
      '123/MERU/2024': {
        owner: 'John Kirimi M\'Marete',
        item: 'Plot No. 123/MERU/2024 (Meru Town)',
        amount: 8500,
        arrears: 1500,
        ref: 'PLT-88910',
        due: '31st March 2026'
      },
      '456/NKUBU/2023': {
        owner: 'Phyllis Kendi Mwenda',
        item: 'Plot No. 456/NKUBU/2023 (Nkubu)',
        amount: 5200,
        arrears: 0,
        ref: 'PLT-55421',
        due: '31st March 2026'
      }
    },
    'permit': {
      'SBP-2024-8890': {
        owner: 'Kaimenyi Wholesalers & Distributors',
        item: 'Single Business Permit (Retail/Wholesale)',
        amount: 14500,
        arrears: 0,
        ref: 'SBP-8890',
        due: '31st Dec 2026'
      },
      'SBP-2024-5541': {
        owner: 'Gakoromone Agro-Tech Enterprise',
        item: 'Single Business Permit (Agribusiness/Store)',
        amount: 9800,
        arrears: 2400,
        ref: 'SBP-5541',
        due: '31st Dec 2026'
      }
    },
    'parking': {
      'KCD 123A': {
        owner: 'Edwin Mutwiri (Private Saloon)',
        item: 'Daily Parking Fee - Saloon Car',
        amount: 50,
        arrears: 0,
        ref: 'PRK-123A',
        due: 'Today'
      },
      'KDA 888X': {
        owner: 'Leah Kathure (Matatu 14-Seater)',
        item: 'Daily Parking Fee - Matatu 14-Seater',
        amount: 100,
        arrears: 0,
        ref: 'PRK-888X',
        due: 'Today'
      }
    }
  };

  // --- INITIALIZE THEMES & UI STATE ---
  document.documentElement.setAttribute('data-theme', currentTheme);

  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- DOM ELEMENTS ---
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  updateThemeIcon();
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.getElementById('mobile-toggle'); // DEPRECATED
  const navMenu = document.getElementById('nav-menu'); // DEPRECATED
  const header = document.querySelector('header'); // DEPRECATED
  const views = document.querySelectorAll('.tab-content');
  const quickPortalBtn = document.getElementById('quick-portal-btn');
  const heroPortalBtn = document.getElementById('hero-portal-btn');
  const heroCalcBtn = document.getElementById('hero-calc-btn');

  // --- SCROLL EFFECTS ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      if(header) header.classList.add('scrolled');
    } else {
      if(header) header.classList.remove('scrolled');
    }
  });

  // --- MOBILE NAVIGATION ---
  if(mobileToggle) mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const isExpanded = navMenu.classList.contains('active');
    mobileToggle.innerHTML = isExpanded ? '✕' : '☰';
  });

  // Close mobile menu on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if(navMenu) navMenu.classList.remove('active');
      if(mobileToggle) mobileToggle.innerHTML = '☰';
    });
  });

  // --- VIEW NAVIGATION SYSTEM ---
  function switchView(targetViewId) {
    if (!isAuthenticated && protectedViews.includes(targetViewId)) {
      alert('Please sign in or register before accessing MeruPay services.');
      targetViewId = 'login';
    }

    // Update Nav Active State
    navLinks.forEach(link => {
      if (link.getAttribute('data-tab') === targetViewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Scroll to target section instead of hiding others
    const targetSection = document.getElementById(`${targetViewId}-view`);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Handle view-specific initializations
    if (targetViewId === 'home') {
      animateCounters();
    }
  }

  // Bind Nav Links Click Events
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.getAttribute('data-tab');
      if (tabId) switchView(tabId);
    });
  });

  // Bind all quick tab links that use data-tab attributes
  document.querySelectorAll('a[data-tab]').forEach(link => {
    if (link.classList.contains('nav-link')) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.getAttribute('data-tab');
      if (tabId) switchView(tabId);
    });
  });

  // Bind Quick Navigation Buttons
  const heroServicesBtn = document.getElementById('hero-services-btn');
  if (heroServicesBtn) heroServicesBtn.addEventListener('click', (e) => { e.preventDefault(); switchView('services'); });
  if (quickPortalBtn) quickPortalBtn.addEventListener('click', (e) => { e.preventDefault(); switchView('portal'); });
  if (heroPortalBtn) heroPortalBtn.addEventListener('click', (e) => { e.preventDefault(); switchView('portal'); });
  if (heroCalcBtn) heroCalcBtn.addEventListener('click', (e) => { e.preventDefault(); switchView('calculator'); });

  // --- LIGHT / DARK MODE ---
  themeToggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
  });

  function updateThemeIcon() {
    if (currentTheme === 'dark') {
      themeToggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
    } else {
      themeToggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    }
  }


  // ── Login Tabs & Registration Toggling ─────────────────────────
  const loginTabBtns = document.querySelectorAll('.login-tab-btn');
  const loginFormViews = document.querySelectorAll('.login-form-view');
  
  if (loginTabBtns.length > 0) {
    loginTabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Update styling
        loginTabBtns.forEach(b => {
          b.classList.remove('active');
          b.style.color = 'var(--text-color-light)';
          b.style.borderBottomColor = 'transparent';
        });
        btn.classList.add('active');
        btn.style.color = 'var(--primary-color)';
        btn.style.borderBottomColor = 'var(--primary-color)';
        
        // Toggle forms
        const targetId = btn.getAttribute('data-target');
        loginFormViews.forEach(form => {
          if (form.id === targetId) {
            form.style.display = 'block';
          } else {
            form.style.display = 'none';
          }
        });
      });
    });

    // Wire up Register / Login links
    document.querySelectorAll('.register-link').forEach(link => {
      link.addEventListener('click', (e) => { e.preventDefault(); switchView('register'); });
    });
    document.querySelectorAll('.login-link').forEach(link => {
      link.addEventListener('click', (e) => { e.preventDefault(); switchView('login'); });
    });
    
    // Login handler that requires credentials and unlocks service access
    document.querySelectorAll('.login-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const form = btn.closest('form');
        const idInput = form.querySelector('input[type="text"]');
        const pwdInput = form.querySelector('input[type="password"]');

        if (idInput && pwdInput && idInput.value.trim() !== '' && pwdInput.value.trim() !== '') {
          isAuthenticated = true;
          alert('Login successful. You may now access MeruPay services.');
          switchView('home');
        } else {
          alert('Please enter both your ID and password to sign in.');
        }
      });
    });

    // Registration complete handler that activates user session
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
      const registerBtn = registrationForm.querySelector('button[type="button"]');
      if (registerBtn) {
        registerBtn.addEventListener('click', () => {
          const regId = document.getElementById('regId');
          const regPhone = document.getElementById('regPhone');
          const regPassword = document.getElementById('regPassword');
          if (regId && regPhone && regPassword && regId.value.trim() !== '' && regPhone.value.trim() !== '' && regPassword.value.trim() !== '') {
            isAuthenticated = true;
            alert('Registration complete. You are now signed in and can access services.');
            switchView('home');
          } else {
            alert('Please complete all registration fields before continuing.');
          }
        });
      }
    }
  }


  // Mobile sidebar toggle logic
  const sidebar = document.getElementById('sidebar');
  const sidebarOpen = document.getElementById('sidebar-open');
  const sidebarClose = document.getElementById('sidebar-close');
  
  if(sidebar && sidebarOpen && sidebarClose) {
      sidebarOpen.addEventListener('click', () => {
          sidebar.classList.add('sidebar-open');
      });
      sidebarClose.addEventListener('click', () => {
          sidebar.classList.remove('sidebar-open');
      });
      // Automatically close sidebar when scrolling on mobile to prevent it from hiding content
      window.addEventListener('scroll', () => {
          if (window.innerWidth <= 992 && sidebar.classList.contains('sidebar-open')) {
              sidebar.classList.remove('sidebar-open');
          }
      });
      // Close sidebar when a nav link is clicked on mobile
      document.querySelectorAll('#sidebar-nav-links .nav-link').forEach(link => {
          link.addEventListener('click', () => {
              if (window.innerWidth <= 992) {
                  sidebar.classList.remove('sidebar-open');
              }
          });
      });
  }

  // --- STATS COUNTERS ---
  let countersAnimated = false;
  function animateCounters() {
    if (countersAnimated) return;
    const counters = document.querySelectorAll('.stat-num');
    
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const suffix = counter.getAttribute('data-suffix') || '';
      const isDecimal = counter.getAttribute('data-decimal') === 'true';
      let start = 0;
      const duration = 2000; // 2 seconds
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing out quadratic
        const easeProgress = progress * (2 - progress);
        const currentVal = start + easeProgress * (target - start);
        
        if (isDecimal) {
          counter.textContent = currentVal.toFixed(1) + suffix;
        } else {
          counter.textContent = Math.floor(currentVal).toLocaleString() + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          if (isDecimal) {
            counter.textContent = target.toFixed(1) + suffix;
          } else {
            counter.textContent = target.toLocaleString() + suffix;
          }
        }
      }
      requestAnimationFrame(updateCounter);
    });
    countersAnimated = true;
  }
  
  // Trigger counters initially since homepage is active by default
  setTimeout(animateCounters, 500);

  // --- SERVICES VIEW DETAILS TAB ---
  const serviceTabBtns = document.querySelectorAll('.service-tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  serviceTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      serviceTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      serviceCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // SBP Service actions (Pay/Calculate links)
  document.querySelectorAll('.btn-service-action').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = btn.getAttribute('data-action');
      if (action === 'calculate') {
        switchView('calculator');
      } else if (action === 'pay') {
        const type = btn.getAttribute('data-type');
        switchView('portal');
        if (type) {
          document.querySelector(`.portal-tab-btn[data-type="${type}"]`).click();
        }
      }
    });
  });

  // ============================================================
  // LEGACY SBP CALCULATOR (top form on calculator tab)
  // ============================================================
  const calcForm = document.getElementById('permit-calc-form');
  const radioBoxes = document.querySelectorAll('.radio-box');
  
  radioBoxes.forEach(box => {
    box.addEventListener('click', () => {
      const parent = box.closest('.radio-group');
      parent.querySelectorAll('.radio-box').forEach(b => b.classList.remove('selected'));
      box.classList.add('selected');
      box.querySelector('input').checked = true;
    });
  });

  if (calcForm) {
    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const sector   = document.getElementById('calc-sector').value;
      const employees = document.querySelector('input[name="employees"]:checked').value;
      const zone     = document.getElementById('calc-zone').value;

      const sectorMap = {
        retail:        { name: 'General Trade, Retail & Shops',                  base: 5000  },
        agriculture:   { name: 'Agribusiness, Coffee & Tea Stores',              base: 3500  },
        transport:     { name: 'Transport, Taxi & Matatu Operators',             base: 7000  },
        hospitality:   { name: 'Hospitality, Hotels & Restaurants',              base: 9000  },
        professional:  { name: 'Professional Services, Clinics & Consultancy',   base: 8000  },
        manufacturing: { name: 'Manufacturing, Processing & Heavy Industry',     base: 12000 },
      };
      const sizeMap = {
        micro:  { label: 'Micro Enterprise (< 5 employees)',   mult: 1.0, garbage: 1000 },
        small:  { label: 'Small Enterprise (5 – 20 employees)',mult: 1.7, garbage: 1500 },
        medium: { label: 'Medium Enterprise (21 – 50)',        mult: 2.8, garbage: 3000 },
        large:  { label: 'Large Enterprise (> 50)',            mult: 4.5, garbage: 6000 },
      };
      const zoneMap = {
        'urban':      { label: 'Urban Zone A (Meru CBD, Nkubu)', mult: 1.25 },
        'peri-urban': { label: 'Peri-Urban Zone B (Maua, Timau)', mult: 1.0 },
        'rural':      { label: 'Rural Zone C (Other Sub-counties)', mult: 0.8 },
      };

      const s = sectorMap[sector];
      const z = sizeMap[employees];
      const zn = zoneMap[zone];
      const calculatedSBP = s.base * z.mult * zn.mult;
      const fireFee = 2000;
      const total = calculatedSBP + z.garbage + fireFee;

      document.getElementById('inv-sector').textContent  = s.name;
      document.getElementById('inv-size').textContent    = z.label;
      document.getElementById('inv-zone').textContent    = zn.label;
      document.getElementById('inv-sbp').textContent     = 'KES ' + Math.round(calculatedSBP).toLocaleString();
      document.getElementById('inv-garbage').textContent = 'KES ' + z.garbage.toLocaleString();
      document.getElementById('inv-fire').textContent    = 'KES ' + fireFee.toLocaleString();
      document.getElementById('inv-total').textContent   = 'KES ' + Math.round(total).toLocaleString();

      const payBtn = document.getElementById('inv-pay-btn');
      payBtn.disabled = false;
      payBtn.setAttribute('data-amount', Math.round(total));
      payBtn.setAttribute('data-desc', `SBP Renewal – ${s.name} (${z.label})`);
    });
  }

  const invPayBtn = document.getElementById('inv-pay-btn');
  if (invPayBtn) {
    invPayBtn.addEventListener('click', () => {
      const amount = parseInt(invPayBtn.getAttribute('data-amount'));
      const desc   = invPayBtn.getAttribute('data-desc');
      if (!amount) return;
      switchView('portal');
      document.querySelector('.portal-tab-btn[data-type="permit"]').click();
      const customBill = {
        owner: 'Calculated Permit Owner (New)', item: desc, amount,
        arrears: 0, ref: 'SBP-' + Math.floor(Math.random() * 90000 + 10000), due: 'Immediate'
      };
      mockBills['permit']['CUSTOM-CALC'] = customBill;
      document.getElementById('portal-ref-input').value = 'CUSTOM-CALC';
      document.getElementById('portal-search-form').dispatchEvent(new Event('submit'));
    });
  }

  // ============================================================
  // ENHANCED MULTI-CATEGORY FEE CALCULATOR
  // ============================================================

  // ── Complete Finance Act 2019 Fee Schedule ────────────────────
  const feeSchedule = {

    sbp: {
      // Location keys: meru | nkubu | other
      mega:         { meru: 50000, nkubu: 30000, other: 20000,  ref: 'Sch.13 – Class A',  note: 'Applies to wholesale depots, mega stores & supermarkets >2000 sqft' },
      largeTrader:  { meru: 15000, nkubu:  8000, other:  6000,  ref: 'Sch.13 – Class B',  note: 'Businesses with more than 20 staff' },
      mediumTrader: { meru:  7000, nkubu:  4000, other:  4000,  ref: 'Sch.13 – Class C',  note: '' },
      smallTrader:  { meru:  3400, nkubu:  2000, other:  2000,  ref: 'Sch.13 – Class D',  note: '' },
      kiosk:        { meru:  2700, nkubu:  1600, other:  1500,  ref: 'Sch.13 – Class E',  note: '' },
      hawker:       { meru:  1500, nkubu:  1000, other:   800,  ref: 'Sch.13 – Class F',  note: 'Mobile traders; subject to daily market fees in addition' },
      hotel:        { meru: 20000, nkubu: 10000, other:  7000,  ref: 'Sch.13 – Class G',  note: 'Star-rated hotels; rates vary by room count' },
      restaurant:   { meru:  8000, nkubu:  5000, other:  3000,  ref: 'Sch.13 – Class H',  note: 'Includes nyama choma joints & fast food outlets' },
      professional: { meru: 10000, nkubu:  6000, other:  4000,  ref: 'Sch.13 – Class I',  note: 'Law firms, accounting, consulting & insurance offices' },
      school:       { meru: 15000, nkubu:  8000, other:  5000,  ref: 'Sch.13 – Class J',  note: 'Nursery to secondary; universities assessed separately' },
      clinic:       { meru: 12000, nkubu:  7000, other:  5000,  ref: 'Sch.13 – Class K',  note: 'Includes pharmacies & diagnostic labs' },
    },

    advertising: {
      // Location keys: meru | maua | other
      directionalSingle: { meru:  1200, maua:   700, other:  500, ref: 'Sch.5 – Item 1a', note: 'Single-sided directional signboard per sq metre' },
      directionalDouble: { meru:  2000, maua:  1200, other:  800, ref: 'Sch.5 – Item 1b', note: 'Double-sided directional signboard per sq metre' },
      businessSignboard: { meru:  1400, maua:  1400, other:  500, ref: 'Sch.5 – Item 2',  note: 'Business name board at premises (per sq metre p.a.)' },
      illuminated:       { meru:  7500, maua:  7500, other: 2500, ref: 'Sch.5 – Item 3',  note: 'Neon / LED-lit signboard (per sq metre p.a.)' },
      billboard:         { meru: 30000, maua: 20000, other:10000, ref: 'Sch.5 – Item 4',  note: 'Unipole / hoarding billboard (per face p.a.)' },
      poster:            { meru:    500, maua:   300, other:  200, ref: 'Sch.5 – Item 5',  note: 'Posters & handbills (per campaign / batch)' },
      vehicleBranding:   { meru:  5000, maua:  5000, other: 3000, ref: 'Sch.5 – Item 6',  note: 'Vehicle wrap / painted advertising (per vehicle p.a.)' },
      roadShow:          { meru:  3000, maua:  3000, other: 1500, ref: 'Sch.5 – Item 7',  note: 'Mobile road-show event (per day)' },
    },

    publichealth: {
      // Location keys: meru | other (county-wide for most)
      foodHygiene:       { meru:  2000, other: 1500, ref: 'Sch.11 – Item 1',  note: 'Food-handler certificate per person per year' },
      premisesInspect:   { meru:  3000, other: 2000, ref: 'Sch.11 – Item 2',  note: 'Institutional / business premises inspection fee' },
      schoolInspect:     { meru:  4000, other: 2500, ref: 'Sch.11 – Item 3',  note: 'Annual school sanitation & health inspection' },
      medicalWaste:      { meru:  6000, other: 4000, ref: 'Sch.11 – Item 4',  note: 'Medical / hazardous waste handling licence p.a.' },
      vaccinationCert:   { meru:   500, other:  500, ref: 'Sch.11 – Item 5',  note: 'Yellow-fever / typhoid vaccination certificate' },
      buildingPlan:      { meru:  5000, other: 3000, ref: 'Sch.11 – Item 6',  note: 'Public health clearance for building plan approval' },
      exhumation:        { meru: 10000, other: 8000, ref: 'Sch.11 – Item 7',  note: 'Exhumation / reburial permit' },
    },

    waste: {
      // Location keys: meru | other  — SOURCE: Finance Act 2019, Section 5
      // Thresholds based on SBP permit fee band
      smallBusiness:    { meru:  1000, other:   200, ref: 'S.5(a) – Finance Act 2019', note: 'Small business: SBP permit fee up to Ksh 4,900 (annual)' },
      mediumBusiness:   { meru:  3000, other:   500, ref: 'S.5(b) – Finance Act 2019', note: 'Medium business: SBP permit fee Ksh 4,901–7,000 (annual)' },
      largeBusiness:    { meru:  5000, other:  1000, ref: 'S.5(c) – Finance Act 2019', note: 'Large business: SBP permit fee Ksh 7,001+ (annual)' },
      banksInsurance:   { meru: 15000, other: 15000, ref: 'S.5(d) – Finance Act 2019', note: 'Insurance companies and banks (annual)' },
      supermarket:      { meru: 25000, other: 25000, ref: 'S.5(e) – Finance Act 2019', note: 'Supermarkets, big stores, private learning institutions (annual)' },
      professionalFirm: { meru:  3000, other:  1000, ref: 'S.5(f) – Finance Act 2019', note: 'Private registered firms: lawyers, doctors, accountants (annual)' },
    },

    parking: {
      // SOURCE: Finance Act 2019, Section 3 — Transportation & Parking Fees
      // Daily rates are UNIFORM county-wide (no CBD premium in the official schedule)
      // Monthly charge also provided. Late payment of seasonal tickets = 25% penalty.
      // Parking in un-designated areas = Ksh 10,000 fine.
      // Location keys: daily | monthly (uniform — no cbd/other split in the Act)
      motorbike:  { daily:  20, monthly:   300, ref: 'S.3(a) – Finance Act 2019', note: 'Boda-boda / motorbike — Daily: Ksh 20, Monthly: Ksh 300' },
      tuktuk:     { daily:  50, monthly:  1000, ref: 'S.3(b) – Finance Act 2019', note: 'Tuktuk — Daily: Ksh 50, Monthly: Ksh 1,000' },
      car:        { daily:  50, monthly:  1000, ref: 'S.3(d) – Finance Act 2019', note: 'Saloon car / taxi — Daily: Ksh 50, Monthly: Ksh 1,000' },
      matatu:     { daily: 100, monthly:  1800, ref: 'S.3(f) – Finance Act 2019', note: 'Matatu shuttle (10–14 seater) — Daily: Ksh 100, Monthly: Ksh 1,800' },
      bus:        { daily: 200, monthly:  3900, ref: 'S.3(h) – Finance Act 2019', note: 'Bus (30–62 seater) — Daily: Ksh 200, Monthly: Ksh 3,900' },
      lightTruck: { daily: 150, monthly:  2200, ref: 'S.3(k) – Finance Act 2019', note: 'Light truck (1–6 tons) — Daily: Ksh 150, Monthly: Ksh 2,200' },
      lorry:      { daily: 250, monthly:  4500, ref: 'S.3(m) – Finance Act 2019', note: 'Lorry — Daily: Ksh 250, Monthly: Ksh 4,500' },
      trailer:    { daily: 300, monthly:  5000, ref: 'S.3(n) – Finance Act 2019', note: 'Trailer — Daily: Ksh 300, Monthly: Ksh 5,000' },
    },
    liquor: {
      generalRetail:      { meru: 30000, other: 15000, ref: 'Sch.1 – Item 1',  note: 'Application fee of Ksh 5,000 applies separately.' },
      wholesale:          { meru: 55000, other: 50000, ref: 'Sch.1 – Item 2',  note: 'Application fee of Ksh 5,000 applies separately.' },
      retailSpirits:      { meru: 50000, other: 24000, ref: 'Sch.1 – Item 3',  note: 'Application fee of Ksh 5,000 applies separately.' },
      barRestaurant:      { meru: 24000, other: 30000, ref: 'Sch.1 – Item 4',  note: 'Application fee of Ksh 5,000 applies separately.' },
      temporary:          { meru:  6000, other:  6000, ref: 'Sch.1 – Item 5',  note: 'Application fee of Ksh 5,000 applies separately.' },
      nightClub:          { meru: 100000,other: 50000, ref: 'Sch.1 – Item 6',  note: 'Application fee of Ksh 5,000 applies separately.' },
      depot:              { meru: 30000, other: 30000, ref: 'Sch.1 – Item 7',  note: 'Application fee of Ksh 5,000 applies separately.' },
      distributor:        { meru: 55000, other: 50000, ref: 'Sch.1 – Item 8',  note: 'Application fee of Ksh 5,000 applies separately.' },
      supermarket:        { meru: 75000, other: 70000, ref: 'Sch.1 – Item 9',  note: 'Application fee of Ksh 5,000 applies separately.' },
      manufacturer:       { meru: 250000,other: 250000,ref: 'Sch.1 – Item 10', note: 'Application fee of Ksh 5,000 applies separately.' },
    },

    general_fees: {
      bondWithdrawal:     { meru:  1000, other:  1000, ref: 'Sch.2 – Item a',  note: '' },
      buildingMaterials:  { meru:  2000, other:  2000, ref: 'Sch.2 – Item c',  note: 'Commercial' },
      kioskTransfer:      { meru:  3000, other:  3000, ref: 'Sch.2 – Item d',  note: '' },
      tenderDocs:         { meru:  1000, other:  1000, ref: 'Sch.2 – Item e',  note: '' },
      bouncedCheque:      { meru: 10000, other: 10000, ref: 'Sch.2 – Item m',  note: 'Penalty for returned cheques' },
      subletPremises:     { meru:  2000, other:  2000, ref: 'Sch.2 – Item p',  note: '' },
      changeActivity:     { meru:  2000, other:  2000, ref: 'Sch.2 – Item q',  note: 'Change of business activity' },
      sbpApp:             { meru:  2000, other:  1000, ref: 'Sch.2 – Item r',  note: 'New SBP Application' },
      sbpRenewal:         { meru:   500, other:   200, ref: 'Sch.2 – Item w',  note: 'SBP Renewal Application' },
      leaseExtension:     { meru: 20000, other: 20000, ref: 'Sch.2 – Item x',  note: 'Renewal or Extension of Lease' },
      transferConsent:    { meru:  6000, other:  6000, ref: 'Sch.2 – Item ab', note: 'Consent for Transfer/Sub-division' },
      clearanceCert:      { meru:  4000, other:  4000, ref: 'Sch.2 – Item ad', note: 'Rates & Rents Clearance Certificate' },
      sewerConnection:    { meru: 20000, other: 20000, ref: 'Sch.2 – Item ar', note: 'Sewer Line Connection' },
    },

    agri_cess: {
      cabbages:           { amount:   20, ref: 'Sch.4 – Item 1(a)', note: 'Per 50kg bag' },
      transportPickup:    { amount:  200, ref: 'Sch.4 – Item 1(b)', note: '0.5 Tonnes' },
      transportLight:     { amount: 1000, ref: 'Sch.4 – Item 1(f)', note: '5–10 Tonnes' },
      transportTrailer:   { amount: 4000, ref: 'Sch.4 – Item 1(h)', note: 'Over 17 Tonnes' },
      sandLorry:          { amount: 1000, ref: 'Sch.4 – Item 5(c)', note: '7 Tonnes' },
      sandTrailer:        { amount: 2000, ref: 'Sch.4 – Item 5(f)', note: '' },
      blocksTrailer:      { amount: 1000, ref: 'Sch.4 – Item 6',    note: '' },
      timberTrailer:      { amount: 5000, ref: 'Sch.4 – Item 12(e)',note: '' },
      miraaPickup:        { amount: 1000, ref: 'Sch.4 – Item 18(b)',note: '' },
      miraaLorry:         { amount: 2000, ref: 'Sch.4 – Item 18(c)',note: 'Lorry/Bus' },
      teaCoffeeTax:       { amount:    0, ref: 'Sch.4 – Item 19(f)',note: '⚠️ Note: This tax is 1% of Gross Turnover. Please calculate manually and remit.' },
    },

    livestock: {
      inspCattle:         { amount:  100, ref: 'Sch.6 – Item a',    note: 'Per head' },
      inspSheep:          { amount:   40, ref: 'Sch.6 – Item b',    note: 'Per head' },
      slaughterCatA:      { amount: 6000, ref: 'Sch.6 – Item c',    note: 'Per year' },
      slaughterCatB:      { amount: 4000, ref: 'Sch.6 – Item d',    note: 'Per year' },
      transCow:           { amount:  100, ref: 'Sch.6 – Item e',    note: 'Per head' },
      transCamel:         { amount:  200, ref: 'Sch.6 – Item f',    note: 'Per head' },
      liveSingleDay:      { amount:  600, ref: 'Sch.6 – Item g',    note: '1-20 heads' },
    },


  };

  // ── Label Maps ────────────────────────────────────────────────
  const locationLabels = {
    meru: 'Meru Town (CBD)',
    nkubu: 'Nkubu / Timau / Laare',
    other: 'Other Sub-County',
    maua: 'Maua / Nkubu',
    cbd: 'CBD / Town Centre',
  };

  const categoryLabels = {
    sbp: 'Single Business Permit',
    advertising: 'Outdoor Advertising',
    publichealth: 'Public Health',
    waste: 'Solid Waste Management',
    parking: 'Parking Fees',
    liquor: 'Liquor Licensing',
    general_fees: 'General Fees & Charges',
    agri_cess: 'Agricultural Produce Cess',
    livestock: 'Livestock & Meat Inspection',

  };

  // ── Search Index ─────────────────────────────────────────────
  const searchIndex = [
    { label: 'Garbage – Small',          category: 'waste',        subKey: 'smallBusiness',      location: 'meru' },
    { label: 'Garbage – Medium',         category: 'waste',        subKey: 'mediumBusiness',     location: 'meru' },
    { label: 'Garbage – Large',          category: 'waste',        subKey: 'largeBusiness',      location: 'meru' },
    { label: 'Garbage – Banks/Insurance',category: 'waste',        subKey: 'banksInsurance',     location: 'meru' },
    { label: 'Garbage – Supermarket',    category: 'waste',        subKey: 'supermarket',        location: 'meru' },
    { label: 'Garbage – Professional',   category: 'waste',        subKey: 'professionalFirm',   location: 'meru' },
    { label: 'Motorbike Parking (Daily)',  category: 'parking',    subKey: 'motorbike',          location: 'daily'  },
    { label: 'Tuktuk Parking (Daily)',     category: 'parking',    subKey: 'tuktuk',             location: 'daily'  },
    { label: 'Car Parking (Daily)',        category: 'parking',    subKey: 'car',                location: 'daily'  },
    { label: 'Matatu Parking (Daily)',     category: 'parking',    subKey: 'matatu',             location: 'daily'  },
    { label: 'Bus Parking (Daily)',        category: 'parking',    subKey: 'bus',                location: 'daily'  },
    { label: 'Light Truck Parking (Daily)',category: 'parking',    subKey: 'lightTruck',         location: 'daily'  },
    { label: 'Lorry Parking (Daily)',      category: 'parking',    subKey: 'lorry',              location: 'daily'  },
    { label: 'Trailer Parking (Daily)',    category: 'parking',    subKey: 'trailer',            location: 'daily'  },
    { label: 'Monthly Parking (Car)',      category: 'parking',    subKey: 'car',                location: 'monthly'},
    { label: 'Liquor – General Retail',    category: 'liquor',       subKey: 'generalRetail',      location: 'meru' },
    { label: 'Liquor – Night Club',        category: 'liquor',       subKey: 'nightClub',          location: 'meru' },
    { label: 'General – Bounced Cheque',   category: 'general_fees', subKey: 'bouncedCheque',      location: 'meru' },
    { label: 'Cess – Tea/Coffee Tax (1%)', category: 'agri_cess',    subKey: 'teaCoffeeTax',       location: 'county' },
    { label: 'Cess – Transport (Trailer)', category: 'agri_cess',    subKey: 'transportTrailer',   location: 'county' },
    { label: 'Livestock – Cow Inspection', category: 'livestock',    subKey: 'inspCattle',         location: 'county' },
  ];

  // ── Dynamic Field Templates ────────────────────────────────────
  const dynamicTemplates = {
    sbp: `
      <div class="form-group">
        <label>Location</label>
        <select id="sbpLocation" class="form-control">
          <option value="meru">Meru Town (CBD)</option>
          <option value="nkubu">Nkubu / Timau / Laare</option>
          <option value="other">Other Sub-County</option>
        </select>
      </div>
      <div class="form-group">
        <label>Business Category</label>
        <select id="sbpBusiness" class="form-control">
          <option value="mega">Mega Store / Wholesale Depot</option>
          <option value="largeTrader">Large Trader (&gt; 20 staff)</option>
          <option value="mediumTrader">Medium Trader</option>
          <option value="smallTrader">Small Trader</option>
          <option value="kiosk">Kiosk</option>
          <option value="hawker">Hawker / Mobile Trader</option>
          <option value="hotel">Hotel (Star-Rated)</option>
          <option value="restaurant">Restaurant / Food Court</option>
          <option value="professional">Professional Firm (Law, Accounting, Consulting)</option>
          <option value="school">School / College</option>
          <option value="clinic">Health Facility / Pharmacy / Lab</option>
        </select>
      </div>`,

    advertising: `
      <div class="form-group">
        <label>Advertisement Type</label>
        <select id="advertType" class="form-control">
          <option value="directionalSingle">Directional Signboard (Single-Sided)</option>
          <option value="directionalDouble">Directional Signboard (Double-Sided)</option>
          <option value="businessSignboard">Business Name Signboard</option>
          <option value="illuminated">Illuminated / LED Signboard</option>
          <option value="billboard">Billboard / Unipole / Hoarding</option>
          <option value="poster">Poster / Handbill / Flier (per campaign)</option>
          <option value="vehicleBranding">Vehicle Branding / Wrap</option>
          <option value="roadShow">Mobile Road Show (per day)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Location</label>
        <select id="advertLocation" class="form-control">
          <option value="meru">Meru Town (CBD)</option>
          <option value="maua">Maua / Nkubu</option>
          <option value="other">Other Sub-Counties</option>
        </select>
      </div>`,

    publichealth: `
      <div class="form-group">
        <label>Service Type</label>
        <select id="phType" class="form-control">
          <option value="foodHygiene">Food Hygiene Certificate (per person)</option>
          <option value="premisesInspect">Premises / Business Inspection</option>
          <option value="schoolInspect">School Sanitation Inspection</option>
          <option value="medicalWaste">Medical / Hazardous Waste Licence</option>
          <option value="vaccinationCert">Vaccination Certificate</option>
          <option value="buildingPlan">Building Plan Health Clearance</option>
          <option value="exhumation">Exhumation / Reburial Permit</option>
        </select>
      </div>
      <div class="form-group">
        <label>Location</label>
        <select id="phLocation" class="form-control">
          <option value="meru">Meru Town &amp; Suburbs</option>
          <option value="other">Other Sub-Counties</option>
        </select>
      </div>`,

    waste: `
      <div class="form-group">
        <label>Premises / Business Type</label>
        <select id="wasteType" class="form-control">
          <option value="smallBusiness">Small Business (SBP fee up to Ksh 4,900)</option>
          <option value="mediumBusiness">Medium Business (SBP fee Ksh 4,901–7,000)</option>
          <option value="largeBusiness">Large Business (SBP fee Ksh 7,001+)</option>
          <option value="banksInsurance">Insurance Companies &amp; Banks</option>
          <option value="supermarket">Supermarkets / Big Stores / Private Learning Institutions</option>
          <option value="professionalFirm">Private Registered Firms (Lawyers, Doctors, Accountants)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Location</label>
        <select id="wasteLocation" class="form-control">
          <option value="meru">Meru Town &amp; CBD</option>
          <option value="other">Other Sub-Counties</option>
        </select>
      </div>`,

    parking: `
      <div class="form-group">
        <label>Vehicle Type</label>
        <select id="vehicleType" class="form-control">
          <option value="motorbike">Motorbike / Boda-Boda</option>
          <option value="tuktuk">Tuktuk</option>
          <option value="car">Saloon Car / Taxi</option>
          <option value="matatu">Matatu Shuttle (10–14 Seater)</option>
          <option value="bus">Bus (30–62 Seater)</option>
          <option value="lightTruck">Light Truck (1–6 Tons)</option>
          <option value="lorry">Lorry</option>
          <option value="trailer">Trailer</option>
        </select>
      </div>
      <div class="form-group">
        <label>Charge Type</label>
        <select id="parkingChargeType" class="form-control">
          <option value="daily">Daily Charge</option>
          <option value="monthly">Monthly Seasonal Ticket</option>
        </select>
      </div>`,
    liquor: `
      <div class="form-group">
        <label>Liquor License Type</label>
        <select id="liquorType" class="form-control">
          <option value="generalRetail">General Retail Alcoholic Drink</option>
          <option value="wholesale">Wines &amp; Spirits Wholesale</option>
          <option value="retailSpirits">Wines &amp; Spirits Retail</option>
          <option value="barRestaurant">Bar, Restaurant &amp; Nyama Choma</option>
          <option value="temporary">Temporary License</option>
          <option value="nightClub">Night Club</option>
          <option value="depot">Alcoholic Drink Depot</option>
          <option value="distributor">Alcoholic Drink Distributor</option>
          <option value="supermarket">Supermarket (Big) Alcoholic</option>
          <option value="manufacturer">Alcoholic Drink Manufacturer</option>
        </select>
      </div>
      <div class="form-group">
        <label>Location</label>
        <select id="liquorLocation" class="form-control">
          <option value="meru">Meru Town &amp; Maua</option>
          <option value="other">Other Markets</option>
        </select>
      </div>`,

    general_fees: `
      <div class="form-group">
        <label>Fee Type</label>
        <select id="genFeeType" class="form-control">
          <option value="bondWithdrawal">Bond Withdrawal Fee</option>
          <option value="buildingMaterials">Building materials approval (Commercial)</option>
          <option value="kioskTransfer">Kiosk/house/stall transfer</option>
          <option value="tenderDocs">Application for tender documents</option>
          <option value="bouncedCheque">Bounced cheque penalty</option>
          <option value="subletPremises">Sublet of Business Premises</option>
          <option value="changeActivity">Change of business activity</option>
          <option value="sbpApp">New Single Business Permit application</option>
          <option value="sbpRenewal">SBP Renewal application fee</option>
          <option value="leaseExtension">Renewal or Extension of Lease</option>
          <option value="transferConsent">Consent for Transfer/Sub-division</option>
          <option value="clearanceCert">Rates &amp; Rents Clearance Certificate</option>
          <option value="sewerConnection">Sewer Line Connection</option>
        </select>
      </div>
      <div class="form-group">
        <label>Location</label>
        <select id="genFeeLocation" class="form-control">
          <option value="meru">Meru / Maua / Nkubu</option>
          <option value="other">Other Sub-Counties</option>
        </select>
      </div>`,

    agri_cess: `
      <div class="form-group">
        <label>Produce &amp; Transport Type</label>
        <select id="agriType" class="form-control">
          <option value="cabbages">Cabbages/Bananas/Nuts (per 50kg bag)</option>
          <option value="transportPickup">Produce Transport — Pick-up/Probox (0.5T)</option>
          <option value="transportLight">Produce Transport — Light Truck (5–10T)</option>
          <option value="transportTrailer">Produce Transport — Trailer (Over 17T)</option>
          <option value="sandLorry">Sand Transport — Lorry (7T)</option>
          <option value="sandTrailer">Sand Transport — Trailer</option>
          <option value="blocksTrailer">Building Blocks/Stones — Trailer</option>
          <option value="timberTrailer">Timber Transport — Trailer</option>
          <option value="miraaPickup">Miraa Cess — Pick-up</option>
          <option value="miraaLorry">Miraa Cess — Lorry/Bus</option>
          <option value="teaCoffeeTax">Tea/Coffee Industrial Gross Turnover Tax (1%)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Location</label>
        <select id="agriLocation" class="form-control" disabled>
          <option value="county">County-Wide / Border Points</option>
        </select>
      </div>`,

    livestock: `
      <div class="form-group">
        <label>Service Type</label>
        <select id="livestockType" class="form-control">
          <option value="inspCattle">Meat Inspection: Cattle/Camel (per head)</option>
          <option value="inspSheep">Meat Inspection: Sheep/Goat/Pig (per head)</option>
          <option value="slaughterCatA">Slaughterhouse License (Category A)</option>
          <option value="slaughterCatB">Slaughterhouse License (Category B)</option>
          <option value="transCow">Livestock Transport Cess: Cow/Bull/Donkey</option>
          <option value="transCamel">Livestock Transport Cess: Camel</option>
          <option value="liveSingleDay">Live Animals Single Day Permit</option>
        </select>
      </div>
      <div class="form-group">
        <label>Location</label>
        <select id="livestockLocation" class="form-control" disabled>
          <option value="county">County-Wide</option>
        </select>
      </div>`,

  };

  // ── DOM References ────────────────────────────────────────────
  const revCatSel        = document.getElementById('revenueCategory');
  const dynFields        = document.getElementById('dynamicFields');
  const calcFeeBtn       = document.getElementById('calculateFeeBtn');
  const resultService    = document.getElementById('resultService');
  const resultLocation   = document.getElementById('resultLocation');
  const resultReference  = document.getElementById('resultReference');
  const resultAmount     = document.getElementById('resultAmount');
  const resultNote       = document.getElementById('resultNote');
  const resultNoteRow    = document.getElementById('resultNoteRow');
  const feeGenInvoiceBtn = document.getElementById('feeGenInvoiceBtn');
  const feeProceedBtn    = document.getElementById('feeProceedBtn');
  const searchInput      = document.getElementById('serviceSearch');
  const suggestions      = document.getElementById('searchSuggestions');

  // ── Revenue Category Change → inject dynamic fields ───────────
  if (revCatSel) {
    revCatSel.addEventListener('change', () => {
      const cat = revCatSel.value;
      if (cat && dynamicTemplates[cat]) {
        dynFields.innerHTML = dynamicTemplates[cat];
        calcFeeBtn.disabled = false;
      } else {
        dynFields.innerHTML = '';
        calcFeeBtn.disabled = true;
      }
      // reset result panel
      resetResultPanel();
    });
  }

  // ── Calculate Fee ─────────────────────────────────────────────
  if (calcFeeBtn) {
    calcFeeBtn.addEventListener('click', () => {
      const cat = revCatSel.value;
      if (!cat) return;

      let amount = 0, service = '', location = '', ref = '', note = '';

      try {
        if (cat === 'sbp') {
          const biz = document.getElementById('sbpBusiness').value;
          const loc = document.getElementById('sbpLocation').value;
          const row = feeSchedule.sbp[biz];
          amount   = row[loc] ?? row.other;
          service  = document.getElementById('sbpBusiness').selectedOptions[0].text;
          location = locationLabels[loc] || loc;
          ref      = row.ref;
          note     = row.note;

        } else if (cat === 'advertising') {
          const type = document.getElementById('advertType').value;
          const loc  = document.getElementById('advertLocation').value;
          const row  = feeSchedule.advertising[type];
          amount   = row[loc] ?? row.other;
          service  = document.getElementById('advertType').selectedOptions[0].text;
          location = locationLabels[loc] || loc;
          ref      = row.ref;
          note     = row.note;

        } else if (cat === 'publichealth') {
          const type = document.getElementById('phType').value;
          const loc  = document.getElementById('phLocation').value;
          const row  = feeSchedule.publichealth[type];
          amount   = row[loc] ?? row.other;
          service  = document.getElementById('phType').selectedOptions[0].text;
          location = locationLabels[loc] || loc;
          ref      = row.ref;
          note     = row.note;

        } else if (cat === 'waste') {
          const type = document.getElementById('wasteType').value;
          const loc  = document.getElementById('wasteLocation').value;
          const row  = feeSchedule.waste[type];
          amount   = row[loc] ?? row.other;
          service  = document.getElementById('wasteType').selectedOptions[0].text;
          location = locationLabels[loc] || loc;
          ref      = row.ref;
          note     = row.note;

        } else if (cat === 'parking') {
          const type       = document.getElementById('vehicleType').value;
          const chargeType = document.getElementById('parkingChargeType').value;
          const row        = feeSchedule.parking[type];
          amount   = row[chargeType];
          const chargeLabel = chargeType === 'daily' ? 'Daily Rate' : 'Monthly Seasonal Ticket';
          service  = document.getElementById('vehicleType').selectedOptions[0].text + ' (' + chargeLabel + ')';
          location = 'County-Wide (Uniform Rate — Finance Act 2019 S.3)';
          ref      = row.ref;
          note     = row.note + (chargeType === 'monthly' ? ' | ⚠️ Late payment of monthly tickets attracts a 25% penalty. Parking in un-designated areas = Ksh 10,000 fine.' : ' | ⚠️ Parking in un-designated areas attracts a fine of Ksh 10,000.');

        } else if (cat === 'liquor') {
          const type = document.getElementById('liquorType').value;
          const loc  = document.getElementById('liquorLocation').value;
          const row  = feeSchedule.liquor[type];
          amount   = row[loc] ?? row.other;
          service  = document.getElementById('liquorType').selectedOptions[0].text;
          location = locationLabels[loc] || loc;
          ref      = row.ref;
          note     = row.note;

        } else if (cat === 'general_fees') {
          const type = document.getElementById('genFeeType').value;
          const loc  = document.getElementById('genFeeLocation').value;
          const row  = feeSchedule.general_fees[type];
          amount   = row[loc] ?? row.other;
          service  = document.getElementById('genFeeType').selectedOptions[0].text;
          location = locationLabels[loc] || loc;
          ref      = row.ref;
          note     = row.note;

        } else if (cat === 'agri_cess') {
          const type = document.getElementById('agriType').value;
          const row  = feeSchedule.agri_cess[type];
          amount   = row.amount;
          service  = document.getElementById('agriType').selectedOptions[0].text;
          location = 'County-Wide / Border Points';
          ref      = row.ref;
          note     = row.note;
          if (type === 'teaCoffeeTax') amount = 0;

        } else if (cat === 'livestock') {
          const type = document.getElementById('livestockType').value;
          const row  = feeSchedule.livestock[type];
          amount   = row.amount;
          service  = document.getElementById('livestockType').selectedOptions[0].text;
          location = 'County-Wide';
          ref      = row.ref;
          note     = row.note;
        }

        // Fallback guard — should never be 0 with full schedule but just in case
        if (!amount || amount === 0) {
          alert('Fee data not yet available for this combination. Please contact the Revenue Board directly.');
          return;
        }

        // Update result panel
        resultService.textContent   = service;
        resultLocation.textContent  = location;
        resultReference.textContent = ref;
        resultAmount.textContent    = 'KES ' + amount.toLocaleString();

        if (note) {
          resultNote.textContent  = note;
          resultNoteRow.style.display = 'flex';
        } else {
          resultNoteRow.style.display = 'none';
        }

        feeGenInvoiceBtn.disabled = false;
        feeProceedBtn.disabled    = false;
        feeGenInvoiceBtn.setAttribute('data-amount', amount);
        feeGenInvoiceBtn.setAttribute('data-desc', `${categoryLabels[cat]} – ${service}`);
        feeProceedBtn.setAttribute('data-amount', amount);
        feeProceedBtn.setAttribute('data-desc', `${categoryLabels[cat]} – ${service}`);

      } catch (err) {
        alert('Could not calculate fee for this selection. Please try another combination.');
        console.error('[FeeCalc]', err);
      }
    });
  }

  // ── Proceed to Payment ────────────────────────────────────────
  function wirePaymentBtn(btn) {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const amount = parseInt(btn.getAttribute('data-amount'));
      const desc   = btn.getAttribute('data-desc');
      if (!amount) return;
      switchView('portal');
      document.querySelector('.portal-tab-btn[data-type="permit"]').click();
      const customBill = {
        owner: 'Fee Calculator Estimate', item: desc, amount,
        arrears: 0, ref: 'FEE-' + Math.floor(Math.random() * 90000 + 10000), due: 'Immediate'
      };
      mockBills['permit']['CUSTOM-CALC'] = customBill;
      document.getElementById('portal-ref-input').value = 'CUSTOM-CALC';
      document.getElementById('portal-search-form').dispatchEvent(new Event('submit'));
    });
  }
  wirePaymentBtn(feeProceedBtn);
  wirePaymentBtn(feeGenInvoiceBtn);

  // ── Quick Select Dropdown ─────────────────────────────────────
  if (searchInput) {
    searchInput.addEventListener('change', () => {
      const val = searchInput.value;
      if (!val) return;
      const item = searchIndex.find(i => i.label === val);
      if (!item) return;

      // Auto-select category and sub-type
      revCatSel.value = item.category;
      revCatSel.dispatchEvent(new Event('change'));
      
      // Set the sub-field after template is injected
      setTimeout(() => {
        const subMap = {
          sbp:         { field: 'sbpBusiness',  locField: 'sbpLocation'  },
          advertising: { field: 'advertType',   locField: 'advertLocation' },
          publichealth:{ field: 'phType',        locField: 'phLocation'   },
          waste:       { field: 'wasteType',     locField: 'wasteLocation' },
          parking:     { field: 'vehicleType',   locField: 'parkingChargeType' },
          liquor:      { field: 'liquorType',    locField: 'liquorLocation' },
          general_fees:{ field: 'genFeeType',    locField: 'genFeeLocation' },
          agri_cess:   { field: 'agriType',      locField: 'agriLocation' },
          livestock:   { field: 'livestockType', locField: 'livestockLocation' },

        };
        const map = subMap[item.category];
        if (map) {
          const subSel = document.getElementById(map.field);
          const locSel = document.getElementById(map.locField);
          if (subSel) subSel.value = item.subKey;
          if (locSel) locSel.value = item.location;
          // trigger change on subSel to calculate
          if (subSel) subSel.dispatchEvent(new Event('change'));
        }
      }, 50);
    });
  }

  function resetResultPanel() {
    if (resultService)   resultService.textContent  = '—';
    if (resultLocation)  resultLocation.textContent  = '—';
    if (resultReference) resultReference.textContent = '—';
    if (resultAmount)    resultAmount.textContent     = 'KES 0';
    if (resultNoteRow)   resultNoteRow.style.display  = 'none';
    if (feeGenInvoiceBtn) feeGenInvoiceBtn.disabled   = true;
    if (feeProceedBtn)    feeProceedBtn.disabled       = true;
  }

  // --- PORTAL SIMULATOR (MERUPAY) LOGIC ---
  const portalTabBtns = document.querySelectorAll('.portal-tab-btn');
  const portalInputLabel = document.getElementById('portal-input-label');
  const portalRefInput = document.getElementById('portal-ref-input');
  const portalSearchForm = document.getElementById('portal-search-form');
  
  // Track selected category in portal (land / SBP / parking)
  let selectedPortalCategory = 'land';
  let activeBill = null;

  portalTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      portalTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      selectedPortalCategory = btn.getAttribute('data-type');
      
      // Update input labels & placeholders dynamically
      if (selectedPortalCategory === 'land') {
        portalInputLabel.textContent = 'Enter Plot Number';
        portalRefInput.placeholder = 'e.g., 123/MERU/2024';
      } else if (selectedPortalCategory === 'permit') {
        portalInputLabel.textContent = 'Enter Business ID / SBP Code';
        portalRefInput.placeholder = 'e.g., SBP-2024-8890';
      } else if (selectedPortalCategory === 'parking') {
        portalInputLabel.textContent = 'Enter Vehicle License Plate';
        portalRefInput.placeholder = 'e.g., KCD 123A';
      }

      // Reset Simulator Terminal state
      resetTerminal();
    });
  });

  // Portal billing search submit
  portalSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = portalRefInput.value.trim();

    if (!query) {
      alert('Please enter a reference code to search.');
      return;
    }

    // Try finding in mock DB
    let bill = null;
    if (mockBills[selectedPortalCategory] && mockBills[selectedPortalCategory][query]) {
      bill = mockBills[selectedPortalCategory][query];
    } else {
      // Fallback: Generate a random bill on-the-fly to keep the simulator working and friendly
      const randomNames = ['Nicholas Kirimi', 'Christine Makena', 'David Murithi', 'Beatrice Kawira', 'Fredrick Gitonga'];
      const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
      
      let itemDesc = '';
      let randAmount = 1000;
      
      if (selectedPortalCategory === 'land') {
        itemDesc = `Plot No. ${query} (Generated Mock Assessment)`;
        randAmount = Math.floor(Math.random() * 8000) + 3000;
      } else if (selectedPortalCategory === 'permit') {
        itemDesc = `Single Business Permit - Reference ${query}`;
        randAmount = Math.floor(Math.random() * 15000) + 5000;
      } else if (selectedPortalCategory === 'parking') {
        itemDesc = `Daily Town Parking - Vehicle ${query}`;
        randAmount = 200;
      }

      bill = {
        owner: randomName,
        item: itemDesc,
        amount: randAmount,
        arrears: Math.random() > 0.6 ? Math.floor(Math.random() * 1500) : 0,
        ref: 'REF-' + Math.floor(Math.random() * 90000 + 10000),
        due: '30 Days'
      };
    }

    activeBill = bill;
    renderBillDetails(bill);
  });

  // Reset simulator terminal
  function resetTerminal() {
    activeBill = null;
    document.querySelectorAll('.terminal-state').forEach(s => s.classList.remove('active'));
    document.getElementById('state-empty').classList.add('active');
  }

  // Render Bill Details in Terminal
  function renderBillDetails(bill) {
    document.querySelectorAll('.terminal-state').forEach(s => s.classList.remove('active'));
    
    const detailsState = document.getElementById('state-details');
    
    // Fill bill details
    document.getElementById('det-ref').textContent = bill.ref;
    document.getElementById('det-owner').textContent = bill.owner;
    document.getElementById('det-item').textContent = bill.item;
    document.getElementById('det-due').textContent = bill.due;
    document.getElementById('det-amount').textContent = 'KES ' + bill.amount.toLocaleString();
    document.getElementById('det-arrears').textContent = 'KES ' + bill.arrears.toLocaleString();
    
    const totalPayable = bill.amount + bill.arrears;
    document.getElementById('det-total').textContent = 'KES ' + totalPayable.toLocaleString();

    // Reset phone input & method selection
    const mpesaBtn = document.getElementById('method-mpesa');
    const mpesaForm = document.getElementById('mpesa-payment-form');
    mpesaBtn.classList.add('selected');
    mpesaForm.style.display = 'block';

    detailsState.classList.add('active');
  }

  // Pay simulator actions (Mpesa push or Card)
  const mpesaMethodBtn = document.getElementById('method-mpesa');
  const cardMethodBtn = document.getElementById('method-card');
  const mpesaPaymentForm = document.getElementById('mpesa-payment-form');
  const phoneNoInput = document.getElementById('portal-phone-no');

  mpesaMethodBtn.addEventListener('click', () => {
    mpesaMethodBtn.classList.add('selected');
    cardMethodBtn.classList.remove('selected');
    mpesaPaymentForm.style.display = 'block';
  });

  cardMethodBtn.addEventListener('click', () => {
    cardMethodBtn.classList.add('selected');
    mpesaMethodBtn.classList.remove('selected');
    mpesaPaymentForm.style.display = 'none';
    alert('Bank/Card checkout is in staging. Please select "M-Pesa Express" for a full functional simulation demo.');
  });

  // Handle trigger simulated STK push
  mpesaPaymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const phone = phoneNoInput.value.trim();

    if (!phone || !/^0(7|1)\d{8}$/.test(phone)) {
      alert('Please enter a valid Kenyan Safaricom phone number (e.g. 0712345678).');
      return;
    }

    triggerSTKPushSimulation(phone);
  });

  function triggerSTKPushSimulation(phone) {
    document.querySelectorAll('.terminal-state').forEach(s => s.classList.remove('active'));
    
    const processingState = document.getElementById('state-processing');
    processingState.querySelector('p').textContent = `Initiating secure connection. Sending STK Push to ${phone}...`;
    processingState.classList.add('active');

    // Step 2: Show Mock Phone STK Push Popup after 1.8 seconds
    setTimeout(() => {
      document.querySelectorAll('.terminal-state').forEach(s => s.classList.remove('active'));
      
      const stkbillingState = document.getElementById('state-stk-push');
      stkbillingState.classList.add('active');
      
      // Update phone mockup fields
      const totalAmount = activeBill.amount + activeBill.arrears;
      document.getElementById('phone-amount').textContent = totalAmount.toLocaleString();
      document.getElementById('phone-ref').textContent = activeBill.ref;
      
      // Reset Pin input and setup events
      const pinInput = document.getElementById('phone-pin-input');
      pinInput.value = '';
      pinInput.focus();

      // Reset countdown bar
      const progress = document.querySelector('.countdown-progress');
      // Force repaint to reset animation
      progress.style.animation = 'none';
      progress.offsetHeight; // trigger reflow
      progress.style.animation = 'countdown 15s linear forwards';

      // Setup actions
      const sendBtn = document.getElementById('phone-send-btn');
      const cancelBtn = document.getElementById('phone-cancel-btn');
      
      // Clear old event listeners
      const newSendBtn = sendBtn.cloneNode(true);
      const newCancelBtn = cancelBtn.cloneNode(true);
      sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);
      cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

      // Timeout handler (STK cancelled if user does not respond in 15 seconds)
      const stkTimeout = setTimeout(() => {
        alert('Payment session timed out. Please try again.');
        renderBillDetails(activeBill);
      }, 15000);

      newCancelBtn.addEventListener('click', () => {
        clearTimeout(stkTimeout);
        alert('Payment cancelled by user.');
        renderBillDetails(activeBill);
      });

      newSendBtn.addEventListener('click', () => {
        const pin = pinInput.value;
        if (pin.length < 4) {
          alert('Please enter a 4-digit M-Pesa PIN.');
          return;
        }
        
        clearTimeout(stkTimeout);
        
        // Step 3: Processing payment status
        document.querySelectorAll('.terminal-state').forEach(s => s.classList.remove('active'));
        processingState.querySelector('p').textContent = 'Confirming payment receipt from Safaricom API...';
        processingState.classList.add('active');

        // Step 4: Show Successful Receipt
        setTimeout(() => {
          document.querySelectorAll('.terminal-state').forEach(s => s.classList.remove('active'));
          
          const receiptState = document.getElementById('state-success');
          
          // Generate transaction receipt code
          const receiptCode = 'MCRB' + Math.random().toString(36).substring(2, 8).toUpperCase() + Math.floor(Math.random() * 10);
          const totalPayable = activeBill.amount + activeBill.arrears;
          
          // Set UI receipt details
          document.getElementById('rec-code').textContent = receiptCode;
          document.getElementById('rec-ref').textContent = activeBill.ref;
          document.getElementById('rec-owner').textContent = activeBill.owner;
          document.getElementById('rec-desc').textContent = activeBill.item;
          document.getElementById('rec-total').textContent = 'KES ' + totalPayable.toLocaleString();
          
          const now = new Date();
          document.getElementById('rec-date').textContent = now.toLocaleString();
          
          receiptState.classList.add('active');

          // Trigger confetti or checkmark animation scale
          if (window.lucide) {
            window.lucide.createIcons();
          }
        }, 2200);
      });
    }, 1800);
  }

  // Receipt Buttons
  document.getElementById('btn-receipt-new').addEventListener('click', () => {
    portalRefInput.value = '';
    resetTerminal();
  });

  document.getElementById('btn-receipt-download').addEventListener('click', () => {
    window.print();
  });

  // --- FAQS ACCORDION LOGIC ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(i => i.classList.remove('active'));
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // --- CONTACT FORM SUBMIT ---
  const contactForm = document.getElementById('mcrb-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        alert('Please fill out all fields in the contact form.');
        return;
      }

      alert(`Thank you, ${name}! Your message has been sent successfully. Our support desk will reply to ${email} shortly.`);
      contactForm.reset();
    });
  }

  // --- CHATBOT support WIDGET LOGIC ---
  const chatTrigger = document.getElementById('chatbot-trigger');
  const chatWindow = document.getElementById('chatbot-window');
  const chatBody = document.getElementById('chatbot-body');
  const chatInput = document.getElementById('chatbot-input');
  const chatSendBtn = document.getElementById('chatbot-send-btn');
  const chatOptionBtns = document.querySelectorAll('.chat-option-btn');

  // Toggle open / close
  chatTrigger.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
    chatTrigger.classList.toggle('active');
    
    // Dynamic icon toggle inside trigger
    if (chatTrigger.classList.contains('active')) {
      chatTrigger.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
    } else {
      chatTrigger.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
    }
  });

  // Options Quick Questions
  chatOptionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const questionText = btn.textContent;
      appendUserMessage(questionText);
      generateBotResponse(questionText);
    });
  });

  // Sending manual message
  chatSendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  function sendMessage() {
    const messageText = chatInput.value.trim();
    if (!messageText) return;

    appendUserMessage(messageText);
    chatInput.value = '';
    
    generateBotResponse(messageText);
  }

  function appendUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', 'user');
    msgDiv.textContent = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function appendBotMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', 'bot');
    msgDiv.innerHTML = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function generateBotResponse(userMsg) {
    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('chat-message', 'bot', 'typing-indicator');
    typingIndicator.innerHTML = '<em>Revenue Assistant is typing…</em>';
    chatBody.appendChild(typingIndicator);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Try Claude API first, fallback to keyword matching
    callClaudeAPI(userMsg)
      .then(responseText => {
        if (typingIndicator.parentNode) typingIndicator.parentNode.removeChild(typingIndicator);
        appendBotMessage(responseText);
      })
      .catch(() => {
        // Fallback to keyword matching if API unavailable
        const fallback = keywordFallback(userMsg);
        if (typingIndicator.parentNode) typingIndicator.parentNode.removeChild(typingIndicator);
        appendBotMessage(fallback);
      });
  }

  async function callClaudeAPI(userMsg) {
    // NOTE: For production, proxy this through your backend to protect the API key.
    // For demo/prototype: Set your Anthropic API key below.
    const API_KEY = ''; // ← Paste your Anthropic API key here for live AI responses

    if (!API_KEY) throw new Error('No API key set');

    const systemPrompt = `You are a helpful, friendly customer support assistant for the Meru County Revenue Board (MCRB) in Kenya.
You help residents, traders, and businesses with questions about:
- Single Business Permits (SBP) — due Dec 31, fees based on sector/size/zone, paid via M-Pesa Paybill 440112
- Land rates — due March 31, 1% monthly penalty, waiver periods announced periodically
- Agricultural produce cess — on Miraa, Tea, Coffee, Avocado etc, via cashless weighbridges
- Parking fees — Motorbike KES 20/day, Car/Taxi KES 50/day, Matatu KES 100/day, Bus KES 200/day, Lorry KES 250/day, Trailer KES 300/day (uniform county-wide, Finance Act 2019 S.3). Monthly seasonal tickets available. Un-designated parking = KES 10,000 fine. Dial *412#
- Market fees, outdoor advertising, slaughter fees, house rent, way leave charges
- Payment methods: M-Pesa Paybill 440112, USSD *412#, self-service portal
- Contact: Mt Kenya House, Makutano Junction, Meru Town. info@merurevenue.go.ke
- Revenue performance: KES 1.15B collected 2024-25, target KES 2B
- 100% cashless — no cash accepted at offices
Keep answers concise (3–5 sentences max), warm, and in plain language. If unsure, direct them to info@merurevenue.go.ke.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMsg }]
      })
    });

    if (!response.ok) throw new Error('API call failed');
    const data = await response.json();
    return data.content[0].text;
  }

  function keywordFallback(userMsg) {
    const query = userMsg.toLowerCase();
    if (query.includes('hello') || query.includes('hi ') || query.includes('hey')) {
      return "Hello! I'm your Meru County Revenue Board assistant. How can I help you with your tax, land rates, or permit enquiries today?";
    } else if (query.includes('paybill') || query.includes('how to pay') || query.includes('payment')) {
      return "You can pay via M-Pesa Paybill <strong>440112</strong> or by dialing <strong>*412#</strong>. Online, use the MeruPay Portal on this site. All payments are cashless — no cash accepted at county offices.";
    } else if (query.includes('permit') || query.includes('sbp') || query.includes('license') || query.includes('business')) {
      return "All businesses in Meru County must renew their Single Business Permit (SBP) annually by <strong>December 31st</strong>. Use the Fee Calculator tab to estimate your cost, then pay via MeruPay.";
    } else if (query.includes('land') || query.includes('rates') || query.includes('plot')) {
      return "Land rates are due by <strong>March 31st</strong> every year. Arrears attract 1% monthly interest. Search your plot number on the Self-Service Portal tab to see your outstanding balance and pay.";
    } else if (query.includes('parking')) {
      return "Daily parking fees (county-wide): Motorbike <strong>KES 20</strong>, Saloon Car/Taxi <strong>KES 50</strong>, Matatu <strong>KES 100</strong>, Bus <strong>KES 200</strong>, Lorry <strong>KES 250</strong>, Trailer <strong>KES 300</strong>. Monthly seasonal tickets also available. Pay via <strong>*412#</strong> or MeruPay Portal. Note: un-designated parking attracts a <strong>KES 10,000 fine</strong>. (Source: Finance Act 2019, Section 3)";
    } else if (query.includes('cess') || query.includes('miraa') || query.includes('tea') || query.includes('produce')) {
      return "Agricultural produce cess is levied on goods like Miraa, Tea, Coffee, and Avocado moving through county borders, collected cashlessly at weighbridges under the Agricultural Produce Act.";
    } else if (query.includes('contact') || query.includes('phone') || query.includes('email') || query.includes('where')) {
      return "📍 Mt Kenya House, Makutano Junction, Meru Town.<br>📞 +254 700 000 000<br>✉️ info@merurevenue.go.ke<br>🕒 Mon–Fri, 8:00 AM – 5:00 PM";
    } else if (query.includes('waiver') || query.includes('penalty') || query.includes('arrears')) {
      return "The County Government occasionally announces penalty waivers on land rates and permit arrears. Watch the Announcements section on the Home page for current waiver windows. Outside waiver periods, penalties continue to accrue.";
    } else if (query.includes('receipt') || query.includes('proof')) {
      return "After payment, a digital receipt is generated instantly on screen which you can print or download. You also receive an SMS confirmation. Keep your M-Pesa transaction code as backup proof.";
    } else {
      return "I couldn't fully understand that, but our team is happy to help! Reach us at <strong>info@merurevenue.go.ke</strong> or visit Mt Kenya House, Makutano, Meru Town — open Mon–Fri, 8AM–5PM.";
    }
  }
});

/* ==================== ACCESSIBILITY WIDGET ==================== */
document.addEventListener("DOMContentLoaded", () => {
  const fab = document.getElementById("accessibility-fab");
  const panel = document.getElementById("accessibility-menu");
  const closeBtn = document.getElementById("accessibility-close");
  const btnContrast = document.getElementById("a11y-contrast");
  const btnIncrease = document.getElementById("a11y-font-increase");
  const btnDecrease = document.getElementById("a11y-font-decrease");
  const btnLinks = document.getElementById("a11y-links");
  const btnReset = document.getElementById("a11y-reset");
  const fontValueLabel = document.getElementById("a11y-font-value");

  if (!fab || !panel) return;

  let currentFontSize = 100;

  const togglePanel = () => {
    const isOpen = panel.classList.toggle("active");
    panel.setAttribute("aria-hidden", !isOpen);
    fab.setAttribute("aria-expanded", isOpen);
  };

  fab.addEventListener("click", togglePanel);
  if (closeBtn) closeBtn.addEventListener("click", togglePanel);

  // High Contrast toggle
  if (btnContrast) {
    btnContrast.addEventListener("click", () => {
      const isActive = document.body.classList.toggle("a11y-high-contrast");
      btnContrast.setAttribute("data-active", isActive);
    });
  }

  // Text Size
  const applyFontSize = () => {
    document.documentElement.style.fontSize = `${currentFontSize}%`;
    if (fontValueLabel) fontValueLabel.textContent = `${currentFontSize}%`;
  };

  if (btnIncrease) {
    btnIncrease.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentFontSize < 150) { currentFontSize += 10; applyFontSize(); }
    });
  }

  if (btnDecrease) {
    btnDecrease.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentFontSize > 80) { currentFontSize -= 10; applyFontSize(); }
    });
  }

  // Highlight Links toggle
  if (btnLinks) {
    btnLinks.addEventListener("click", () => {
      const isActive = document.body.classList.toggle("a11y-links-highlighted");
      btnLinks.setAttribute("data-active", isActive);
    });
  }

  // Reset all settings
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      document.body.classList.remove("a11y-high-contrast", "a11y-links-highlighted");
      currentFontSize = 100;
      applyFontSize();
      if (btnContrast) btnContrast.setAttribute("data-active", "false");
      if (btnLinks) btnLinks.setAttribute("data-active", "false");
    });
  }

  // Close panel when clicking outside
  document.addEventListener("click", (e) => {
    if (panel.classList.contains("active") && !panel.contains(e.target) && !fab.contains(e.target)) {
      togglePanel();
    }
  });
});

