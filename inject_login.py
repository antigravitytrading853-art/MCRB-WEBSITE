import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Make sure we remove any stray login or register views if they exist
html = re.sub(r'<!-- =+ LOGIN VIEW =+ -->.*?</section>', '', html, flags=re.DOTALL)
html = re.sub(r'<!-- =+ REGISTER VIEW =+ -->.*?</section>', '', html, flags=re.DOTALL)
html = re.sub(r'<section id="login-view".*?</section>', '', html, flags=re.DOTALL)
html = re.sub(r'<section id="register-view".*?</section>', '', html, flags=re.DOTALL)

new_login_sections = '''
  <!-- ==================== LOGIN VIEW ==================== -->
  <section id="login-view" class="tab-content container">
    <div class="section-header">
      <span class="section-tag">Account Access</span>
      <h2>MeruPay Portal Login</h2>
      <p>Securely access your dashboard, payments, and county services.</p>
    </div>

    <div class="calculator-layout" style="justify-content: center;">
      <div class="calculator-form-card" style="max-width: 420px; width: 100%; padding: 0; overflow: hidden;">
        
        <!-- Login Tabs Header -->
        <div class="login-tabs" style="display: flex; border-bottom: 1px solid var(--border-color); background: var(--bg-alt);">
          <button class="login-tab-btn active" data-target="citizen-login" style="flex: 1; padding: 18px 10px; border: none; background: transparent; font-family: 'Inter', sans-serif; font-size: 1rem; font-weight: 600; color: var(--primary-color); border-bottom: 3px solid var(--primary-color); cursor: pointer; transition: all 0.3s;">Citizen / Business</button>
          <button class="login-tab-btn" data-target="staff-login" style="flex: 1; padding: 18px 10px; border: none; background: transparent; font-family: 'Inter', sans-serif; font-size: 1rem; font-weight: 600; color: var(--text-color-light); border-bottom: 3px solid transparent; cursor: pointer; transition: all 0.3s;">County Staff</button>
        </div>

        <div style="padding: 30px;">
          <!-- Citizen / Business Form -->
          <form id="citizen-login" class="login-form-view active">
            <div class="form-group">
              <label for="citizenId">ID / Business Registration No.</label>
              <div style="position: relative;">
                <input type="text" id="citizenId" class="form-control" placeholder="e.g. 12345678 or PVT-XXXX" required style="padding-left: 42px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-color-light)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 14px; top: 14px;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
            </div>
            <div class="form-group">
              <label for="citizenPwd">Password</label>
              <div style="position: relative;">
                <input type="password" id="citizenPwd" class="form-control" placeholder="Enter your password" required style="padding-left: 42px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-color-light)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 14px; top: 14px;"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
            </div>
            <div class="form-group" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; font-size: 0.9rem;">
              <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; cursor: pointer; color: var(--text-color);">
                <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary-color);"> Remember Me
              </label>
              <a href="#forgot" style="color: var(--primary-color); font-weight: 600; text-decoration: none;">Forgot Password?</a>
            </div>
            <button type="button" class="btn btn-primary login-action-btn" style="width: 100%; display: flex; justify-content: center; align-items: center; gap: 10px;">
              Sign In <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
            </button>
            <div style="text-align: center; margin-top: 24px; color: var(--text-color); font-size: 0.95rem;">
              Don't have an account? <a href="#register" class="register-link" style="color: var(--primary-color); font-weight: 600; text-decoration: none; margin-left: 5px;">Register Now</a>
            </div>
          </form>

          <!-- Staff Form -->
          <form id="staff-login" class="login-form-view" style="display: none;">
            <div class="form-group">
              <label for="staffId">Staff User ID</label>
              <div style="position: relative;">
                <input type="text" id="staffId" class="form-control" placeholder="e.g. MCRB-1024" required style="padding-left: 42px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-color-light)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 14px; top: 14px;"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
            </div>
            <div class="form-group">
              <label for="staffPwd">Password</label>
              <div style="position: relative;">
                <input type="password" id="staffPwd" class="form-control" placeholder="Enter staff password" required style="padding-left: 42px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-color-light)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 14px; top: 14px;"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
            </div>
            <div style="background: rgba(var(--primary-rgb), 0.05); padding: 15px; border-radius: 8px; margin-bottom: 24px; display: flex; gap: 10px; align-items: flex-start; border: 1px solid rgba(var(--primary-rgb), 0.1);">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              <span style="font-size: 0.85rem; color: var(--text-color-light); line-height: 1.4;">Access to the staff portal is restricted to authorized Meru County personnel. Activity is monitored.</span>
            </div>
            <button type="button" class="btn btn-secondary login-action-btn" style="width: 100%; display: flex; justify-content: center; align-items: center; gap: 10px;">
              Access Portal <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
            </button>
          </form>

        </div>
      </div>
    </div>
  </section>

  <!-- ==================== REGISTER VIEW ==================== -->
  <section id="register-view" class="tab-content container">
    <div class="section-header">
      <span class="section-tag">New Account</span>
      <h2>Create an Account</h2>
      <p>Register as a Citizen or Business to access county digital services.</p>
    </div>

    <div class="calculator-layout" style="justify-content: center;">
      <div class="calculator-form-card" style="max-width: 500px; width: 100%;">
        <form id="registration-form">
          <div class="form-group">
            <label for="regType">Account Type</label>
            <select id="regType" class="form-control">
              <option value="citizen">Individual Citizen</option>
              <option value="business">Business / Organization</option>
            </select>
          </div>
          
          <div style="display: flex; gap: 15px;">
            <div class="form-group" style="flex: 1;">
              <label for="regFirstName">First Name</label>
              <input type="text" id="regFirstName" class="form-control" placeholder="John" required>
            </div>
            <div class="form-group" style="flex: 1;">
              <label for="regLastName">Last Name</label>
              <input type="text" id="regLastName" class="form-control" placeholder="Doe" required>
            </div>
          </div>
          
          <div class="form-group">
            <label for="regId">ID Number / Business Registration</label>
            <input type="text" id="regId" class="form-control" placeholder="e.g. 12345678" required>
          </div>
          
          <div class="form-group">
            <label for="regPhone">Phone Number</label>
            <input type="tel" id="regPhone" class="form-control" placeholder="07XX XXX XXX" required>
          </div>
          
          <div class="form-group">
            <label for="regPassword">Create Password</label>
            <input type="password" id="regPassword" class="form-control" placeholder="Strong password" required>
          </div>
          
          <div class="form-group" style="margin-bottom: 24px;">
            <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; color: var(--text-color-light); font-size: 0.9rem; line-height: 1.4;">
              <input type="checkbox" style="width: 18px; height: 18px; margin-top: 2px; accent-color: var(--primary-color);" required>
              I agree to the Meru County Revenue Board Terms of Service and Privacy Policy.
            </label>
          </div>
          
          <button type="button" class="btn btn-primary" style="width: 100%;">Complete Registration</button>
          
          <div style="text-align: center; margin-top: 24px; color: var(--text-color); font-size: 0.95rem;">
            Already have an account? <a href="#login" class="login-link" style="color: var(--primary-color); font-weight: 600; text-decoration: none; margin-left: 5px;">Sign In Here</a>
          </div>
        </form>
      </div>
    </div>
  </section>
'''

html = html.replace('<!-- Footer Section -->', new_login_sections + '\n  <!-- Footer Section -->')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
