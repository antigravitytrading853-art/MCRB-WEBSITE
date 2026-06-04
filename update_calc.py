import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

search_box_html = '''        <div class="search-box form-group">
          <label for="serviceSearch">Quick Find</label>
          <select id="serviceSearch" class="form-control">
            <option value="">— Select a Service to Autofill —</option>
            <optgroup label="Single Business Permit">
              <option value="Hotel">Hotel</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Clinic / Hospital">Clinic / Hospital</option>
              <option value="School">School</option>
              <option value="Kiosk">Kiosk</option>
              <option value="Hawker">Hawker</option>
              <option value="Mega Store">Mega Store</option>
              <option value="Professional Firm">Professional Firm</option>
            </optgroup>
            <optgroup label="Outdoor Advertising">
              <option value="Billboard">Billboard</option>
              <option value="Signboard">Signboard</option>
              <option value="Illuminated Sign">Illuminated Sign</option>
              <option value="Road Show">Road Show</option>
            </optgroup>
            <optgroup label="Public Health">
              <option value="Food Hygiene Cert">Food Hygiene Cert</option>
              <option value="Premises Inspection">Premises Inspection</option>
            </optgroup>
            <optgroup label="Solid Waste">
              <option value="Garbage – Small">Garbage – Small</option>
              <option value="Garbage – Large">Garbage – Large</option>
            </optgroup>
            <optgroup label="Parking">
              <option value="Car Parking">Car Parking</option>
              <option value="Matatu Parking">Matatu Parking</option>
              <option value="Monthly Pass">Monthly Pass</option>
            </optgroup>
          </select>
        </div>'''

html = re.sub(r'<div class="search-box form-group">.*?<div id="searchSuggestions" class="search-suggestions"></div>.*?</div>', search_box_html, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

new_js = '''  // ── Quick Select Dropdown ─────────────────────────────────────
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
          parking:     { field: 'vehicleType',   locField: 'parkingZone'  },
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
  }'''

js = re.sub(r'  // ── Search / Autocomplete ─────────────────────────────────────.*?    \}\);\n  \}', new_js, js, flags=re.DOTALL)
js = re.sub(r'app\.js\?v=2', 'app.js?v=3', js) # just in case, but actually index.html needs v=3

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()
    html = html.replace('app.js?v=2', 'app.js?v=3')
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
