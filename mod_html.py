import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update serviceSearch
service_search_add = '''
            <optgroup label="Liquor Licensing">
              <option value="Liquor – General Retail">Liquor – General Retail</option>
              <option value="Liquor – Night Club">Liquor – Night Club</option>
            </optgroup>
            <optgroup label="General Fees">
              <option value="General – Bounced Cheque">General – Bounced Cheque</option>
            </optgroup>
            <optgroup label="Agricultural Cess">
              <option value="Cess – Tea/Coffee Tax (1%)">Cess – Tea/Coffee Tax (1%)</option>
              <option value="Cess – Transport (Trailer)">Cess – Transport (Trailer)</option>
            </optgroup>
            <optgroup label="Livestock">
              <option value="Livestock – Cow Inspection">Livestock – Cow Inspection</option>
            </optgroup>
          </select>'''

html = re.sub(r'(<option value="Monthly Parking \(Car\)">Monthly Parking \(Car\)</option>\s*</optgroup>\s*)</select>', r'\1' + service_search_add, html)


# 2. Update revenueCategory
rev_cat_add = '''
            <option value="liquor">Liquor Licensing</option>
            <option value="general_fees">General Fees & Charges</option>
            <option value="agri_cess">Agricultural Produce Cess</option>
            <option value="livestock">Livestock & Meat Inspection</option>
          </select>'''

html = re.sub(r'(<option value="parking">Parking Fees</option>\s*)</select>', r'\1' + rev_cat_add, html)


# 3. Add to services-grid
services_grid_add = '''

      <!-- Service 6: Liquor Licensing -->
      <div class="service-card" data-category="business">
        <div class="service-card-header">
          <div class="service-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-beer"><path d="M17 11h1a3 3 0 0 1 0 6h-1"/><path d="M9 12v6"/><path d="M13 12v6"/><path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1.5 3 1.5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z"/><path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/></svg>
          </div>
          <span class="service-card-badge">Annual</span>
        </div>
        <h3>Liquor Licensing</h3>
        <p>Application and license fees for alcoholic drink retail, wholesale, distributors, manufacturers, and night clubs.</p>
        <ul class="service-features">
          <li><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Retail & Wholesale</li>
          <li><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Bar & Restaurant</li>
          <li><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Night Clubs</li>
        </ul>
        <button class="btn-service-action" data-action="pay" data-type="liquor">Apply License</button>
      </div>

      <!-- Service 7: Agricultural Produce Cess -->
      <div class="service-card" data-category="daily">
        <div class="service-card-header">
          <div class="service-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tractor"><path d="m4.5 9.5 2-2"/><path d="M10 6.5V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3.5"/><path d="M7 16.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/><path d="M7 16.5H15"/><path d="M11 19.5h6"/><path d="M13 13.5v-7h8v11a4 4 0 1 1-8 0Z"/><path d="M19 13.5v-7"/><path d="M21 13.5v-7"/></svg>
          </div>
          <span class="service-card-badge">Per Load / Gross</span>
        </div>
        <h3>Agricultural Cess & Transport</h3>
        <p>Cess charges for transportation of produce including timber, sand, miraa, building blocks, and tea/coffee turnover tax.</p>
        <ul class="service-features">
          <li><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Sand & Timber Transport</li>
          <li><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Miraa Transport</li>
          <li><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Tea/Coffee Turnover Tax (1%)</li>
        </ul>
        <button class="btn-service-action" data-action="pay" data-type="agri_cess">Pay Cess</button>
      </div>

      <!-- Service 8: Livestock & Meat Inspection -->
      <div class="service-card" data-category="daily">
        <div class="service-card-header">
          <div class="service-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-beef"><path d="M16.5 11a2.5 2.5 0 0 1-5 0V7.5a2.5 2.5 0 0 1 5 0v3.5Z"/><path d="M14 7.5v3.5"/><path d="M8 12a2.5 2.5 0 0 1-5 0V8.5a2.5 2.5 0 0 1 5 0V12Z"/><path d="M5.5 8.5v3.5"/><path d="M11.5 16a2.5 2.5 0 0 1-5 0v-3.5a2.5 2.5 0 0 1 5 0V16Z"/><path d="M9 12.5V16"/><path d="M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z"/></svg>
          </div>
          <span class="service-card-badge">Daily / Annual</span>
        </div>
        <h3>Livestock & Meat Inspection</h3>
        <p>Meat inspection fees per head, livestock transport cess, and annual slaughterhouse licenses.</p>
        <ul class="service-features">
          <li><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Meat Inspection</li>
          <li><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Livestock Transport Cess</li>
          <li><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Slaughterhouse Licenses</li>
        </ul>
        <button class="btn-service-action" data-action="pay" data-type="livestock">Pay Fees</button>
      </div>

    </div>
'''

html = re.sub(r'(    </div>\s*</section>)', services_grid_add + r'\1', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('index.html successfully updated!')
