from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time

options = Options()
options.add_argument('--headless')
options.add_argument('--window-size=1920,1080')
options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})

driver = webdriver.Chrome(options=options)
driver.get('http://localhost:8080')

time.sleep(1)

print("--- Initial Logs ---")
for entry in driver.get_log('browser'):
    print(entry)

print("Nav links count:", len(driver.find_elements(By.CSS_SELECTOR, '.nav-link')))

print("Clicking services...")
try:
    link = driver.find_element(By.CSS_SELECTOR, 'a[data-tab="services"]')
    # Use javascript click to bypass any interactability issues in headless
    driver.execute_script("arguments[0].click();", link)
except Exception as e:
    print("Error:", e)

time.sleep(1)

print("--- Logs after clicking services ---")
for entry in driver.get_log('browser'):
    print(entry)

print("Current URL:", driver.current_url)
print("Visible tab-content ID:", driver.execute_script("""
    let active = document.querySelector('.tab-content.active');
    return active ? active.id : null;
"""))

driver.quit()
