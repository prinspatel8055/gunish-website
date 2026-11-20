import re
from bs4 import BeautifulSoup

sql_path = 'd:/..111 web/gunish/unishac_gnu.sql'

with open(sql_path, 'r', encoding='utf-8', errors='ignore') as f:
    sql = f.read()

page_ids = [275, 257, 2308, 459, 2343, 505, 2372, 198, 2578, 410, 523, 1796]

with open('d:/..111 web/gunish-website/scripts/pages_extracted.txt', 'w', encoding='utf-8') as out:
    for pid in page_ids:
        pattern = rf"\({pid},\s*1,\s*'[^']*',\s*'[^']*',\s*'(?P<content>(?:\\'|[^'])*?)',\s*'(?P<title>(?:\\'|[^'])*?)',"
        m = re.search(pattern, sql)
        if m:
            title = m.group('title').encode('utf-8').decode('unicode_escape', errors='ignore')
            content = m.group('content').encode('utf-8').decode('unicode_escape', errors='ignore')
            soup = BeautifulSoup(content, 'html.parser')
            imgs = [img.get('src') for img in soup.find_all('img')]
            links = [a.get('href') for a in soup.find_all('a') if a.get('href')]
            text = soup.get_text(separator=' ', strip=True)
            out.write(f"\n==========================================\n")
            out.write(f"PAGE ID {pid}: '{title}' (text length: {len(text)})\n")
            out.write(f"Images ({len(imgs)}): {imgs}\n")
            out.write(f"Links ({len(links)}): {links}\n")
            out.write(f"Text preview: {text[:400]}\n")
            # If tables
            tables = soup.find_all('table')
            if tables:
                out.write(f"Tables ({len(tables)}):\n")
                for tidx, table in enumerate(tables):
                    out.write(f"--- Table {tidx} ---\n")
                    for tr in table.find_all('tr'):
                        cells = [td.get_text(strip=True) for td in tr.find_all(['td', 'th'])]
                        out.write(f"  {cells}\n")

print("Saved pages_extracted.txt")
