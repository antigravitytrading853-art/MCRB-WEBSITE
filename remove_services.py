with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if 'id="services-view"' in line:
        start_idx = i - 1 # Include the comment
        break

if start_idx != -1:
    open_tags = 0
    for i in range(start_idx + 1, len(lines)):
        line = lines[i]
        if '<section' in line:
            open_tags += 1
        if '</section>' in line:
            open_tags -= 1
            if open_tags == 0:
                end_idx = i
                break

if start_idx != -1 and end_idx != -1:
    print(f'Found from line {start_idx} to {end_idx}')
    del lines[start_idx:end_idx+1]
    with open('index.html', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print('Successfully removed.')
else:
    print('Could not find section boundaries.')
