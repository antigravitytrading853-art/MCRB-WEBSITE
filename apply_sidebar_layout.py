import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# We need to extract the existing nav links
nav_match = re.search(r'<nav class="nav-menu" id="nav-menu" role="navigation">(.*?)</nav>', html, re.DOTALL)
if nav_match:
    nav_links_html = nav_match.group(1).strip()
else:
    nav_links_html = '''<a href="#home" class="nav-link active" data-tab="home">Home</a>
        <a href="#services" class="nav-link" data-tab="services">Services</a>
        <a href="#calculator" class="nav-link" data-tab="calculator">Fee Calculator</a>
        <a href="#portal" class="nav-link" data-tab="portal">MeruPay Portal</a>
        <a href="#contact" class="nav-link" data-tab="contact">Contact</a>
        <a href="#login" class="nav-link" data-tab="login">Login</a>
        <a href="#about" class="nav-link" data-tab="about">About Us</a>'''

# Extract theme toggle button
theme_btn_match = re.search(r'<button class="theme-toggle".*?</button>', html, re.DOTALL)
theme_btn_html = theme_btn_match.group(0) if theme_btn_match else '<button class="theme-toggle" id="theme-toggle-btn" aria-label="Toggle Dark/Light Theme"></button>'

sidebar_html = f'''<div class="sidebar" id="sidebar">
    <div class="logo-section" style="display:flex; align-items:center; justify-content:space-between;">
        <div style="display:flex; align-items:center; gap: 10px;">
            <img src="assets/MCRB LOGO.jpg" alt="MCRB Logo" style="width: 40px; height: 40px; border-radius: 8px;">
            <h2>MERU COUNTY<br>REVENUE BOARD</h2>
        </div>
        <button id="sidebar-close" class="mobile-only-btn" aria-label="Close Menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
    </div>

    <div class="nav-links" id="sidebar-nav-links">
        {nav_links_html}
    </div>

    <div class="login-panel">
        <a href="#login" class="login-btn nav-link" data-tab="login">Sign In to Portal</a>
    </div>
</div>

<div class="main-content">
    <div class="topbar">
        <div style="display: flex; align-items: center; gap: 15px;">
            <button id="sidebar-open" class="mobile-only-btn" aria-label="Open Menu">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div class="search-box">
                <input type="text" placeholder="Search permits, invoices, services...">
            </div>
        </div>

        <div style="display: flex; align-items: center; gap: 15px;">
            <span class="desktop-only" style="color: var(--text-muted); font-weight: 500;">Notifications | Profile</span>
            {theme_btn_html}
        </div>
    </div>

    <div class="page-content">
'''

# Remove old header
html = re.sub(r'<header id="header">.*?</header>', '', html, flags=re.DOTALL)

# Insert the sidebar and main-content wrapper just after <body>
html = re.sub(r'(<body>\s*)', r'\1' + sidebar_html, html)

# Close the wrapper after footer
html = re.sub(r'(</footer>\s*)', r'\1    </div>\n</div>\n', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)


