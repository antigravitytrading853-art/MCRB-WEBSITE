import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Logo correction and Font change in sidebar
old_logo_section = r'<div style="display:flex; align-items:center; gap: 10px;">\s*<img src="assets/MCRB LOGO.jpg" alt="MCRB Logo" style="width: 40px; height: 40px; border-radius: 8px;">\s*<h2>MERU COUNTY<br>REVENUE BOARD</h2>\s*</div>'
new_logo_section = '''<div style="display:flex; align-items:center; gap: 12px;">
            <img src="assets/MCRB LOGO.jpg" alt="MCRB Logo" style="width: 50px; height: auto;">
            <h2 style="font-family: 'Cinzel', serif; font-weight: 600; letter-spacing: 1px; font-size: 1.15rem;">MERU COUNTY<br>REVENUE BOARD</h2>
        </div>'''
html = re.sub(old_logo_section, new_logo_section, html)

# Also ensure Cinzel is imported
if 'family=Cinzel' not in html:
    html = html.replace('<!-- Stylesheets -->', '<!-- Fonts -->\n  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap" rel="stylesheet">\n  <!-- Stylesheets -->')

# 4. Remove .topbar
html = re.sub(r'<div class="topbar">.*?</div>\s*</div>\s*<div class="page-content">', '<div class="page-content" style="padding-top: 0;">', html, flags=re.DOTALL)

# But wait, mobile toggle was inside topbar. Where should it go?
# "the homepahe should also start with the image. that means, the current top tab containing the tabs can be removed."
# I will put a floating mobile menu button that's absolute positioned over the hero so mobile still works, or just fixed to top right.
floating_mobile_btn = '''
    <button id="sidebar-open" class="mobile-only-btn" aria-label="Open Menu" style="position: fixed; top: 15px; right: 15px; z-index: 1100; background: rgba(0,0,0,0.5); color: white; border-radius: 8px; padding: 8px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
    </button>
    <div class="page-content" style="padding-top: 0;">'''

html = html.replace('<div class="page-content" style="padding-top: 0;">', floating_mobile_btn)

# 6. Replace "Access Self-Service" with "Pay Bill" in hero
hero_btns_old = r'<button class="btn btn-primary" id="hero-portal-btn">\s*<svg.*?Access Self-Service\s*</button>'
hero_btns_new = '''<button class="btn btn-portal" id="quick-portal-btn" style="background: var(--accent); color: white; border: none; padding: 14px 28px; border-radius: var(--radius-md); font-weight: 600; display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-credit-card"><rect width="20" height="14" rx="2" ry="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            Pay Bill
          </button>'''
html = re.sub(hero_btns_old, hero_btns_new, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)


with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 3. Sidebar transparency to 50%
css = re.sub(r'background:\s*rgba\(46,125,50,\s*\.95\);', 'background: rgba(46,125,50,0.50);', css)
css = re.sub(r'background:\s*rgba\(15,\s*23,\s*42,\s*0\.95\);', 'background: rgba(15, 23, 42, 0.50);', css)

# Fix hero radius and margins since it's now full top
css = re.sub(r'#home-view\s*{\s*border-radius:\s*24px;\s*overflow:\s*hidden;\s*}', '#home-view { border-radius: 0; overflow: hidden; margin: 0; padding: 0; }', css)
css = re.sub(r'\.hero\s*{\s*border-radius:\s*24px;\s*}', '.hero { border-radius: 0; }', css)
css = re.sub(r'\.page-content\s*{\s*padding:\s*0 20px 40px 20px;\s*}', '.page-content { padding: 0 0 40px 0; }', css)

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

# Bump cache in index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()
html = re.sub(r'styles\.css\?v=\d+', 'styles.css?v=6', html)
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
