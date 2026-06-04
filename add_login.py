import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Re-arrange the nav menu
old_nav = r'<a href="#about" class="nav-link" data-tab="about">About Us</a>\s*<a href="#contact" class="nav-link" data-tab="contact">Contact</a>'
new_nav = '''<a href="#contact" class="nav-link" data-tab="contact">Contact</a>
        <a href="#login" class="nav-link" data-tab="login">Login</a>
        <a href="#about" class="nav-link" data-tab="about">About Us</a>'''

html = re.sub(old_nav, new_nav, html)

# 2. Add the Login Section right before <!-- ==================== ABOUT US VIEW ==================== -->
login_section = '''
  <!-- ==================== LOGIN VIEW ==================== -->
  <section id="login-view" class="tab-content container">
    <div class="section-header">
      <span class="section-tag">Account</span>
      <h2>MeruPay Login</h2>
      <p>Sign in to access your dashboard, track payments, and manage bills.</p>
    </div>

    <div class="calculator-layout" style="justify-content: center;">
      <div class="calculator-form-card" style="max-width: 400px; width: 100%;">
        <form id="login-form">
          <div class="form-group">
            <label for="loginPhone">Phone Number or Email</label>
            <input type="text" id="loginPhone" class="form-control" placeholder="e.g. 0712345678" required>
          </div>
          <div class="form-group">
            <label for="loginPassword">Password / PIN</label>
            <input type="password" id="loginPassword" class="form-control" placeholder="Enter your secret PIN" required>
          </div>
          <div class="form-group" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; cursor: pointer; color: var(--text-color);">
              <input type="checkbox" style="width: 18px; height: 18px; accent-color: var(--primary-color);"> Remember Me
            </label>
            <a href="#" style="color: var(--primary-color); font-weight: 500; text-decoration: none;">Forgot PIN?</a>
          </div>
          <button type="button" class="btn btn-primary" style="width: 100%;">Sign In</button>
          
          <div style="text-align: center; margin-top: 20px; color: var(--text-color-light);">
            Don't have an account? <a href="#" style="color: var(--primary-color); font-weight: 600; text-decoration: none;">Register Now</a>
          </div>
        </form>
      </div>
    </div>
  </section>
  
'''

html = html.replace('<!-- ==================== ABOUT US VIEW ==================== -->', login_section + '<!-- ==================== ABOUT US VIEW ==================== -->')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
