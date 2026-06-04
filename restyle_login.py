import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

new_login_section = '''  <!-- ==================== LOGIN VIEW ==================== -->
  <section id="login-view" class="tab-content">

    <div class="login-split-layout">

      <!-- LEFT PANEL: Branding -->
      <div class="login-brand-panel">
        <div class="login-brand-inner">
          <img src="assets/MCRB LOGO.jpg" alt="MCRB Logo" class="login-brand-logo">
          <h2 class="login-brand-title">Pay Smarter.<br>Serve Better.</h2>
          <p class="login-brand-subtitle">The Meru County Revenue Board digital platform puts all your county obligations in one secure place.</p>

          <ul class="login-feature-list">
            <li>
              <span class="login-feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </span>
              <span>Pay land rates, permits & parking in seconds</span>
            </li>
            <li>
              <span class="login-feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              </span>
              <span>M-Pesa & card payments fully integrated</span>
            </li>
            <li>
              <span class="login-feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </span>
              <span>Download official payment receipts instantly</span>
            </li>
            <li>
              <span class="login-feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </span>
              <span>Bank-grade encryption & secure sessions</span>
            </li>
          </ul>

          <div class="login-brand-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            Available 24/7 — No queues, no delays.
          </div>
        </div>
      </div>

      <!-- RIGHT PANEL: Login Form -->
      <div class="login-form-panel">
        <div class="login-form-card-wrap">

          <div class="login-form-header">
            <h3>Welcome Back</h3>
            <p>Sign in to continue to your MeruPay account</p>
          </div>

          <!-- Role Tabs -->
          <div class="login-tabs">
            <button class="login-tab-btn active" data-target="citizen-login">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Citizen / Business
            </button>
            <button class="login-tab-btn" data-target="staff-login">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              County Staff
            </button>
          </div>

          <!-- Citizen / Business Form -->
          <form id="citizen-login" class="login-form-view active">
            <div class="form-group">
              <label for="citizenId">ID / Business Registration No.</label>
              <div class="input-icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input type="text" id="citizenId" class="form-control" placeholder="e.g. 12345678 or PVT-XXXX" required>
              </div>
            </div>
            <div class="form-group">
              <label for="citizenPwd">Password</label>
              <div class="input-icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input type="password" id="citizenPwd" class="form-control" placeholder="Enter your password" required>
              </div>
            </div>
            <div class="login-meta-row">
              <label class="remember-me-label">
                <input type="checkbox" style="accent-color: var(--primary-color);"> Remember Me
              </label>
              <a href="#forgot" class="forgot-link">Forgot Password?</a>
            </div>
            <button type="button" class="btn btn-primary login-action-btn" style="width: 100%; justify-content: center; gap: 10px;">
              Sign In
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
            </button>
            <div class="login-footer-note">
              Don't have an account? <a href="#register" class="register-link">Register Now</a>
            </div>
          </form>

          <!-- Staff Form -->
          <form id="staff-login" class="login-form-view" style="display:none;">
            <div class="form-group">
              <label for="staffId">Staff User ID</label>
              <div class="input-icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <input type="text" id="staffId" class="form-control" placeholder="e.g. MCRB-1024" required>
              </div>
            </div>
            <div class="form-group">
              <label for="staffPwd">Password</label>
              <div class="input-icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input type="password" id="staffPwd" class="form-control" placeholder="Enter staff password" required>
              </div>
            </div>
            <div class="staff-notice">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              Restricted to authorized MCRB personnel only. All activity is monitored and logged.
            </div>
            <button type="button" class="btn btn-secondary login-action-btn" style="width: 100%; justify-content: center; gap: 10px;">
              Access Staff Portal
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
            </button>
          </form>

        </div>
      </div>

    </div>
  </section>'''

html = re.sub(r'  <!-- =+ LOGIN VIEW =+ -->.*?</section>', new_login_section, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Done patching index.html")
