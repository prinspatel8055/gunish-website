import re
from bs4 import BeautifulSoup

sql_path = 'd:/..111 web/gunish/unishac_gnu.sql'

with open(sql_path, 'r', encoding='utf-8', errors='ignore') as f:
    sql = f.read()

m_home = re.search(r"\(1796,\s*1,\s*'[^']*',\s*'[^']*',\s*'(?P<content>.*?)',\s*'(?P<title>[^']*)',", sql)
content = m_home.group('content').encode('utf-8').decode('unicode_escape', errors='ignore')

soup = BeautifulSoup(content, 'html.parser')

with open('d:/..111 web/gunish-website/scripts/home_extracted.txt', 'w', encoding='utf-8') as out:
    out.write("=== IMAGES IN ORIGINAL HOME PAGE ===\n")
    for i, img in enumerate(soup.find_all('img')):
        out.write(f"[{i}] src={img.get('src')} alt={img.get('alt')}\n")

    out.write("\n=== HEADINGS ===\n")
    for h in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
        out.write(f"[{h.name}] {h.get_text(strip=True)}\n")

    out.write("\n=== LINKS ===\n")
    for a in soup.find_all('a'):
        txt = a.get_text(strip=True)
        href = a.get('href')
        out.write(f"<a> text='{txt}' href='{href}'\n")

    out.write("\n=== TEXT BLOCKS ===\n")
    for tag in soup.find_all(['p', 'div']):
        # If it has direct text and no children with lots of text
        t = tag.get_text(strip=True)
        if len(t) > 30 and len(tag.find_all(['p', 'div'])) == 0:
            out.write(f"[{tag.name}] {t}\n\n")

print("Saved home_extracted.txt")
