import re

with open(r'd:\..111 web\gunish\unishac_gnu.sql', 'r', encoding='utf-8', errors='ignore') as f:
    sql = f.read()

# Find home page content
m = re.findall(r'(\d+),[^,\n]+,[^,\n]+,\'([^\']*kc_[^\']*)\',\'Home\'', sql)
if not m:
    m = re.findall(r'(\d+),[^,\n]+,[^,\n]+,\'([^\']*)\',\'Home\'', sql)

print(f"Found {len(m)} Home matches")
for item in m:
    print("Post ID:", item[0])
    content = item[1]
    # find images or carousel
    for part in re.findall(r'\[kc_[^\]]+\]', content):
        if 'image' in part or 'slider' in part or 'carousel' in part or 'banner' in part:
            print("  ", part[:200])
