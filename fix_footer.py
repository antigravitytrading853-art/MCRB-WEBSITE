import re
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

fixed_footer = '''  <!-- Footer Section -->
  <footer role="contentinfo">
    <div class="container footer-grid">
      <div class="footer-col footer-about">
        <img src="assets/MCRB LOGO.jpg" alt="MCRB Logo">
        <p>Established to modernise municipal operations, increase revenue transparency, and deliver efficient public services to the citizens and businesses of Meru County, Kenya.</p>
      </div>

      <div class="footer-col">
        <h3>Quick Navigation</h3>
        <ul class="footer-links">
          <li><a href="#home" data-tab="home">Home Page</a></li>
          <li><a href="#services" data-tab="services">Services Catalog</a></li>
          <li><a href="#calculator" data-tab="calculator">Fee Calculator</a></li>
          <li><a href="#portal" data-tab="portal">Self-Service Portal</a></li>
          <li><a href="#about" data-tab="about">Board Directors</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h3>Public Resources</h3>
        <ul class="footer-links">
          <li><a href="https://meru.go.ke" target="_blank">Meru County Government</a></li>
          <li><a href="https://investkenya.go.ke" target="_blank">Kenyan Investment Portal</a></li>
          <li><a href="https://kra.go.ke" target="_blank">Kenya Revenue Authority</a></li>
          <li><a href="https://meruassembly.go.ke/?s=Rating+Act" target="_blank">County Rating Act (Meru)</a></li>
'''

# Find everything from "<!-- Footer Section -->" to the first "<li><a href="assets/MERU COUNTY..."
html = re.sub(r'  <!-- Footer Section -->.*?          <li><a href="assets/MERU COUNTY', fixed_footer + '          <li><a href="assets/MERU COUNTY', html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
