document.addEventListener('DOMContentLoaded', function() {
  console.log('App loaded successfully!');
  
  // --- STATE ---
  let currentTheme = localStorage.getItem('theme') || 'light';
  let isAuthenticated = false;
  const protectedViews = ['portal'];
  
  // Store current payment data
  let currentPaymentItem = null;
  let currentPaymentName = null;
  
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
      }
    }
  };

  // Helper function to check if service has renewal fees
  function hasRenewalFee(itemData) {
    return itemData.renewal !== undefined && Object.keys(itemData.renewal).length > 0;
  }

  // Function to get fee amount based on location and type
  function getFeeAmount(itemData, location, type) {
    let amount = 0;
    
    if (location === 'all') {
      if (type === 'renewal' && itemData.renewal && itemData.renewal.all) {
        amount = itemData.renewal.all;
      } else if (itemData.fees && itemData.fees.all) {
        amount = itemData.fees.all;
      }
      return amount;
    }
    
    if (type === 'renewal' && itemData.renewal) {
      if (itemData.renewal.all) {
        amount = itemData.renewal.all;
      } else if (location && itemData.renewal[location]) {
        amount = itemData.renewal[location];
      } else if (itemData.fees && itemData.fees[location]) {
        amount = itemData.fees[location];
      }
    } else {
      if (itemData.fees && itemData.fees.all) {
        amount = itemData.fees.all;
      } else if (itemData.fees && location && itemData.fees[location]) {
        amount = itemData.fees[location];
      }
    }
    
    return amount;
  }

  // --- COMPLETE SERVICES DATA WITH FINANCE ACT 2019 FEES ---
  const categoryServicesData = {
    business: {
      title: "Business & Trade Services",
      items: [
        { name: "Single Business Permit (SBP) - Small Trader", fees: { meru: 3400, maua: 2000, nkubu: 2000, other: 2000 }, renewal: { meru: 2000, maua: 1000, nkubu: 1000, other: 1000 }, locations: ["meru", "maua", "nkubu", "other"] },
        { name: "Single Business Permit (SBP) - Medium Trader", fees: { meru: 7000, maua: 4000, nkubu: 4000, other: 4000 }, renewal: { meru: 4000, maua: 2500, nkubu: 2500, other: 2500 }, locations: ["meru", "maua", "nkubu", "other"] },
        { name: "Single Business Permit (SBP) - Large Trader", fees: { meru: 14000, maua: 10000, nkubu: 10000, other: 8000 }, renewal: { meru: 7000, maua: 5000, nkubu: 5000, other: 4000 }, locations: ["meru", "maua", "nkubu", "other"] },
        { name: "Single Business Permit (SBP) - Mega Store", fees: { meru: 50000, maua: 30000, nkubu: 30000, other: 24000 }, renewal: { meru: 25000, maua: 15000, nkubu: 15000, other: 12000 }, locations: ["meru", "maua", "nkubu", "other"] },
        { name: "Kiosk License", fees: { meru: 2700, maua: 1600, nkubu: 1600, other: 1500 }, renewal: { meru: 1350, maua: 800, nkubu: 800, other: 750 }, locations: ["meru", "maua", "nkubu", "other"] },
        { name: "Hawker Permit (with vehicle)", fees: { meru: 3500, maua: 2000, nkubu: 2000, other: 2000 }, renewal: { meru: 1750, maua: 1000, nkubu: 1000, other: 1000 }, locations: ["meru", "maua", "nkubu", "other"] },
        { name: "Sublet of Business Premises", fees: { meru: 2000, maua: 2000, nkubu: 2000, other: 2000 }, locations: ["meru", "maua", "nkubu", "other"] },
        { name: "Change of Business Activity", fees: { meru: 2000, maua: 2000, nkubu: 2000, other: 2000 }, locations: ["meru", "maua", "nkubu", "other"] }
      ]
    },
    transport: {
      title: "Transport & Parking Services (Finance Act 2019 - Section 3)",
      items: [
        { name: "Motor Bike Parking (Daily)", fees: { all: 20 }, locations: ["all"] },
        { name: "Saloon Car / Taxi Parking (Daily)", fees: { all: 50 }, locations: ["all"] },
        { name: "Matatu (10-14 Seater) Parking (Daily)", fees: { all: 100 }, locations: ["all"] },
        { name: "Bus (30-62 Seater) Parking (Daily)", fees: { all: 200 }, locations: ["all"] },
        { name: "Lorry Parking (Daily)", fees: { all: 250 }, locations: ["all"] },
        { name: "Trailer Parking (Daily)", fees: { all: 300 }, locations: ["all"] },
        { name: "Parking in Un-designated Areas (Fine)", fees: { all: 10000 }, locations: ["all"] },
        { name: "Vehicle Impounding Fee", fees: { all: 3000 }, locations: ["all"] }
      ]
    },
    land: {
      title: "Land & Property Services (Finance Act 2019 - Eighth Schedule)",
      items: [
        { name: "Plot Boundary Indication Fee", fees: { all: 500 }, locations: ["all"] },
        { name: "Plot Demarcation Fee", fees: { all: 3000 }, locations: ["all"] },
        { name: "Occupation Permit", fees: { all: 4000 }, locations: ["all"] },
        { name: "Change of User (Leasehold)", fees: { all: 20000 }, locations: ["all"] },
        { name: "Consent for Transfer/Sub-division", fees: { all: 6000 }, locations: ["all"] },
        { name: "Rates Clearance Certificate", fees: { all: 4000 }, locations: ["all"] }
      ]
    },
    health: {
      title: "Health & Licensing Services (Finance Act 2019 - Eleventh Schedule)",
      items: [
        { name: "Food Hygiene License - Retail Shop", fees: { all: 300 }, renewal: { all: 300 }, locations: ["all"] },
        { name: "Food Hygiene License - Butchery", fees: { all: 600 }, renewal: { all: 600 }, locations: ["all"] },
        { name: "Food Hygiene License - Bakery", fees: { all: 3000 }, renewal: { all: 3000 }, locations: ["all"] },
        { name: "Food Hygiene License - Supermarket", fees: { all: 5000 }, renewal: { all: 5000 }, locations: ["all"] },
        { name: "Health Clearance - Hotel/Restaurant", fees: { all: 6000 }, renewal: { all: 6000 }, locations: ["all"] },
        { name: "Medical Clinic Registration", fees: { all: 4000 }, renewal: { all: 2000 }, locations: ["all"] },
        { name: "Pharmacy/Chemist Registration", fees: { all: 4000 }, renewal: { all: 2000 }, locations: ["all"] },
        { name: "Vaccination - Yellow Fever", fees: { all: 1000 }, locations: ["all"] }
      ]
    },
    agriculture: {
      title: "Agriculture & Cess Services (Finance Act 2019 - Part III of Second Schedule)",
      items: [
        { name: "Cabbages Cess (per 50kg bag)", fees: { all: 20 }, locations: ["all"] },
        { name: "Bananas Cess (per bunch)", fees: { all: 20 }, locations: ["all"] },
        { name: "Miraa Cess - Pick-up", fees: { all: 1000 }, locations: ["all"] },
        { name: "Miraa Cess - Lorry/Bus", fees: { all: 2000 }, locations: ["all"] },
        { name: "Charcoal Cess (per bag)", fees: { all: 20 }, locations: ["all"] },
        { name: "Timber Transport - Pick-up", fees: { all: 500 }, locations: ["all"] },
        { name: "Timber Transport - Trailer", fees: { all: 5000 }, locations: ["all"] },
        { name: "Meat Inspection - Cattle (per head)", fees: { all: 100 }, locations: ["all"] },
        { name: "Slaughterhouse License (Category A)", fees: { all: 6000 }, locations: ["all"] }
      ]
    },
    construction: {
      title: "Construction & Building Services (Finance Act 2019 - Sixth Schedule)",
      items: [
        { name: "Building Plan Approval (0-46m²)", fees: { all: 1000 }, locations: ["all"] },
        { name: "Building Plan Approval (46-93m²)", fees: { all: 2000 }, locations: ["all"] },
        { name: "Building Plan Approval (93-140m²)", fees: { all: 3000 }, locations: ["all"] },
        { name: "Building Plan Approval (140-186m²)", fees: { all: 4000 }, locations: ["all"] },
        { name: "Building Plan Approval (186-279m²)", fees: { all: 5000 }, locations: ["all"] },
        { name: "Building Inspection - Structural", fees: { all: 4000 }, locations: ["all"] },
        { name: "Fine for Late Submission of Plans", fees: { all: 3500 }, locations: ["all"] }
      ]
    },
    alcohol: {
      title: "Alcohol Licenses (Finance Act 2019 - Part IV)",
      items: [
        { name: "General Retail License (Meru/Maua)", fees: { meru: 35000, maua: 35000 }, renewal: { meru: 30000, maua: 30000 }, locations: ["meru", "maua"] },
        { name: "General Retail License (Nkubu/Other)", fees: { nkubu: 20000, other: 20000 }, renewal: { nkubu: 15000, other: 15000 }, locations: ["nkubu", "other"] },
        { name: "Bar & Restaurant License (Meru/Maua)", fees: { meru: 45000, maua: 45000 }, renewal: { meru: 40000, maua: 40000 }, locations: ["meru", "maua"] },
        { name: "Bar & Restaurant License (Nkubu/Other)", fees: { nkubu: 35000, other: 35000 }, renewal: { nkubu: 30000, other: 30000 }, locations: ["nkubu", "other"] },
        { name: "Night Club License (Meru/Maua)", fees: { meru: 105000, maua: 105000 }, renewal: { meru: 100000, maua: 100000 }, locations: ["meru", "maua"] },
        { name: "Night Club License (Nkubu/Other)", fees: { nkubu: 55000, other: 55000 }, renewal: { nkubu: 50000, other: 50000 }, locations: ["nkubu", "other"] },
        { name: "Wines & Spirits Retail", fees: { meru: 29000, maua: 29000, nkubu: 20000, other: 20000 }, renewal: { meru: 24000, maua: 24000, nkubu: 15000, other: 15000 }, locations: ["meru", "maua", "nkubu", "other"] },
        { name: "Temporary License", fees: { all: 11000 }, locations: ["all"] }
      ]
    },
    waste: {
      title: "Waste Management Services (Finance Act 2019 - Fourth Schedule)",
      items: [
        { name: "Small Business Refuse", fees: { meru: 2000, maua: 1000, nkubu: 1000, other: 1000 }, locations: ["meru", "maua", "nkubu", "other"] },
        { name: "Medium Business Refuse", fees: { meru: 5000, maua: 2000, nkubu: 2000, other: 2000 }, locations: ["meru", "maua", "nkubu", "other"] },
        { name: "Large Business Refuse", fees: { meru: 15000, maua: 3000, nkubu: 3000, other: 3000 }, locations: ["meru", "maua", "nkubu", "other"] },
        { name: "Residential Refuse (per annum)", fees: { meru: 7000, maua: 1000, nkubu: 1000, other: 1000 }, locations: ["meru", "maua", "nkubu", "other"] },
        { name: "Illegal Dumping Fine", fees: { all: 50000 }, locations: ["all"] }
      ]
    }
  };

  // --- CALCULATOR INITIALIZATION ---
  function initCalculator() {
    const categorySelect = document.getElementById('serviceCategory');
    const specificServiceSelect = document.getElementById('specificService');
    const locationSelect = document.getElementById('calcLocation');
    const appTypeSelect = document.getElementById('appType');
    const calculateBtn = document.getElementById('calculateFeeBtn');
    const resultService = document.getElementById('resultService');
    const resultAmount = document.getElementById('resultAmount');
    const resultLocation = document.getElementById('resultLocation');
    const resultType = document.getElementById('resultType');
    const feeProceedBtn = document.getElementById('feeProceedBtn');
    
    if (!categorySelect) {
      console.log('Calculator elements not found');
      return;
    }
    
    let currentServiceData = null;
    let currentServiceName = null;
    
    const servicesByCategory = {
      business: categoryServicesData.business.items,
      transport: categoryServicesData.transport.items,
      land: categoryServicesData.land.items,
      health: categoryServicesData.health.items,
      agriculture: categoryServicesData.agriculture.items,
      construction: categoryServicesData.construction.items,
      alcohol: categoryServicesData.alcohol.items,
      waste: categoryServicesData.waste.items
    };
    
    categorySelect.addEventListener('change', function() {
      const category = this.value;
      const specificGroup = document.getElementById('specificServiceGroup');
      const locationGroup = document.getElementById('calcLocationGroup');
      const appTypeGroup = document.getElementById('appTypeGroup');
      const calcButtonGroup = document.getElementById('calcButtonGroup');
      
      if (!category) {
        if (specificGroup) specificGroup.style.display = 'none';
        if (locationGroup) locationGroup.style.display = 'none';
        if (appTypeGroup) appTypeGroup.style.display = 'none';
        if (calcButtonGroup) calcButtonGroup.style.display = 'none';
        if (specificServiceSelect) specificServiceSelect.innerHTML = '<option value="">-- First select a category --</option>';
        if (resultService) resultService.textContent = '—';
        if (resultAmount) resultAmount.textContent = 'KES 0';
        if (resultLocation) resultLocation.textContent = '—';
        if (resultType) resultType.textContent = '—';
        if (feeProceedBtn) feeProceedBtn.disabled = true;
        return;
      }
      
      const services = servicesByCategory[category];
      if (services && specificServiceSelect) {
        specificServiceSelect.innerHTML = '<option value="">-- Select a service --</option>';
        services.forEach(service => {
          const option = document.createElement('option');
          option.value = service.name;
          option.textContent = service.name;
          option.setAttribute('data-service', JSON.stringify(service));
          specificServiceSelect.appendChild(option);
        });
        if (specificGroup) specificGroup.style.display = 'block';
        if (locationGroup) locationGroup.style.display = 'none';
        if (appTypeGroup) appTypeGroup.style.display = 'none';
        if (calcButtonGroup) calcButtonGroup.style.display = 'none';
        if (resultService) resultService.textContent = '—';
        if (resultAmount) resultAmount.textContent = 'KES 0';
        if (resultLocation) resultLocation.textContent = '—';
        if (resultType) resultType.textContent = '—';
        if (feeProceedBtn) feeProceedBtn.disabled = true;
      }
    });
    
    specificServiceSelect.addEventListener('change', function() {
      const selectedOption = this.options[this.selectedIndex];
      const serviceDataAttr = selectedOption.getAttribute('data-service');
      
      if (!serviceDataAttr) {
        const locationGroup = document.getElementById('calcLocationGroup');
        const appTypeGroup = document.getElementById('appTypeGroup');
        const calcButtonGroup = document.getElementById('calcButtonGroup');
        if (locationGroup) locationGroup.style.display = 'none';
        if (appTypeGroup) appTypeGroup.style.display = 'none';
        if (calcButtonGroup) calcButtonGroup.style.display = 'none';
        if (resultAmount) resultAmount.textContent = 'KES 0';
        if (resultLocation) resultLocation.textContent = '—';
        if (resultType) resultType.textContent = '—';
        if (feeProceedBtn) feeProceedBtn.disabled = true;
        return;
      }
      
      currentServiceData = JSON.parse(serviceDataAttr);
      currentServiceName = currentServiceData.name;
      if (resultService) resultService.textContent = currentServiceName;
      
      const availableLocations = currentServiceData.locations || ['meru', 'maua', 'nkubu', 'other'];
      if (locationSelect) {
        locationSelect.innerHTML = '<option value="">-- Select Location --</option>';
        if (availableLocations.includes('meru')) locationSelect.innerHTML += '<option value="meru">Meru Town (CBD)</option>';
        if (availableLocations.includes('maua')) locationSelect.innerHTML += '<option value="maua">Maua Town</option>';
        if (availableLocations.includes('nkubu')) locationSelect.innerHTML += '<option value="nkubu">Nkubu Town</option>';
        if (availableLocations.includes('other')) locationSelect.innerHTML += '<option value="other">Other Sub-Counties</option>';
        if (availableLocations.includes('all')) locationSelect.innerHTML += '<option value="all">County-Wide (Flat Rate)</option>';
        const locationGroup = document.getElementById('calcLocationGroup');
        if (locationGroup) locationGroup.style.display = 'block';
      }
      
      const hasRenewal = hasRenewalFee(currentServiceData);
      const appTypeGroup = document.getElementById('appTypeGroup');
      if (appTypeGroup) {
        if (hasRenewal) {
          appTypeGroup.style.display = 'block';
          if (appTypeSelect) {
            appTypeSelect.disabled = false;
            appTypeSelect.innerHTML = '<option value="new">New Application</option><option value="renewal">Renewal</option>';
          }
        } else {
          appTypeGroup.style.display = 'none';
        }
      }
      
      const calcButtonGroup = document.getElementById('calcButtonGroup');
      if (calcButtonGroup) calcButtonGroup.style.display = 'none';
      
      if (resultAmount) resultAmount.textContent = 'KES 0';
      if (resultLocation) resultLocation.textContent = '—';
      if (resultType) resultType.textContent = '—';
      if (feeProceedBtn) feeProceedBtn.disabled = true;
      
      if (locationSelect && locationSelect.options.length === 2) {
        locationSelect.value = 'all';
        locationSelect.dispatchEvent(new Event('change'));
      }
    });
    
    locationSelect.addEventListener('change', function() {
      const calcButtonGroup = document.getElementById('calcButtonGroup');
      if (this.value) {
        if (calcButtonGroup) calcButtonGroup.style.display = 'block';
        autoCalculateFee();
      } else {
        if (calcButtonGroup) calcButtonGroup.style.display = 'none';
        if (resultAmount) resultAmount.textContent = 'KES 0';
        if (resultLocation) resultLocation.textContent = '—';
        if (resultType) resultType.textContent = '—';
        if (feeProceedBtn) feeProceedBtn.disabled = true;
      }
    });
    
    calculateBtn.addEventListener('click', function() {
      autoCalculateFee();
    });
    
    function autoCalculateFee() {
      const location = locationSelect ? locationSelect.value : '';
      const appType = appTypeSelect ? appTypeSelect.value : 'new';
      
      if (!location) {
        alert('Please select a location');
        return;
      }
      if (!currentServiceData) {
        alert('Please select a service first');
        return;
      }
      if (!currentServiceData.fees) {
        alert('Fee information not available for this service.');
        return;
      }
      
      const amount = getFeeAmount(currentServiceData, location, appType);
      
      if (amount === 0 || amount === '0') {
        alert('Fee information not available for this combination.');
        return;
      }
      
      const locationText = locationSelect.options[locationSelect.selectedIndex]?.text || location;
      const typeText = (appTypeSelect && appTypeSelect.options[appTypeSelect.selectedIndex]) 
        ? appTypeSelect.options[appTypeSelect.selectedIndex].text 
        : 'New Application';
      
      if (resultAmount) resultAmount.textContent = `KES ${amount.toLocaleString()}`;
      if (resultLocation) resultLocation.textContent = locationText;
      if (resultType) resultType.textContent = typeText;
      if (feeProceedBtn) {
        feeProceedBtn.disabled = false;
        feeProceedBtn.setAttribute('data-amount', amount);
        feeProceedBtn.setAttribute('data-desc', currentServiceName);
        feeProceedBtn.setAttribute('data-location', location);
        feeProceedBtn.setAttribute('data-type', appType);
        feeProceedBtn.setAttribute('data-location-text', locationText);
        feeProceedBtn.setAttribute('data-type-text', typeText);
      }
    }
    
    feeProceedBtn.addEventListener('click', function() {
      const amount = this.getAttribute('data-amount');
      const desc = this.getAttribute('data-desc');
      const locationText = this.getAttribute('data-location-text');
      const typeText = this.getAttribute('data-type-text');
      
      if (!amount) {
        alert('Please calculate the fee first.');
        return;
      }
      
      const confirmMsg = `Payment Details:\n\nService: ${desc}\nLocation: ${locationText}\nType: ${typeText}\nAmount: KES ${parseInt(amount).toLocaleString()}\n\nProceed to MeruPay Portal?`;
      
      if (confirm(confirmMsg)) {
        const customBill = {
          owner: 'Customer',
          item: `${desc} (${locationText} - ${typeText})`,
          amount: parseInt(amount),
          arrears: 0,
          ref: 'CALC-' + Math.floor(Math.random() * 90000 + 10000),
          due: 'Immediate'
        };
        mockBills['permit']['CUSTOM-CALC'] = customBill;
        switchView('portal');
        setTimeout(() => {
          const portalRefInput = document.getElementById('portal-ref-input');
          if (portalRefInput) portalRefInput.value = 'CUSTOM-CALC';
          const portalSearchForm = document.getElementById('portal-search-form');
          if (portalSearchForm) portalSearchForm.dispatchEvent(new Event('submit'));
        }, 100);
      }
    });
  }

  // ==================== PORTAL PAYMENT MODAL FUNCTIONS ====================
  window.openPortalPaymentModal = function(serviceName, appType, location, reference, amount) {
    console.log('Opening payment modal:', serviceName, amount);
    
    document.getElementById('modal-service-name').textContent = serviceName || 'Service';
    document.getElementById('modal-app-type').textContent = appType || 'New Application';
    document.getElementById('modal-location').textContent = location || 'Meru Town';
    document.getElementById('modal-reference').textContent = reference || 'N/A';
    document.getElementById('modal-amount').textContent = `KES ${parseInt(amount || 0).toLocaleString()}`;
    
    const modal = document.getElementById('portal-payment-modal');
    if (modal) {
      modal.style.display = 'flex';
      modal.classList.add('active');
    }
  };

  window.closePortalPaymentModal = function() {
    const modal = document.getElementById('portal-payment-modal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('active');
    }
  };

  window.confirmPortalPayment = function() {
    const phoneInput = document.getElementById('portal-payment-phone');
    const phone = phoneInput ? phoneInput.value.trim() : '';
    
    if (!phone) {
      alert('Please enter your M-Pesa phone number.');
      return;
    }
    
    if (!/^0(7|1)\d{8}$/.test(phone)) {
      alert('Please enter a valid Kenyan phone number (e.g., 0712345678).');
      return;
    }
    
    const serviceName = document.getElementById('modal-service-name').textContent;
    const amountText = document.getElementById('modal-amount').textContent;
    const amount = parseInt(amountText.replace(/[^0-9]/g, '')) || 0;
    
    alert(`Payment Initiated!\n\nService: ${serviceName}\nAmount: KES ${amount.toLocaleString()}\nPhone: ${phone}\n\nSTK push sent to your phone. Please enter your PIN to complete.`);
    
    closePortalPaymentModal();
    
    const portalRefInput = document.getElementById('portal-ref-input');
    if (portalRefInput) portalRefInput.value = '';
    const portalService = document.getElementById('portal-service');
    if (portalService) portalService.value = '';
    
    document.querySelectorAll('.terminal-state').forEach(s => s.classList.remove('active'));
    const emptyState = document.getElementById('state-empty');
    if (emptyState) emptyState.classList.add('active');
  };

  // ==================== PORTAL AUTO-CALCULATE WITH FINANCE ACT FEES ====================
  function initPortalCalculator() {
    const serviceSelect = document.getElementById('portal-service');
    const appTypeSelect = document.getElementById('portal-app-type');
    const locationSelect = document.getElementById('portal-location');
    const refInput = document.getElementById('portal-ref-input');
    const payBtn = document.getElementById('portal-pay-btn');
    const previewDiv = document.getElementById('portal-bill-preview');
    const appTypeGroup = document.getElementById('portal-app-type-group');
    
    // Service renewal mapping based on Finance Act 2019
    const serviceRenewalMap = {
      'sbp-small': true, 'sbp-medium': true, 'sbp-large': true, 'sbp-mega': true,
      'kiosk': true, 'hawker': true,
      'sublet': false, 'change-activity': false,
      'parking-moto': false, 'parking-car': false, 'parking-matatu': false,
      'parking-bus': false, 'parking-lorry': false, 'parking-trailer': false,
      'parking-fine': false, 'impounding': false,
      'plot-boundary': false, 'plot-demarcation': false, 'occupation-permit': false,
      'change-user': false, 'consent-transfer': false, 'clearance-cert': false,
      'food-retail': true, 'food-butchery': true, 'food-bakery': true,
      'food-supermarket': true, 'health-hotel': true,
      'medical-clinic': true, 'pharmacy': true, 'vaccination': false,
      'cabbages': false, 'bananas': false, 'miraa-pickup': false,
      'miraa-lorry': false, 'charcoal': false, 'timber-pickup': false,
      'timber-trailer': false, 'meat-cattle': false, 'slaughter': true,
      'building-46': false, 'building-93': false, 'building-140': false,
      'building-186': false, 'building-279': false, 'building-structural': false,
      'late-submission': false,
      'alcohol-retail-meru': true, 'alcohol-retail-other': true,
      'alcohol-bar-meru': true, 'alcohol-bar-other': true,
      'alcohol-night-meru': true, 'alcohol-night-other': true,
      'wines-spirits': true, 'temporary-license': false,
      'waste-small': false, 'waste-medium': false, 'waste-large': false,
      'waste-residential': false, 'illegal-dumping': false
    };
    
    // Finance Act 2019 fee mapping with renewal fees
    const portalServiceFees = {
      // Business & Trade - Finance Act 2019, Thirteenth Schedule
      'sbp-small': { new: { meru: 3400, maua: 2000, nkubu: 2000, other: 2000 }, renewal: { meru: 2000, maua: 1000, nkubu: 1000, other: 1000 } },
      'sbp-medium': { new: { meru: 7000, maua: 4000, nkubu: 4000, other: 4000 }, renewal: { meru: 4000, maua: 2500, nkubu: 2500, other: 2500 } },
      'sbp-large': { new: { meru: 14000, maua: 10000, nkubu: 10000, other: 8000 }, renewal: { meru: 7000, maua: 5000, nkubu: 5000, other: 4000 } },
      'sbp-mega': { new: { meru: 50000, maua: 30000, nkubu: 30000, other: 24000 }, renewal: { meru: 25000, maua: 15000, nkubu: 15000, other: 12000 } },
      'kiosk': { new: { meru: 2700, maua: 1600, nkubu: 1600, other: 1500 }, renewal: { meru: 1350, maua: 800, nkubu: 800, other: 750 } },
      'hawker': { new: { meru: 3500, maua: 2000, nkubu: 2000, other: 2000 }, renewal: { meru: 1750, maua: 1000, nkubu: 1000, other: 1000 } },
      'sublet': { new: { meru: 2000, maua: 2000, nkubu: 2000, other: 2000 } },
      'change-activity': { new: { meru: 2000, maua: 2000, nkubu: 2000, other: 2000 } },
      
      // Transport & Parking - Finance Act 2019, Third Schedule
      'parking-moto': { new: { all: 20 } },
      'parking-car': { new: { all: 50 } },
      'parking-matatu': { new: { all: 100 } },
      'parking-bus': { new: { all: 200 } },
      'parking-lorry': { new: { all: 250 } },
      'parking-trailer': { new: { all: 300 } },
      'parking-fine': { new: { all: 10000 } },
      'impounding': { new: { all: 3000 } },
      
      // Land & Property - Finance Act 2019, Eighth Schedule
      'plot-boundary': { new: { all: 500 } },
      'plot-demarcation': { new: { all: 3000 } },
      'occupation-permit': { new: { all: 4000 } },
      'change-user': { new: { all: 20000 } },
      'consent-transfer': { new: { all: 6000 } },
      'clearance-cert': { new: { all: 4000 } },
      
      // Health & Licensing - Finance Act 2019, Eleventh Schedule
      'food-retail': { new: { all: 300 }, renewal: { all: 300 } },
      'food-butchery': { new: { all: 600 }, renewal: { all: 600 } },
      'food-bakery': { new: { all: 3000 }, renewal: { all: 3000 } },
      'food-supermarket': { new: { all: 5000 }, renewal: { all: 5000 } },
      'health-hotel': { new: { all: 6000 }, renewal: { all: 6000 } },
      'medical-clinic': { new: { all: 4000 }, renewal: { all: 2000 } },
      'pharmacy': { new: { all: 4000 }, renewal: { all: 2000 } },
      'vaccination': { new: { all: 1000 } },
      
      // Agriculture - Finance Act 2019, Part III of Second Schedule
      'cabbages': { new: { all: 20 } },
      'bananas': { new: { all: 20 } },
      'miraa-pickup': { new: { all: 1000 } },
      'miraa-lorry': { new: { all: 2000 } },
      'charcoal': { new: { all: 20 } },
      'timber-pickup': { new: { all: 500 } },
      'timber-trailer': { new: { all: 5000 } },
      'meat-cattle': { new: { all: 100 } },
      'slaughter': { new: { all: 6000 } },
      
      // Construction - Finance Act 2019, Sixth Schedule
      'building-46': { new: { all: 1000 } },
      'building-93': { new: { all: 2000 } },
      'building-140': { new: { all: 3000 } },
      'building-186': { new: { all: 4000 } },
      'building-279': { new: { all: 5000 } },
      'building-structural': { new: { all: 4000 } },
      'late-submission': { new: { all: 3500 } },
      
      // Alcohol - Finance Act 2019, Part IV
      'alcohol-retail-meru': { new: { meru: 35000, maua: 35000 }, renewal: { meru: 30000, maua: 30000 } },
      'alcohol-retail-other': { new: { nkubu: 20000, other: 20000 }, renewal: { nkubu: 15000, other: 15000 } },
      'alcohol-bar-meru': { new: { meru: 45000, maua: 45000 }, renewal: { meru: 40000, maua: 40000 } },
      'alcohol-bar-other': { new: { nkubu: 35000, other: 35000 }, renewal: { nkubu: 30000, other: 30000 } },
      'alcohol-night-meru': { new: { meru: 105000, maua: 105000 }, renewal: { meru: 100000, maua: 100000 } },
      'alcohol-night-other': { new: { nkubu: 55000, other: 55000 }, renewal: { nkubu: 50000, other: 50000 } },
      'wines-spirits': { new: { meru: 29000, maua: 29000, nkubu: 20000, other: 20000 }, renewal: { meru: 24000, maua: 24000, nkubu: 15000, other: 15000 } },
      'temporary-license': { new: { all: 11000 } },
      
      // Waste - Finance Act 2019, Fourth Schedule
      'waste-small': { new: { meru: 2000, maua: 1000, nkubu: 1000, other: 1000 } },
      'waste-medium': { new: { meru: 5000, maua: 2000, nkubu: 2000, other: 2000 } },
      'waste-large': { new: { meru: 15000, maua: 3000, nkubu: 3000, other: 3000 } },
      'waste-residential': { new: { meru: 7000, maua: 1000, nkubu: 1000, other: 1000 } },
      'illegal-dumping': { new: { all: 50000 } }
    };
    
    function updatePreview() {
      if (!serviceSelect) return;
      
      const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
      const serviceValue = selectedOption ? selectedOption.value : '';
      const hasRenewal = serviceRenewalMap[serviceValue] || false;
      const serviceName = selectedOption ? selectedOption.text : '';
      const appType = appTypeSelect ? appTypeSelect.value : 'new';
      const location = locationSelect ? locationSelect.value : 'meru';
      const reference = refInput ? refInput.value.trim() : '';
      
      // Show/hide application type based on hasRenewal
      if (appTypeGroup) {
        appTypeGroup.style.display = hasRenewal ? 'block' : 'none';
      }
      
      if (reference && serviceValue && portalServiceFees[serviceValue]) {
        const feeData = portalServiceFees[serviceValue];
        let fee = 0;
        
        if (appType === 'renewal' && feeData.renewal) {
          if (feeData.renewal.all !== undefined) {
            fee = feeData.renewal.all;
          } else if (feeData.renewal[location]) {
            fee = feeData.renewal[location];
          } else if (feeData.new && feeData.new[location]) {
            fee = feeData.new[location];
          }
        } else if (feeData.new) {
          if (feeData.new.all !== undefined) {
            fee = feeData.new.all;
          } else if (feeData.new[location]) {
            fee = feeData.new[location];
          }
        }
        
        if (fee > 0) {
          const previewService = document.getElementById('preview-service-name');
          const previewAppType = document.getElementById('preview-app-type');
          const previewLocation = document.getElementById('preview-location-name');
          const previewAmount = document.getElementById('preview-amount');
          
          if (previewService) previewService.textContent = serviceName;
          if (previewAppType) previewAppType.textContent = appType === 'new' ? 'New Application' : 'Renewal';
          if (previewLocation) previewLocation.textContent = locationSelect.options[locationSelect.selectedIndex]?.text || 'Meru Town';
          if (previewAmount) previewAmount.textContent = `KES ${fee.toLocaleString()}`;
          if (previewDiv) previewDiv.style.display = 'block';
          if (payBtn) {
            payBtn.disabled = false;
            payBtn.setAttribute('data-service', serviceName);
            payBtn.setAttribute('data-app-type', appType);
            payBtn.setAttribute('data-location', locationSelect.options[locationSelect.selectedIndex]?.text || 'Meru Town');
            payBtn.setAttribute('data-reference', reference);
            payBtn.setAttribute('data-amount', fee);
          }
        } else {
          if (previewDiv) previewDiv.style.display = 'none';
          if (payBtn) payBtn.disabled = true;
        }
      } else {
        if (previewDiv) previewDiv.style.display = 'none';
        if (payBtn) payBtn.disabled = true;
      }
    }
    
    if (serviceSelect) {
      serviceSelect.addEventListener('change', updatePreview);
      setTimeout(updatePreview, 100);
    }
    if (appTypeSelect) appTypeSelect.addEventListener('change', updatePreview);
    if (locationSelect) locationSelect.addEventListener('change', updatePreview);
    if (refInput) refInput.addEventListener('input', updatePreview);
    
    if (payBtn) {
      payBtn.addEventListener('click', function() {
        const service = this.getAttribute('data-service');
        const appType = this.getAttribute('data-app-type');
        const location = this.getAttribute('data-location');
        const reference = this.getAttribute('data-reference');
        const amount = this.getAttribute('data-amount');
        
        if (!service || !amount) {
          alert('Please complete all required fields.');
          return;
        }
        
        openPortalPaymentModal(service, appType, location, reference, amount);
      });
    }
  }

  // ==================== PAYMENT MODAL FUNCTIONS ====================
  window.showPaymentModal = function(serviceName, itemData) {
    currentPaymentItem = itemData;
    currentPaymentName = serviceName;
    
    const locationSelect = document.getElementById('payment-location');
    const typeSelect = document.getElementById('payment-type');
    const typeGroup = document.querySelector('.payment-form-group:has(#payment-type)');
    const pricePreview = document.getElementById('payment-price-preview');
    const confirmBtn = document.getElementById('confirm-payment-btn');
    const serviceNameElem = document.getElementById('payment-service-name');
    const serviceDescElem = document.getElementById('payment-service-description');
    
    if (locationSelect) {
      locationSelect.innerHTML = '<option value="">-- Select Location --</option>';
      const availableLocations = itemData.locations || ['meru', 'maua', 'nkubu', 'other'];
      if (availableLocations.includes('meru')) locationSelect.innerHTML += '<option value="meru">Meru Town (CBD)</option>';
      if (availableLocations.includes('maua')) locationSelect.innerHTML += '<option value="maua">Maua Town</option>';
      if (availableLocations.includes('nkubu')) locationSelect.innerHTML += '<option value="nkubu">Nkubu Town</option>';
      if (availableLocations.includes('other')) locationSelect.innerHTML += '<option value="other">Other Sub-Counties</option>';
      if (availableLocations.includes('all')) locationSelect.innerHTML = '<option value="all">County-Wide (Flat Rate)</option>';
      locationSelect.value = '';
    }
    
    if (typeSelect) typeSelect.value = '';
    if (pricePreview) pricePreview.style.display = 'none';
    if (confirmBtn) confirmBtn.disabled = true;
    if (serviceNameElem) serviceNameElem.textContent = serviceName;
    
    const hasRenewal = hasRenewalFee(itemData);
    if (typeGroup) {
      typeGroup.style.display = hasRenewal ? 'block' : 'none';
    }
    
    if (serviceDescElem) {
      if (hasRenewal) {
        serviceDescElem.innerHTML = `Complete the details below to pay for ${serviceName}.<br>Fees vary by location and application type (New/Renewal).`;
      } else {
        serviceDescElem.innerHTML = `Complete the details below to pay for ${serviceName}.<br>Fees vary by location. This service has a flat fee (no renewal discount).`;
      }
    }
    
    const modal = document.getElementById('payment-modal');
    if (modal) modal.classList.add('active');
  };
  
  window.closePaymentModal = function() {
    const modal = document.getElementById('payment-modal');
    if (modal) modal.classList.remove('active');
    currentPaymentItem = null;
    currentPaymentName = null;
  };
  
  window.previewFee = function() {
    const locationSelect = document.getElementById('payment-location');
    const typeSelect = document.getElementById('payment-type');
    const pricePreview = document.getElementById('payment-price-preview');
    const confirmBtn = document.getElementById('confirm-payment-btn');
    const location = locationSelect ? locationSelect.value : '';
    let type = 'new';
    const hasRenewal = hasRenewalFee(currentPaymentItem);
    
    if (hasRenewal && typeSelect) {
      type = typeSelect.value;
      if (!type) {
        alert('Please select application type');
        return;
      }
    }
    if (!location) {
      alert('Please select location');
      return;
    }
    
    const amount = getFeeAmount(currentPaymentItem, location, type);
    if (amount === 0) {
      alert('Fee information not available for this combination.');
      return;
    }
    
    const previewBaseFee = document.getElementById('preview-base-fee');
    const previewLocation = document.getElementById('preview-location');
    const previewType = document.getElementById('preview-type');
    const previewTotal = document.getElementById('preview-total');
    
    const locationText = locationSelect.options[locationSelect.selectedIndex]?.text || location;
    const typeText = (hasRenewal && typeSelect && typeSelect.options[typeSelect.selectedIndex]) 
      ? typeSelect.options[typeSelect.selectedIndex].text 
      : 'New Application';
    
    if (previewBaseFee) previewBaseFee.textContent = `KES ${amount.toLocaleString()}`;
    if (previewLocation) previewLocation.textContent = locationText;
    if (previewType) previewType.textContent = typeText;
    if (previewTotal) previewTotal.textContent = `KES ${amount.toLocaleString()}`;
    if (pricePreview) pricePreview.style.display = 'block';
    if (confirmBtn) confirmBtn.disabled = false;
    
    window.calculatedPaymentAmount = amount;
    window.calculatedPaymentLocation = location;
    window.calculatedPaymentType = type;
  };
  
  window.confirmPayment = function() {
    const amount = window.calculatedPaymentAmount;
    const location = window.calculatedPaymentLocation;
    const type = window.calculatedPaymentType;
    const serviceName = currentPaymentName;
    
    if (!amount) {
      alert('Please preview the fee before confirming payment.');
      return;
    }
    
    const locationSelect = document.getElementById('payment-location');
    const typeSelect = document.getElementById('payment-type');
    const locationText = locationSelect?.options[locationSelect.selectedIndex]?.text || location;
    let typeText = 'New Application';
    if (hasRenewalFee(currentPaymentItem) && typeSelect && typeSelect.options[typeSelect.selectedIndex]) {
      typeText = typeSelect.options[typeSelect.selectedIndex].text;
    }
    
    const confirmMsg = `Payment Details:\n\nService: ${serviceName}\nLocation: ${locationText}\nType: ${typeText}\nAmount: KES ${amount.toLocaleString()}\n\nProceed to MeruPay Portal?`;
    if (confirm(confirmMsg)) {
      closePaymentModal();
      const customBill = {
        owner: 'Customer',
        item: `${serviceName} (${locationText} - ${typeText})`,
        amount: amount,
        arrears: 0,
        ref: 'PYMT-' + Math.floor(Math.random() * 90000 + 10000),
        due: 'Immediate'
      };
      mockBills['permit']['CUSTOM-PYMT'] = customBill;
      switchView('portal');
      setTimeout(() => {
        const portalRefInput = document.getElementById('portal-ref-input');
        if (portalRefInput) portalRefInput.value = 'CUSTOM-PYMT';
        const portalSearchForm = document.getElementById('portal-search-form');
        if (portalSearchForm) portalSearchForm.dispatchEvent(new Event('submit'));
      }, 100);
    }
  };

  // Function to load category services
  window.loadCategoryServices = function(category) {
    const gridId = `${category}ServicesGrid`;
    const container = document.getElementById(gridId);
    if (!container) return;
    const categoryData = categoryServicesData[category];
    if (!categoryData) return;
    container.innerHTML = '';
    categoryData.items.forEach(item => {
      let baseFee = '';
      if (item.fees) {
        if (item.fees.all !== undefined) {
          if (typeof item.fees.all === 'string') {
            baseFee = `<div class="service-price"><span class="price-badge">${item.fees.all}</span></div>`;
          } else {
            baseFee = `<div class="service-price"><span class="price-badge all">KES ${item.fees.all.toLocaleString()}</span></div>`;
          }
        } else {
          const locationFees = [];
          if (item.fees.meru) locationFees.push(item.fees.meru);
          if (item.fees.maua) locationFees.push(item.fees.maua);
          if (item.fees.nkubu) locationFees.push(item.fees.nkubu);
          if (item.fees.other) locationFees.push(item.fees.other);
          const minFee = Math.min(...locationFees);
          baseFee = `<div class="service-price"><span class="price-badge all">Starting from KES ${minFee.toLocaleString()}</span></div>`;
        }
      }
      const serviceCard = document.createElement('div');
      serviceCard.className = 'service-card';
      serviceCard.innerHTML = `
        <div class="service-card-header">
          <div class="service-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg></div>
          <span class="service-card-badge">Service Fee</span>
        </div>
        <h3>${item.name}</h3>
        ${baseFee}
        <div class="service-actions">
          <button class="btn-service-action" onclick="payForService('${item.name.replace(/'/g, "\\'")}', ${JSON.stringify(item).replace(/"/g, '&quot;')})">Pay Now</button>
          <button class="btn-service-action calculate" onclick="calculateServiceFee(${JSON.stringify(item).replace(/"/g, '&quot;')})">Calculate</button>
        </div>
      `;
      container.appendChild(serviceCard);
    });
  };
  
  window.payForService = function(serviceName, itemData) {
    showPaymentModal(serviceName, itemData);
  };
  
  window.calculateServiceFee = function(itemData) {
    switchView('calculator');
    setTimeout(() => {
      const categorySelect = document.getElementById('serviceCategory');
      let foundCategory = null;
      for (const [catKey, catData] of Object.entries(categoryServicesData)) {
        if (catData.items.some(item => item.name === itemData.name)) {
          foundCategory = catKey;
          break;
        }
      }
      if (foundCategory && categorySelect) {
        categorySelect.value = foundCategory;
        categorySelect.dispatchEvent(new Event('change'));
        setTimeout(() => {
          const specificService = document.getElementById('specificService');
          if (specificService) {
            for (let i = 0; i < specificService.options.length; i++) {
              if (specificService.options[i].value === itemData.name) {
                specificService.selectedIndex = i;
                specificService.dispatchEvent(new Event('change'));
                break;
              }
            }
          }
        }, 300);
      }
    }, 400);
  };

  function initCategoryViewButtons() {
    const viewButtons = document.querySelectorAll('.btn-view-category');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const category = btn.getAttribute('data-category');
        if (category && categoryServicesData[category]) {
          loadCategoryServices(category);
          switchView(`${category}-services`);
        }
      });
    });
  }
  
  function initBackButtons() {
    const backButtons = document.querySelectorAll('.back-to-services');
    backButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        switchView('services-page');
      });
    });
  }

  // --- THEME & NAVIGATION ---
  document.documentElement.setAttribute('data-theme', currentTheme);
  if (window.lucide) window.lucide.createIcons();

  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  function updateThemeIcon() {
    if (themeToggleBtn) {
      if (currentTheme === 'dark') {
        themeToggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
      } else {
        themeToggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
      }
    }
  }
  updateThemeIcon();

  const navLinks = document.querySelectorAll('.nav-link');
  const views = document.querySelectorAll('.tab-content');
  const quickPortalBtn = document.getElementById('quick-portal-btn');
  const heroPortalBtn = document.getElementById('hero-portal-btn');
  const heroCalcBtn = document.getElementById('hero-calc-btn');

  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      if(header) header.classList.add('scrolled');
    } else {
      if(header) header.classList.remove('scrolled');
    }
  });

  function switchView(targetViewId) {
    if (!isAuthenticated && protectedViews.includes(targetViewId)) {
      alert('Please sign in or register before accessing MeruPay services.');
      targetViewId = 'login';
    }

    navLinks.forEach(link => {
      if (link.getAttribute('data-tab') === targetViewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    views.forEach(view => view.classList.remove('active'));

    let targetSectionId = targetViewId;
    if (targetViewId === 'services-page') targetSectionId = 'services-page-view';
    else if (targetViewId === 'business-services') targetSectionId = 'business-services-view';
    else if (targetViewId === 'transport-services') targetSectionId = 'transport-services-view';
    else if (targetViewId === 'land-services') targetSectionId = 'land-services-view';
    else if (targetViewId === 'health-services') targetSectionId = 'health-services-view';
    else if (targetViewId === 'agriculture-services') targetSectionId = 'agriculture-services-view';
    else if (targetViewId === 'construction-services') targetSectionId = 'construction-services-view';
    else if (targetViewId === 'alcohol-services') targetSectionId = 'alcohol-services-view';
    else if (targetViewId === 'waste-services') targetSectionId = 'waste-services-view';
    else targetSectionId = targetViewId + '-view';

    const targetSection = document.getElementById(targetSectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.location.hash = targetViewId;
    }
    if (targetViewId === 'home') animateCounters();
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.getAttribute('data-tab');
      if (tabId) switchView(tabId);
    });
  });

  document.querySelectorAll('a[data-tab]').forEach(link => {
    if (link.classList.contains('nav-link')) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.getAttribute('data-tab');
      if (tabId) switchView(tabId);
    });
  });

  document.querySelectorAll('button[data-tab]:not(.btn-login):not(.btn-register)').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = btn.getAttribute('data-tab');
      if (tabId) switchView(tabId);
    });
  });

  const menuBtn = document.getElementById('menuBtn');
  const dropdownMenu = document.getElementById('dropdownMenu');
  const mobileMenuOpen = document.getElementById('mobile-menu-open');

  function closeDropdown() {
    if (dropdownMenu) dropdownMenu.classList.remove('show');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  }

  function toggleDropdown() {
    if (!dropdownMenu) return;
    const isOpen = dropdownMenu.classList.toggle('show');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', isOpen);
  }

  if (menuBtn && dropdownMenu) {
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-haspopup', 'true');
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown();
    });
    dropdownMenu.querySelectorAll('.dropdown-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = link.getAttribute('data-tab');
        closeDropdown();
        if (tabId) switchView(tabId);
      });
    });
  }

  if (mobileMenuOpen && dropdownMenu) {
    mobileMenuOpen.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.add('show');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    });
  }

  document.addEventListener('click', (e) => {
    if (!dropdownMenu || !dropdownMenu.classList.contains('show')) return;
    const clickedInside = dropdownMenu.contains(e.target) ||
      (menuBtn && menuBtn.contains(e.target)) ||
      (mobileMenuOpen && mobileMenuOpen.contains(e.target));
    if (!clickedInside) closeDropdown();
  });

  const signInBtn = document.querySelector('.btn-login');
  const registerBtn = document.querySelector('.btn-register');

  if (signInBtn) {
    signInBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeDropdown();
      switchView('login');
      setTimeout(() => document.getElementById('citizenId')?.focus(), 350);
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeDropdown();
      switchView('register');
      setTimeout(() => document.getElementById('regFirstName')?.focus(), 350);
    });
  }

  const heroServicesBtn = document.getElementById('hero-services-btn');
  if (heroServicesBtn) heroServicesBtn.addEventListener('click', (e) => { e.preventDefault(); switchView('services-page'); });
  if (quickPortalBtn) quickPortalBtn.addEventListener('click', (e) => { e.preventDefault(); switchView('portal'); });
  if (heroPortalBtn) heroPortalBtn.addEventListener('click', (e) => { e.preventDefault(); switchView('portal'); });
  if (heroCalcBtn) heroCalcBtn.addEventListener('click', (e) => { e.preventDefault(); switchView('calculator'); });

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('theme', currentTheme);
      updateThemeIcon();
    });
  }

  const loginTabBtns = document.querySelectorAll('.login-tab-btn');
  const loginFormViews = document.querySelectorAll('.login-form-view');
  
  if (loginTabBtns.length > 0) {
    loginTabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        loginTabBtns.forEach(b => {
          b.classList.remove('active');
          b.style.color = 'var(--text-color-light)';
          b.style.borderBottomColor = 'transparent';
        });
        btn.classList.add('active');
        btn.style.color = 'var(--primary-color)';
        btn.style.borderBottomColor = 'var(--primary-color)';
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

    document.querySelectorAll('.register-link').forEach(link => {
      link.addEventListener('click', (e) => { e.preventDefault(); switchView('register'); });
    });
    document.querySelectorAll('.login-link').forEach(link => {
      link.addEventListener('click', (e) => { e.preventDefault(); switchView('login'); });
    });
    
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

  let countersAnimated = false;
  function animateCounters() {
    if (countersAnimated) return;
    const counters = document.querySelectorAll('.stat-num');
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const suffix = counter.getAttribute('data-suffix') || '';
      const isDecimal = counter.getAttribute('data-decimal') === 'true';
      let start = 0;
      const duration = 2000;
      const startTime = performance.now();
      function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
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
  setTimeout(animateCounters, 500);

  initCategoryViewButtons();
  initBackButtons();
  initCalculator();
  initPortalCalculator();

  // Payment Modal Event Listeners
  const previewBtn = document.getElementById('preview-fee-btn');
  const confirmPayBtn = document.getElementById('confirm-payment-btn');
  const modalCloseBtn = document.querySelector('.payment-modal-close');
  const modalOverlay = document.getElementById('payment-modal');
  
  if (previewBtn) previewBtn.addEventListener('click', window.previewFee);
  if (confirmPayBtn) confirmPayBtn.addEventListener('click', window.confirmPayment);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', window.closePaymentModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) window.closePaymentModal();
    });
  }

  // Portal payment confirm button
  const confirmPortalPayBtn = document.getElementById('confirm-portal-payment');
  if (confirmPortalPayBtn) {
    confirmPortalPayBtn.addEventListener('click', window.confirmPortalPayment);
  }

  // Portal receipt buttons
  const newReceiptBtn = document.getElementById('btn-receipt-new');
  if (newReceiptBtn) {
    newReceiptBtn.addEventListener('click', function() {
      const portalRefInput = document.getElementById('portal-ref-input');
      if (portalRefInput) portalRefInput.value = '';
      const portalService = document.getElementById('portal-service');
      if (portalService) portalService.value = '';
      document.querySelectorAll('.terminal-state').forEach(s => s.classList.remove('active'));
      const emptyState = document.getElementById('state-empty');
      if (emptyState) emptyState.classList.add('active');
    });
  }

  const downloadReceiptBtn = document.getElementById('btn-receipt-download');
  if (downloadReceiptBtn) {
    downloadReceiptBtn.addEventListener('click', function() {
      window.print();
    });
  }

  // --- FAQS ACCORDION ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });

  // --- CONTACT FORM ---
  const contactForm = document.getElementById('mcrb-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('contact-name');
      const email = document.getElementById('contact-email');
      const message = document.getElementById('contact-message');
      if (!name?.value.trim() || !email?.value.trim() || !message?.value.trim()) {
        alert('Please fill out all fields in the contact form.');
        return;
      }
      alert(`Thank you, ${name.value}! Your message has been sent successfully. Our support desk will reply to ${email.value} shortly.`);
      contactForm.reset();
    });
  }

  // --- CHATBOT ---
  const chatTrigger = document.getElementById('chatbot-trigger');
  const chatWindow = document.getElementById('chatbot-window');
  const chatBody = document.getElementById('chatbot-body');
  const chatInput = document.getElementById('chatbot-input');
  const chatSendBtn = document.getElementById('chatbot-send-btn');
  const chatOptionBtns = document.querySelectorAll('.chat-option-btn');

  if (chatTrigger && chatWindow) {
    chatTrigger.addEventListener('click', function() {
      chatWindow.classList.toggle('active');
      chatTrigger.classList.toggle('active');
      if (chatTrigger.classList.contains('active')) {
        chatTrigger.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
      } else {
        chatTrigger.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
      }
    });

    chatOptionBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const questionText = btn.textContent;
        appendUserMessage(questionText);
        generateBotResponse(questionText);
      });
    });

    if (chatSendBtn && chatInput) {
      chatSendBtn.addEventListener('click', sendMessage);
      chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
      });
    }

    function sendMessage() {
      const messageText = chatInput?.value.trim();
      if (!messageText) return;
      appendUserMessage(messageText);
      if (chatInput) chatInput.value = '';
      generateBotResponse(messageText);
    }

    function appendUserMessage(text) {
      if (!chatBody) return;
      const msgDiv = document.createElement('div');
      msgDiv.classList.add('chat-message', 'user');
      msgDiv.textContent = text;
      chatBody.appendChild(msgDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function appendBotMessage(text) {
      if (!chatBody) return;
      const msgDiv = document.createElement('div');
      msgDiv.classList.add('chat-message', 'bot');
      msgDiv.innerHTML = text;
      chatBody.appendChild(msgDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function generateBotResponse(userMsg) {
      const typingIndicator = document.createElement('div');
      typingIndicator.classList.add('chat-message', 'bot', 'typing-indicator');
      typingIndicator.innerHTML = '<em>Revenue Assistant is typing…</em>';
      if (chatBody) chatBody.appendChild(typingIndicator);
      if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
      setTimeout(function() {
        const fallback = keywordFallback(userMsg);
        if (typingIndicator.parentNode) typingIndicator.parentNode.removeChild(typingIndicator);
        appendBotMessage(fallback);
      }, 500);
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
        return "Daily parking fees (county-wide): Motorbike <strong>KES 20</strong>, Saloon Car/Taxi <strong>KES 50</strong>, Matatu <strong>KES 100</strong>, Bus <strong>KES 200</strong>, Lorry <strong>KES 250</strong>, Trailer <strong>KES 300</strong>. Monthly seasonal tickets also available. Pay via <strong>*412#</strong> or MeruPay Portal.";
      } else if (query.includes('contact') || query.includes('phone') || query.includes('email') || query.includes('where')) {
        return "📍 Mt Kenya House, Makutano Junction, Meru Town.<br>📞 +254 700 000 000<br>✉️ info@merurevenue.go.ke<br>🕒 Mon–Fri, 8:00 AM – 5:00 PM";
      } else {
        return "I couldn't fully understand that, but our team is happy to help! Reach us at <strong>info@merurevenue.go.ke</strong> or visit Mt Kenya House, Makutano, Meru Town — open Mon–Fri, 8AM–5PM.";
      }
    }
  }
});