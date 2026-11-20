import re
from bs4 import BeautifulSoup

sql_path = 'd:/..111 web/gunish/unishac_gnu.sql'

with open(sql_path, 'r', encoding='utf-8', errors='ignore') as f:
    sql = f.read()

# Pattern to find all pages in wptlqc_posts
# Let's extract: id, title, slug, content
page_pattern = re.compile(
    r"\((?P<id>\d+),\s*1,\s*'[^']*',\s*'[^']*',\s*'(?P<content>(?:\\'|[^'])*?)',\s*'(?P<title>(?:\\'|[^'])*?)',\s*'(?:\\'|[^'])*?',\s*'publish',\s*'[^']*',\s*'[^']*',\s*'[^']*',\s*'(?P<slug>[a-zA-Z0-9_-]+)',.*?'page'",
    re.DOTALL
)

pages = []
for m in page_pattern.finditer(sql):
    pid = m.group('id')
    slug = m.group('slug')
    title = m.group('title').encode('utf-8').decode('unicode_escape', errors='ignore')
    content = m.group('content').encode('utf-8').decode('unicode_escape', errors='ignore')
    pages.append({'id': pid, 'slug': slug, 'title': title, 'content': content})

print(f"Extracted {len(pages)} pages")
for p in pages:
    soup = BeautifulSoup(p['content'], 'html.parser')
    imgs = [img.get('src') for img in soup.find_all('img')]
    text_len = len(soup.get_text(strip=True))
    print(f"Page [{p['slug']}] title='{p['title']}' text_len={text_len} imgs={len(imgs)}: {imgs[:3]}")
