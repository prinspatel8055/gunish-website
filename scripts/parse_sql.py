import re

sql_path = 'd:/..111 web/gunish/unishac_gnu.sql'

in_posts = False
rows = []

with open(sql_path, 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        if 'INSERT INTO `wptlqc_posts`' in line:
            in_posts = True
            continue
        if in_posts:
            if line.startswith('INSERT INTO') or line.startswith('CREATE TABLE') or line.startswith('DROP TABLE') or line.startswith('ALTER TABLE'):
                in_posts = False
                continue
            line = line.strip()
            if line.startswith('('):
                m = re.search(r",\s*'([^']*)',\s*'([^']*)',\s*(\d+)\)[,;]?$", line)
                if m:
                    ptype = m.group(1)
                    mime = m.group(2)
                    rows.append((ptype, mime, line))

def extract_fields(line):
    # Regex to extract ID, title, slug, status
    m = re.match(r"\((?P<id>\d+),\s*(?P<author>\d+),\s*'(?P<date>[^']*)',\s*'(?P<date_gmt>[^']*)',\s*(?P<rest>.*)$", line)
    if not m:
        return None
    pid = m.group('id')
    rest = m.group('rest')
    
    # post_name is near the end before post_type
    # Let's get title and post_name
    # Search for post_type at the end: ... 'post_parent', 'guid', menu_order, 'post_type', ...
    end_m = re.search(r",\s*(?P<parent>\d+),\s*'(?P<guid>[^']*)',\s*(?P<order>\d+),\s*'(?P<type>[^']*)',\s*'(?P<mime>[^']*)',\s*(?P<comment_count>\d+)\)[,;]?$", rest)
    if not end_m:
        return None
    ptype = end_m.group('type')
    guid = end_m.group('guid')
    
    # Search for slug: 'publish', ..., 'post_name', ...
    slug_m = re.search(r",\s*'(publish|inherit|draft|private)',\s*'[^']*',\s*'[^']*',\s*'[^']*',\s*'(?P<slug>[^']*)',", rest)
    slug = slug_m.group('slug') if slug_m else ''
    status = slug_m.group(1) if slug_m else ''
    
    return {'id': pid, 'type': ptype, 'status': status, 'slug': slug, 'guid': guid}

print("=== ALL PUBLISHED ITEMS BY TYPE ===")
for ptype, mime, line in rows:
    info = extract_fields(line)
    if info and info['status'] == 'publish':
        # Find title
        # title is after content: 'content', 'title', 'excerpt'
        print(f"[{info['type']}] id={info['id']} slug={info['slug']}")

# Let's also see what nav_menu_items exist
print("\n=== NAV MENUS ===")
for ptype, mime, line in rows:
    if ptype == 'nav_menu_item':
        info = extract_fields(line)
        if info:
            print(f"[menu] id={info['id']} slug={info['slug']}")
