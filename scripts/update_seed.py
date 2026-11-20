import json
import os

seed_path = 'd:/..111 web/gunish-website/prisma/seed-data.json'

with open(seed_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# 1. Update settings
for s in data.get('settings', []):
    k = s.get('key')
    if k == 'global_header':
        val = s.get('value')
        if isinstance(val, str):
            val = json.loads(val)
        val['logoUrl'] = '/uploads/LOGO-1.png'
        val['logoSize'] = 'md'
        val['siteName'] = 'GUNICSH'
        val['subheading'] = 'Faculty of Social Sciences & Humanities — Ganpat University'
        s['value'] = json.dumps(val) if isinstance(s.get('value'), str) else val
    elif k == 'global_footer':
        val = s.get('value')
        if isinstance(val, str):
            val = json.loads(val)
        val['logoUrl'] = '/uploads/LOGO-1.png'
        s['value'] = json.dumps(val) if isinstance(s.get('value'), str) else val

# 2. Update home page
for p in data.get('pages', []):
    if p.get('slug') == 'home':
        sections = p.get('sections', [])
        # Update Hero Section (index 0)
        if len(sections) > 0 and sections[0].get('type') == 'hero':
            sections[0]['data']['variant'] = 'slider'
            sections[0]['data']['showOverlayText'] = False
            sections[0]['data']['autoPlayInterval'] = 4000
            sections[0]['data']['slides'] = [
                {
                    "image": "/uploads/Job-145.jpg",
                    "title": "4th International Conference on Human Technological Interaction (HTI)",
                    "subtitle": "Faculty of Social Sciences & Humanities — Ganpat University",
                    "badge": "HTI 2024",
                    "ctaLabel": "Submit Paper",
                    "ctaUrl": "/call-for-papers"
                },
                {
                    "image": "/uploads/GCEMP_slider4.jpg",
                    "title": "International Conference on Social Sciences & Humanities",
                    "subtitle": "Ganpat University — Kherva, Mehsana, Gujarat",
                    "badge": "GUNICSH",
                    "ctaLabel": "Register Now",
                    "ctaUrl": "/registration-fess"
                },
                {
                    "image": "/uploads/GCEMP_slider1.jpg",
                    "title": "Global Academic Dialogue & Multidisciplinary Research",
                    "subtitle": "Education Reforms & NEP 2020 Impact",
                    "badge": "Conference",
                    "ctaLabel": "Explore Themes",
                    "ctaUrl": "/theme"
                },
                {
                    "image": "/uploads/GCEMP_slider2.jpg",
                    "title": "Faculty of Social Sciences & Humanities",
                    "subtitle": "V. M. Patel College of Management Studies",
                    "badge": "Ganpat University",
                    "ctaLabel": "About Us",
                    "ctaUrl": "/about-us"
                },
                {
                    "image": "/uploads/GCEMP_slider3.jpg",
                    "title": "Research Paper Presentations & Best Paper Awards",
                    "subtitle": "Cash Prizes of ₹5,100 per track for authors",
                    "badge": "Best Paper Award",
                    "ctaLabel": "Call for Papers",
                    "ctaUrl": "/call-for-papers"
                },
                {
                    "image": "/uploads/02.png",
                    "title": "GUNICSH 2024 International Conference",
                    "subtitle": "Ganpat University — Dedicated to Knowledge Sharing",
                    "badge": "International Conference",
                    "ctaLabel": "Register Now",
                    "ctaUrl": "/registration-fess"
                },
                {
                    "image": "/uploads/Slider-2.jpg",
                    "title": "Multidisciplinary Research in Social Sciences",
                    "subtitle": "Sociology, Psychology, Economics, Law & Technology",
                    "badge": "Research Tracks",
                    "ctaLabel": "View Themes",
                    "ctaUrl": "/theme"
                },
                {
                    "image": "/uploads/Ganpat-University.jpg",
                    "title": "Ganpat University Campus",
                    "subtitle": "World-Class Infrastructure & Vibrant Academic Atmosphere",
                    "badge": "Kherva Campus",
                    "ctaLabel": "The Conference",
                    "ctaUrl": "/the-conference"
                }
            ]

        # Check Resources & Downloads Section (index 6)
        for s in sections:
            if s.get('id') == 'home-resources':
                items = s['data'].get('items', [])
                if len(items) >= 3:
                    items[0]['image'] = '/uploads/Conference-Brochure-pdf.jpg'
                    items[0]['imageUrl'] = '/uploads/Conference-Brochure-pdf.jpg'
                    items[1]['image'] = '/uploads/GUNICSH-Conf.-Flyer.jpeg'
                    items[1]['imageUrl'] = '/uploads/GUNICSH-Conf.-Flyer.jpeg'
                    items[2]['image'] = '/uploads/Cover-GUNICSH-Compedium_Page_1-scaled.jpg'
                    items[2]['imageUrl'] = '/uploads/Cover-GUNICSH-Compedium_Page_1-scaled.jpg'

        # Insert a "Conference Editions & Past Conferences" section before resources if not present
        has_editions = any(s.get('id') == 'home-editions' for s in sections)
        if not has_editions:
            editions_section = {
                "id": "home-editions",
                "type": "card_grid",
                "data": {
                    "title": "GUNICSH Conference Editions",
                    "subtitle": "Browse our flagship annual conferences, flyers, and research milestones",
                    "category": "Conference Series",
                    "categoryIcon": "Award",
                    "cardType": "standard",
                    "columns": 4,
                    "items": [
                        {
                            "title": "4th International Conference",
                            "subtitle": "HTI & NEP 2020 Reforms (2024)",
                            "description": "Focussed on Human Technological Interaction and educational transformation under NEP 2020.",
                            "image": "/uploads/Job-145.jpg",
                            "imageUrl": "/uploads/Job-145.jpg",
                            "link": "/call-for-papers",
                            "icon": "Cpu"
                        },
                        {
                            "title": "3rd International Multidisciplinary",
                            "subtitle": "NEP 2020 & Global Impact (2023)",
                            "description": "Engaged over 400 scholars across humanities, sociology, and multidisciplinary domains.",
                            "image": "/uploads/GUNICSH-Conf.-Flyer.jpeg",
                            "imageUrl": "/uploads/GUNICSH-Conf.-Flyer.jpeg",
                            "link": "/the-conference",
                            "icon": "BookOpen"
                        },
                        {
                            "title": "2nd International - GCeMP 2k22",
                            "subtitle": "Transforming Business & ESG (2022)",
                            "description": "Explored corporate sustainability, management practices, and post-pandemic resilience.",
                            "image": "/uploads/FLAYER-GUNISH-e1643688511819.jpeg",
                            "imageUrl": "/uploads/FLAYER-GUNISH-e1643688511819.jpeg",
                            "link": "/the-conference",
                            "icon": "FileText"
                        },
                        {
                            "title": "1st National Conference",
                            "subtitle": "Social Sciences in Modern Era (2018)",
                            "description": "The inaugural milestone conference establishing the annual GUNICSH research platform.",
                            "image": "/uploads/GANPAT-UNIVERSITYVMPCMS-NATIONAL-CONFERENCE-BROCHURE-10th-feb-18_Page_1-scaled.jpg",
                            "imageUrl": "/uploads/GANPAT-UNIVERSITYVMPCMS-NATIONAL-CONFERENCE-BROCHURE-10th-feb-18_Page_1-scaled.jpg",
                            "link": "/the-conference",
                            "icon": "GraduationCap"
                        }
                    ]
                }
            }
            # Insert right before the last section (resources)
            sections.insert(len(sections) - 1, editions_section)

    # 3. Update the-conference page
    elif p.get('slug') == 'the-conference':
        for s in p.get('sections', []):
            if s.get('id') == 'conf-archives':
                s['data']['columns'] = 2
                s['data']['items'] = [
                    {
                        "title": "4th International Conference (HTI 2024)",
                        "subtitle": "Human Technological Interaction & NEP 2020",
                        "description": "Explores the intersections of human values and AI technology with keynote addresses and paper presentations.",
                        "image": "/uploads/Job-145.jpg",
                        "imageUrl": "/uploads/Job-145.jpg",
                        "link": "/call-for-papers",
                        "icon": "Cpu"
                    },
                    {
                        "title": "3rd International Conference (March 17-18, 2023)",
                        "subtitle": "Education Reforms & NEP 2020",
                        "description": "Delved into the transformational impact of NEP 2020. Download the full SAARANSH 2023 compendium.",
                        "image": "/uploads/GUNICSH-Conf.-Flyer.jpeg",
                        "imageUrl": "/uploads/GUNICSH-Conf.-Flyer.jpeg",
                        "link": "/uploads/FINAL-SAARANSH-single-file-kmp.pdf",
                        "icon": "BookOpen"
                    },
                    {
                        "title": "2nd International Conference - GCeMP 2k22",
                        "subtitle": "Transforming Business in ESG",
                        "description": "Investigated ESG performance, corporate governance, post-pandemic economic recovery, and sustainable business models.",
                        "image": "/uploads/FLAYER-GUNISH-e1643688511819.jpeg",
                        "imageUrl": "/uploads/FLAYER-GUNISH-e1643688511819.jpeg",
                        "link": "/uploads/GCeMP2k22-Brouchure.pdf",
                        "icon": "FileText"
                    },
                    {
                        "title": "1st National Conference (Feb 10, 2018)",
                        "subtitle": "National Conference on Management & Social Sciences",
                        "description": "Inaugural conference organized by V. M. Patel College of Management Studies, Ganpat University.",
                        "image": "/uploads/GANPAT-UNIVERSITYVMPCMS-NATIONAL-CONFERENCE-BROCHURE-10th-feb-18_Page_1-scaled.jpg",
                        "imageUrl": "/uploads/GANPAT-UNIVERSITYVMPCMS-NATIONAL-CONFERENCE-BROCHURE-10th-feb-18_Page_1-scaled.jpg",
                        "link": "/uploads/Conference-Brochure.pdf",
                        "icon": "GraduationCap"
                    }
                ]

    # 4. Update publication page
    elif p.get('slug') == 'publication':
        for s in p.get('sections', []):
            if s.get('id') == 'pub-awards':
                items = s['data'].get('items', [])
                if len(items) >= 2:
                    items[0]['image'] = '/uploads/Cover-GUNICSH-Compedium_Page_1-scaled.jpg'
                    items[0]['imageUrl'] = '/uploads/Cover-GUNICSH-Compedium_Page_1-scaled.jpg'
                    items[1]['image'] = '/uploads/GCEMP-2K22-Compendium-1_Page_01-scaled.jpg'
                    items[1]['imageUrl'] = '/uploads/GCEMP-2K22-Compendium-1_Page_01-scaled.jpg'

# Save back
with open(seed_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print('Successfully updated seed-data.json with slider, conference images, and logos!')
