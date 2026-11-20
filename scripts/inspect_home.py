import re
import json

sql_path = 'd:/..111 web/gunish/unishac_gnu.sql'

with open(sql_path, 'r', encoding='utf-8', errors='ignore') as f:
    sql = f.read()

# Let's inspect options: theme_mods_academix, academix_options
options_to_find = ['theme_mods_academix', 'academix_options', 'page_on_front', 'show_on_front', 'sidebars_widgets']
for opt in options_to_find:
    m = re.search(r"\(\d+,\s*'" + opt + r"',\s*'(.*?)',\s*'yes'\)", sql)
    if m:
        val = m.group(1)
        print(f"=== Option {opt} ===")
        print(val[:500])
        print()

# Now let's extract post_content of home page (id=1796)
m_home = re.search(r"\(1796,\s*1,\s*'[^']*',\s*'[^']*',\s*'(?P<content>.*?)',\s*'(?P<title>[^']*)',", sql)
if m_home:
    print("=== HOME PAGE TITLE ===")
    print(m_home.group('title'))
    print("=== HOME PAGE CONTENT ===")
    content = m_home.group('content').encode('utf-8').decode('unicode_escape', errors='ignore')
    print(content[:2500])
