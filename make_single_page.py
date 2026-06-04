import re

with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Make all tab-contents visible, so they form a single long page
# We will just force them to block
css += '''
/* Override SPA behavior to Single Page Scrolling */
.tab-content {
    display: block !important;
    opacity: 1 !important;
    margin-bottom: 60px; /* add some spacing between sections */
}
'''
with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Modify switchView
old_switchView = '''    // Toggle Content Views
    views.forEach(view => {
      if (view.id === `${targetViewId}-view`) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    // Scroll to Top
    window.scrollTo({ top: 0, behavior: 'smooth' });'''

new_switchView = '''    // Scroll to target section instead of hiding others
    const targetSection = document.getElementById(`${targetViewId}-view`);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }'''

js = js.replace(old_switchView, new_switchView)

# Bump cache version
js = re.sub(r'\?v=\d+', '?v=10', js)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()
html = re.sub(r'styles\.css\?v=\d+', 'styles.css?v=10', html)
html = re.sub(r'app\.js\?v=\d+', 'app.js?v=10', html)
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
