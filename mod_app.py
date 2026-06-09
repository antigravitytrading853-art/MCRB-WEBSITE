import re, sys

with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# 1. Update feeSchedule
fee_sched_add = '''
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
'''
app_js = re.sub(r'(trailer:\s*\{.*?\}\,)(\s*\}\,)(\s*\};)', r'\1\2' + fee_sched_add + r'\3', app_js, flags=re.DOTALL)


# 2. Update categoryLabels
cat_labels_add = '''
    liquor: 'Liquor Licensing',
    general_fees: 'General Fees & Charges',
    agri_cess: 'Agricultural Produce Cess',
    livestock: 'Livestock & Meat Inspection',
'''
app_js = re.sub(r'(const categoryLabels = \{[^}]+parking:.*?\,)', r'\1' + cat_labels_add, app_js, flags=re.DOTALL)


# 3. Update searchIndex
search_index_add = '''    { label: 'Liquor – General Retail',    category: 'liquor',       subKey: 'generalRetail',      location: 'meru' },
    { label: 'Liquor – Night Club',        category: 'liquor',       subKey: 'nightClub',          location: 'meru' },
    { label: 'General – Bounced Cheque',   category: 'general_fees', subKey: 'bouncedCheque',      location: 'meru' },
    { label: 'Cess – Tea/Coffee Tax (1%)', category: 'agri_cess',    subKey: 'teaCoffeeTax',       location: 'county' },
    { label: 'Cess – Transport (Trailer)', category: 'agri_cess',    subKey: 'transportTrailer',   location: 'county' },
    { label: 'Livestock – Cow Inspection', category: 'livestock',    subKey: 'inspCattle',         location: 'county' },
'''
app_js = re.sub(r'(const searchIndex = \[[^\]]+)(  \];\n)', r'\1' + search_index_add + r'\2', app_js, flags=re.DOTALL)


# 4. Update dynamicTemplates
dynamic_templates_add = """
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
"""
app_js = re.sub(r'(const dynamicTemplates = \{)(.*?)(\n  \};\n)', r'\1\2' + dynamic_templates_add + r'\3', app_js, flags=re.DOTALL)

# 5. Update calcFeeBtn logic
calc_logic_add = '''
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
'''
app_js = re.sub(r'(} else if \(cat === \'parking\'\) \{.*?\}\n)', r'\1' + calc_logic_add, app_js, flags=re.DOTALL)

# 6. Update subMap
submap_add = '''
          liquor:      { field: 'liquorType',    locField: 'liquorLocation' },
          general_fees:{ field: 'genFeeType',    locField: 'genFeeLocation' },
          agri_cess:   { field: 'agriType',      locField: 'agriLocation' },
          livestock:   { field: 'livestockType', locField: 'livestockLocation' },
'''
app_js = re.sub(r'(parking:\s*\{\s*field:\s*\'vehicleType\',\s*locField:\s*\'parkingChargeType\'\s*\},)', r'\1' + submap_add, app_js, flags=re.DOTALL)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)

print('app.js successfully updated!')
