import re

# 1. Fix app.js crashing
with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Make DOM element selections safe
js = js.replace("const mobileToggle = document.getElementById('mobile-toggle');", "const mobileToggle = document.getElementById('mobile-toggle'); // DEPRECATED")
js = js.replace("const navMenu = document.getElementById('nav-menu');", "const navMenu = document.getElementById('nav-menu'); // DEPRECATED")
js = js.replace("const header = document.querySelector('header');", "const header = document.querySelector('header'); // DEPRECATED")

# Wrap mobile toggle listener
js = js.replace("mobileToggle.addEventListener('click',", "if(mobileToggle) mobileToggle.addEventListener('click',")
# Wrap navMenu close logic
js = js.replace("navMenu.classList.remove('active');", "if(navMenu) navMenu.classList.remove('active');")
js = js.replace("mobileToggle.innerHTML = '☰';", "if(mobileToggle) mobileToggle.innerHTML = '☰';")
# Wrap header scroll logic
js = js.replace("header.classList.add('scrolled');", "if(header) header.classList.add('scrolled');")
js = js.replace("header.classList.remove('scrolled');", "if(header) header.classList.remove('scrolled');")
# Wrap button bindings
js = js.replace("if (heroCalcBtn) heroCalcBtn.addEventListener", "if (heroCalcBtn) heroCalcBtn.addEventListener") # already has if

# Bump cache in JS just in case
js = re.sub(r'\?v=\d+', '?v=8', js)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)

# 2. Fix index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Make Paybill button green
html = html.replace('background: var(--accent);', 'background: var(--primary);')

# Remove Estimate Permit Fees button
calc_btn_pattern = r'<button class="btn btn-outline" id="hero-calc-btn">[\s\S]*?</button>'
html = re.sub(calc_btn_pattern, '', html)

# Revert logo structure to original classes
old_logo = r'<div style="display:flex; align-items:center; gap: 12px;">\s*<img src="assets/MCRB LOGO.jpg" alt="MCRB Logo" style="width: 50px; height: auto;">\s*<h2 style="font-family: \'Cinzel\', serif; font-weight: 600; letter-spacing: 1px; font-size: 1.15rem;">MERU COUNTY<br>REVENUE BOARD</h2>\s*</div>'
new_logo = '''<div class="logo" style="display:flex; align-items:center; gap: 12px;">
            <img src="assets/MCRB LOGO.jpg" alt="Meru County Revenue Board Logo" id="nav-logo" style="width: 45px; height: auto; border-radius: 4px;">
            <div class="logo-text">
                <span class="logo-title" style="color: white;">MERU COUNTY</span>
                <span class="logo-subtitle" style="color: rgba(255,255,255,0.9);">REVENUE BOARD</span>
            </div>
        </div>'''
html = re.sub(old_logo, new_logo, html)

# Bump CSS/JS cache
html = re.sub(r'styles\.css\?v=\d+', 'styles.css?v=8', html)
html = re.sub(r'app\.js\?v=\d+', 'app.js?v=8', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
