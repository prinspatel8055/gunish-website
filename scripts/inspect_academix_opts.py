import re

sql_path = 'd:/..111 web/gunish/unishac_gnu.sql'

with open(sql_path, 'r', encoding='utf-8', errors='ignore') as f:
    sql = f.read()

m = re.search(r"\(\d+,\s*'academix_options',\s*'(.*?)',\s*'yes'\)", sql)
if m:
    raw = m.group(1).encode('utf-8').decode('unicode_escape', errors='ignore')
    # Let's search for colors or key settings in raw string
    colors = re.findall(r"(#[0-9a-fA-F]{3,8})", raw)
    print("Colors found in academix_options:", set(colors))
    
    # search for key names
    keys = re.findall(r's:\d+:"(academix_[^"]+)";', raw)
    print("Academix keys found:", keys[:30])
    
    # Print interesting settings
    for line in re.findall(r's:\d+:"(academix_[^"]+)";[a-z]:\d+:({[^}]*}|"[^"]*"|\d+);', raw):
        print("  ", line[0], "==>", line[1][:100])
