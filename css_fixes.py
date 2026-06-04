import re

with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Main Content and Page Content padding
css = re.sub(r'\.main-content\s*\{[^}]*margin-left:\s*320px;[^}]*\}', 
             '.main-content {\n    margin-left: 0;\n    position: relative;\n    z-index: 10;\n    min-height: 100vh;\n}', css)

css = re.sub(r'\.page-content\s*\{\s*padding:\s*0 0 40px 0;\s*\}', 
             '.page-content { padding: 0 0 40px 320px; }', css)

# 2. Hero Section Full Bleed
# Find .hero-section { ... } and add negative margin. Wait, it's safer to just append to the CSS.
full_bleed_css = '''
/* Full Bleed Hero for Blur Effect */
@media (min-width: 993px) {
    .hero-section {
        margin-left: -320px !important;
        width: 100vw !important;
        padding-left: 320px !important;
        box-sizing: border-box !important;
    }
}
@media (max-width: 992px) {
    .page-content {
        padding-left: 0 !important;
    }
}
'''
css += full_bleed_css

# 3. Respace Sidebar Nav Links to remove scrollbar
old_nav_link = r'\.sidebar \.nav-link\s*\{[^}]*padding:\s*14px 16px;\s*margin-bottom:\s*8px;[^}]*\}'
new_nav_link = '''
.sidebar .nav-link {
    display: flex;
    align-items: center;
    gap: 12px;
    color: rgba(255,255,255,0.85);
    text-decoration: none;
    padding: 10px 14px;
    margin-bottom: 4px;
    border-radius: 12px;
    transition: .25s;
    font-weight: 500;
    font-size: 0.95rem;
    position: static;
}
.nav-links { overflow-y: hidden; }
'''
css = re.sub(old_nav_link, new_nav_link, css)

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

# Bump cache
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()
html = re.sub(r'styles\.css\?v=\d+', 'styles.css?v=9', html)
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
