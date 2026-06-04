import re
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()
matches = re.findall(r'<section.*?id="(.*?)"', content)
print('Section IDs:', matches)

with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()
if 'login-tab-btn' in js:
    print('JS contains login logic')
else:
    print('JS DOES NOT contain login logic')