# Now append the new styles to styles.css
new_css = '''
/* ================================================================
   SIDEBAR & MAIN LAYOUT UPGRADE
================================================================ */
/* Reset body background for new layout */
body {
    background: #f5f7fa;
}

[data-theme="dark"] body {
    background: #0f172a;
}

/* Floating Navigation */
.sidebar {
    position: fixed;
    left: 20px;
    top: 20px;
    bottom: 20px;
    width: 280px;
    background: rgba(46,125,50,.95);
    backdrop-filter: blur(12px);
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(0,0,0,.20);
    display: flex;
    flex-direction: column;
    z-index: 1000;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme="dark"] .sidebar {
    background: rgba(15, 23, 42, 0.95);
    border: 1px solid rgba(255,255,255,0.1);
}

.logo-section {
    padding: 24px 20px;
    color: white;
    border-bottom: 1px solid rgba(255,255,255,.15);
}

.logo-section h2 {
    font-size: 1.1rem;
    line-height: 1.3;
    letter-spacing: -0.2px;
}

.nav-links {
    padding: 20px 16px;
    flex: 1;
    overflow-y: auto;
}

/* Override existing .nav-link styles inside sidebar */
.sidebar .nav-link {
    display: flex;
    align-items: center;
    gap: 12px;
    color: rgba(255,255,255,0.85);
    text-decoration: none;
    padding: 14px 16px;
    margin-bottom: 8px;
    border-radius: 12px;
    transition: .25s;
    font-weight: 500;
    font-size: 1rem;
    position: static; /* override header nav link */
}

.sidebar .nav-link::after {
    display: none; /* override header active indicator */
}

.sidebar .nav-link:hover {
    background: rgba(255,255,255,.15);
    color: white;
}

.sidebar .nav-link.active {
    background: white;
    color: #2E7D32;
    font-weight: 600;
}

[data-theme="dark"] .sidebar .nav-link.active {
    background: rgba(255,255,255,0.1);
    color: #34d399;
}

.login-panel {
    padding: 20px;
    border-top: 1px solid rgba(255,255,255,.15);
}

.login-btn {
    display: block;
    text-align: center;
    text-decoration: none;
    color: #2E7D32 !important;
    background: white !important;
    padding: 14px;
    border-radius: 12px;
    font-weight: 600 !important;
}

[data-theme="dark"] .login-btn {
    background: #34d399 !important;
    color: #0f172a !important;
}

/* Main Content Area */
.main-content {
    margin-left: 320px; /* 280 sidebar + 20 left + 20 gap */
    position: relative;
    z-index: 10;
    min-height: 100vh;
}

.topbar {
    position: sticky;
    top: 20px;
    margin: 20px;
    background: rgba(255,255,255,.85);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 6px 20px rgba(0,0,0,.08);
    z-index: 900;
}

[data-theme="dark"] .topbar {
    background: rgba(30, 41, 59, 0.85);
    box-shadow: 0 6px 20px rgba(0,0,0,.3);
    border: 1px solid rgba(255,255,255,0.05);
}

.search-box {
    width: 300px;
}

.search-box input {
    width: 100%;
    border: none;
    outline: none;
    background: #f1f5f9;
    padding: 12px 18px;
    border-radius: 10px;
    font-family: inherit;
    font-size: 0.95rem;
    color: inherit;
}

[data-theme="dark"] .search-box input {
    background: rgba(15, 23, 42, 0.6);
    color: #f1f5f9;
}

.page-content {
    padding: 0 20px 40px 20px;
}

.mobile-only-btn {
    display: none;
    background: transparent;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
}

#sidebar-close {
    color: white;
    background: rgba(255,255,255,0.2);
}

/* Adjustments to existing layout to fit inside the new wrapper safely */
#home-view {
    border-radius: 24px;
    overflow: hidden;
}
.hero {
    border-radius: 24px;
}

/* ── MOBILE RESPONSIVENESS ───────────────────────── */
@media (max-width: 992px) {
    .main-content {
        margin-left: 0;
    }
    
    .sidebar {
        transform: translateX(-120%);
        left: 10px;
        top: 10px;
        bottom: 10px;
        width: 300px;
    }
    
    .sidebar.sidebar-open {
        transform: translateX(0);
        box-shadow: 0 0 0 100vw rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.20);
    }
    
    .mobile-only-btn {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .desktop-only {
        display: none !important;
    }
    
    .search-box {
        width: 200px;
    }
}

@media (max-width: 576px) {
    .topbar {
        margin: 10px;
        padding: 12px 16px;
    }
    .search-box {
        display: none; /* hide search box on very small screens to fit toggle */
    }
    .page-content {
        padding: 0 10px 40px 10px;
    }
}
'''

with open('styles.css', 'a', encoding='utf-8') as f:
    f.write(new_css)

# Update app.js to handle the mobile sidebar toggle
with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

toggle_logic = '''
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
      // Close sidebar when a nav link is clicked on mobile
      document.querySelectorAll('#sidebar-nav-links .nav-link').forEach(link => {
          link.addEventListener('click', () => {
              if (window.innerWidth <= 992) {
                  sidebar.classList.remove('sidebar-open');
              }
          });
      });
  }

  // --- STATS COUNTERS ---'''

js = js.replace('  // --- STATS COUNTERS ---', toggle_logic)
# Bump version to bust cache
js = re.sub(r'\?v=\d+', '?v=5', js)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Layout upgrade applied successfully.")
