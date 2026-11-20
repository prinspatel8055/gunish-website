import json
import os

seed_data = {
    "users": [
        {
            "id": "user-admin-default",
            "username": "admin",
            "passwordHash": "$2b$12$Tj9zX.bM9kDuWQN4zzaLLeJy/YOehUhcl8PTwUVSKInkL0A7HWw4C",
            "name": "GUNICSH Administrator",
            "role": "SUPER_ADMIN",
            "isActive": True
        }
    ],
    "settings": [
        {
            "id": "setting-theme",
            "key": "theme",
            "value": "theme-gunish"
        },
        {
            "id": "setting-font",
            "key": "fontPairing",
            "value": "pairing-modern-sans"
        },
        {
            "id": "setting-site-name",
            "key": "siteName",
            "value": "GUNICSH"
        },
        {
            "id": "setting-app-settings",
            "key": "app_settings",
            "value": json.dumps({
                "siteName": "GUNICSH",
                "siteDescription": "Ganpat University International Conference on Social Sciences & Humanities",
                "contactEmail": "gunicsh@ganpatuniversity.ac.in",
                "defaultMetaTitle": "GUNICSH - Ganpat University | International Conference on Social Sciences & Humanities",
                "defaultMetaDescription": "Ganpat University International Conference on Social Sciences & Humanities (GUNICSH) — Human Technological Interaction (HTI), NEP 2020 Reforms, and Research Excellence.",
                "logoUrl": "/uploads/Logo.png",
                "faviconUrl": "/uploads/cropped-GNU_logo_icon-32x32.png"
            })
        },
        {
            "id": "setting-global-header",
            "key": "global_header",
            "value": json.dumps({
                "siteName": "GUNICSH",
                "subheading": "Faculty of Social Sciences & Humanities — Ganpat University",
                "logoUrl": "/uploads/Logo.png",
                "logoSize": "md",
                "navLinks": [
                    { "label": "Home", "href": "/" },
                    {
                        "label": "About",
                        "href": "/about-us",
                        "children": [
                            { "label": "About GUNICSH", "href": "/about-us" },
                            { "label": "The Conference", "href": "/the-conference" },
                            { "label": "Gallery", "href": "/gallery" }
                        ]
                    },
                    { "label": "Themes", "href": "/theme" },
                    { "label": "Call For Papers", "href": "/call-for-papers" },
                    {
                        "label": "Publications",
                        "href": "/publication",
                        "children": [
                            { "label": "Publication Overview", "href": "/publication" },
                            { "label": "Journal Articles", "href": "/journal-articles" }
                        ]
                    },
                    {
                        "label": "Committees",
                        "href": "/committees",
                        "children": [
                            { "label": "Organizing Committees", "href": "/committees" },
                            { "label": "Leadership & Team", "href": "/our-team" }
                        ]
                    },
                    { "label": "Registration Fees", "href": "/registration-fess" },
                    { "label": "Contact Us", "href": "/contact-us" }
                ],
                "ctaLabel": "Register Now",
                "ctaUrl": "/registration-fess"
            })
        },
        {
            "id": "setting-global-footer",
            "key": "global_footer",
            "value": json.dumps({
                "tagline": "Ganpat University International Conference on Social Sciences & Humanities (GUNICSH) — A premier global forum fostering research excellence, innovation, and multidisciplinary dialogue.",
                "copyright": "© Copyright {year}. Ganpat University — GUNICSH. All rights reserved.",
                "logoUrl": "/uploads/Logo.png",
                "columns": [
                    {
                        "heading": "Quick Links",
                        "links": [
                            { "label": "About Us", "href": "/about-us" },
                            { "label": "The Conference", "href": "/the-conference" },
                            { "label": "Conference Themes", "href": "/theme" },
                            { "label": "Call For Papers", "href": "/call-for-papers" },
                            { "label": "Gallery", "href": "/gallery" }
                        ]
                    },
                    {
                        "heading": "Conference Details",
                        "links": [
                            { "label": "Publication & Awards", "href": "/publication" },
                            { "label": "Journal Articles", "href": "/journal-articles" },
                            { "label": "Organizing Committees", "href": "/committees" },
                            { "label": "Registration & Fees", "href": "/registration-fess" },
                            { "label": "Conferences & Talks", "href": "/conferences-and-talks" }
                        ]
                    },
                    {
                        "heading": "Contact & Venue",
                        "links": [
                            { "label": "V. M. Patel College of Management Studies", "href": "/contact-us" },
                            { "label": "Ganpat University, Gujarat, India", "href": "/contact-us" },
                            { "label": "Email: gunicsh@ganpatuniversity.ac.in", "href": "mailto:gunicsh@ganpatuniversity.ac.in" },
                            { "label": "Prof. Rudri Dave: +91 94267 22001", "href": "tel:+919426722001" },
                            { "label": "Prof. Mohammad Ali: +91 84018 45036", "href": "tel:+918401845036" }
                        ]
                    }
                ],
                "socials": [
                    { "platform": "facebook", "url": "https://www.facebook.com/GanpatUniversityOfficial" },
                    { "platform": "twitter", "url": "https://twitter.com/Ganpat_Uni" },
                    { "platform": "linkedin", "url": "https://www.linkedin.com/school/ganpat-university/" },
                    { "platform": "youtube", "url": "https://www.youtube.com/@GanpatUniversityOfficial" }
                ]
            })
        },
        {
            "id": "setting-people-data",
            "key": "people_data",
            "value": json.dumps({
                "categories": [
                    { "id": "leadership", "label": "University Office Bearers" },
                    { "id": "chairs", "label": "Conference Chairs" },
                    { "id": "conveners", "label": "Conference Conveners" },
                    { "id": "co-conveners", "label": "Co-Conveners" },
                    { "id": "coordinators", "label": "Conference Coordinators" },
                    { "id": "advisory", "label": "Advisory Committee" }
                ],
                "designations": [
                    "Patron-In-Chief and President, Ganpat University",
                    "Pro-Chancellor & Director General, Ganpat University",
                    "Joint Director General, Ganpat University",
                    "Dean - Faculty of Social Sciences & Humanities",
                    "Director R & D, Ganpat University",
                    "Conference Chair",
                    "Conference Convener",
                    "Conference Co-Convener",
                    "Conference Coordinator",
                    "Advisory Committee Member"
                ]
            })
        }
    ],
    "media": [
        {
            "id": "media-gunish-logo",
            "filename": "Logo.png",
            "originalName": "Logo.png",
            "mimeType": "image/png",
            "size": 1350810,
            "url": "/uploads/Logo.png",
            "alt": "GUNICSH Logo"
        },
        {
            "id": "media-guni-campus",
            "filename": "Ganpat-University.jpg",
            "originalName": "Ganpat-University.jpg",
            "mimeType": "image/jpeg",
            "size": 350000,
            "url": "/uploads/Ganpat-University.jpg",
            "alt": "Ganpat University Campus"
        },
        {
            "id": "media-conf-flyer",
            "filename": "GUNICSH-Conf.-Flyer.jpeg",
            "originalName": "GUNICSH-Conf.-Flyer.jpeg",
            "mimeType": "image/jpeg",
            "size": 221086,
            "url": "/uploads/GUNICSH-Conf.-Flyer.jpeg",
            "alt": "GUNICSH Conference Flyer"
        },
        {
            "id": "media-dada-photo",
            "filename": "04-copy-263x216.jpg",
            "originalName": "04-copy-263x216.jpg",
            "mimeType": "image/jpeg",
            "size": 18000,
            "url": "/uploads/04-copy-263x216.jpg",
            "alt": "Dr. Ganpat I. Patel (DADA)"
        },
        {
            "id": "media-mahendra-sharma",
            "filename": "Mahendra-Sharma-263x216.jpg",
            "originalName": "Mahendra-Sharma-263x216.jpg",
            "mimeType": "image/jpeg",
            "size": 19000,
            "url": "/uploads/Mahendra-Sharma-263x216.jpg",
            "alt": "Dr. Mahendra Sharma"
        },
        {
            "id": "media-daniel-photo",
            "filename": "imageWnFrxR-263x216.jpg",
            "originalName": "imageWnFrxR-263x216.jpg",
            "mimeType": "image/jpeg",
            "size": 19000,
            "url": "/uploads/imageWnFrxR-263x216.jpg",
            "alt": "Daniel Montplaisir"
        },
        {
            "id": "media-ai-banner",
            "filename": "ai-banner.jpg",
            "originalName": "ai-banner.jpg",
            "mimeType": "image/jpeg",
            "size": 525024,
            "url": "/uploads/ai-banner.jpg",
            "alt": "AI & Technology Banner"
        },
        {
            "id": "media-team-banner",
            "filename": "team-banner.jpg",
            "originalName": "team-banner.jpg",
            "mimeType": "image/jpeg",
            "size": 357606,
            "url": "/uploads/team-banner.jpg",
            "alt": "Team Banner"
        },
        {
            "id": "media-know-partner",
            "filename": "know-part.png",
            "originalName": "know-part.png",
            "mimeType": "image/png",
            "size": 45000,
            "url": "/uploads/know-part.png",
            "alt": "Knowledge Partner"
        }
    ],
    "pages": []
}

pages_list = [
    # 1. HOME PAGE
    {
        "id": "page-home",
        "slug": "home",
        "title": "Home",
        "metaTitle": "GUNICSH - Ganpat University | International Conference on Social Sciences & Humanities",
        "metaDescription": "Ganpat University International Conference on Social Sciences & Humanities (GUNICSH) — Human Technological Interaction (HTI), NEP 2020 Reforms, and Research Excellence.",
        "order": 1,
        "isPublished": True,
        "sections": [
            {
                "id": "home-hero",
                "type": "hero",
                "data": {
                    "title": "Ganpat University International Conference on Social Sciences & Humanities",
                    "subtitle": "GUNICSH 2024",
                    "tagline": "Faculty of Social Sciences & Humanities (GUNIFSSH) — Ganpat University",
                    "taglineIcon": "Award",
                    "description": "4th International Conference on Human Technological Interaction (HTI), Education Reforms and its Global Impact through National Education Policy (NEP 2020). Join leading international scholars, educators, and researchers.",
                    "primaryCTA": { "label": "Submit Paper", "url": "/call-for-papers" },
                    "secondaryCTA": { "label": "Registration & Fees", "url": "/registration-fess" },
                    "bgImage": "/uploads/ai-banner.jpg",
                    "layoutVariant": "stats-grid",
                    "heroStats": [
                        { "value": "4th", "label": "International Edition", "icon": "Calendar" },
                        { "value": "500+", "label": "Delegates & Researchers", "icon": "Users" },
                        { "value": "SCOPUS", "label": "Publication Opportunities", "icon": "BookOpen" },
                        { "value": "₹5,100", "label": "Best Paper Cash Awards", "icon": "Award" }
                    ]
                }
            },
            {
                "id": "home-metrics",
                "type": "metrics",
                "data": {
                    "title": "Conference at a Glance",
                    "subtitle": "Celebrating academic excellence and international research collaboration",
                    "items": [
                        {
                            "icon": "Trophy",
                            "value": "₹5,100",
                            "label": "Best Paper Award",
                            "description": "First prize per track for academicians, corporate delegates & doctoral scholars"
                        },
                        {
                            "icon": "BookOpen",
                            "value": "SCOPUS & UGC",
                            "label": "Indexed Publication",
                            "description": "Special issues in Scopus and UGC CARE listed journals for selected papers"
                        },
                        {
                            "icon": "Globe",
                            "value": "International",
                            "label": "Global Participation",
                            "description": "Scholars, educators and industrial experts from prestigious institutions worldwide"
                        },
                        {
                            "icon": "FileCheck",
                            "value": "ISBN",
                            "label": "Conference Proceedings",
                            "description": "All accepted abstracts and registered papers published with official ISBN"
                        }
                    ]
                }
            },
            {
                "id": "home-about",
                "type": "narrative",
                "data": {
                    "title": "About GUNICSH & Ganpat University",
                    "category": "Academic Excellence",
                    "categoryIcon": "Sparkles",
                    "body": [
                        "Ganpat University is a well-reputed State Private University in Kherva, Mehsana in the state of Gujarat, India. It was established in 2005 through the State Legislative Act No. 19 of 2005, recognized by the UGC, and widely celebrated for industry-aligned pedagogy and research excellence.",
                        "The Faculty of Social Sciences & Humanities (GUNIFSSH) organizes the prestigious Ganpat University International Conference on Social Sciences & Humanities (GUNICSH). The conference provides a premier platform to academicians, practitioners, doctoral scholars, and students for exchanging knowledge, empirical research, and innovative ideas.",
                        "Following the celebrated success of our 1st National Conference on Emerging Issues in Accounting & Commerce, the 2nd International Conference on ESG & Sustainable Business, and the 3rd International Multidisciplinary Conference on Education Reforms, GUNICSH 2024 convenes on 'Human Technological Interaction (HTI)'."
                    ],
                    "imageUrl": "/uploads/Ganpat-University.jpg",
                    "imageAlt": "Ganpat University Campus",
                    "layout": "editorial",
                    "sidePanel": {
                        "title": "Conference Highlights",
                        "type": "list",
                        "items": [
                            "Scopus-indexed and UGC CARE listed journal publications",
                            "Prestigious Cash Prizes for Best Papers in each track",
                            "Hybrid presentation mode: In-Person and Online sessions",
                            "Official ISBN Conference Proceedings & Compendium (SAARANSH)"
                        ]
                    }
                }
            },
            {
                "id": "home-tracks",
                "type": "card_grid",
                "data": {
                    "title": "Conference Thematic Tracks",
                    "subtitle": "Multidisciplinary tracks inviting research papers, case studies, and poster presentations",
                    "category": "Tracks & Sub-themes",
                    "categoryIcon": "Layers",
                    "cardType": "pillar",
                    "columns": 2,
                    "items": [
                        {
                            "icon": "Cpu",
                            "title": "Track 1: Human Technological Interaction (HTI)",
                            "description": "Novel theoretical approaches to interaction, multimodal user interfaces, AI in humanities, UI/UX development, aesthetic issues, emotions in HTI, and human-centric computing paradigms.",
                            "tags": ["HTI", "AI & Humanities", "UI/UX", "Multimodal Systems"]
                        },
                        {
                            "icon": "Globe",
                            "title": "Track 2: Global Impact through NEP 2020",
                            "description": "Indian educational system and global standards, accreditation, ranking, and regulatory systems for higher education, evaluation standards, and quality research in higher education.",
                            "tags": ["NEP 2020", "Global Standards", "Accreditation", "Quality Research"]
                        },
                        {
                            "icon": "GraduationCap",
                            "title": "Track 3: Educational System Reforms & Inclusion",
                            "description": "Vocational education integration, teacher education, elementary education reforms, multidisciplinary holistic education, equity and inclusion, and policy frameworks for innovation.",
                            "tags": ["Education Reforms", "Vocational", "Inclusion", "Holistic Pedagogy"]
                        },
                        {
                            "icon": "TrendingUp",
                            "title": "Track 4: Transforming Business in ESG & Sustainability",
                            "description": "Environmental, Social, and Governance (ESG) performance, circular economy, post-pandemic economic recovery, poverty alleviation, ethical governance, and corporate responsibility.",
                            "tags": ["ESG", "Sustainability", "Management", "Corporate Governance"]
                        }
                    ]
                }
            },
            {
                "id": "home-leadership",
                "type": "people",
                "data": {
                    "title": "Patrons & University Leadership",
                    "subtitle": "Eminent leaders and educational visionaries guiding GUNICSH",
                    "titleAlignment": "center",
                    "categories": [
                        {
                            "id": "leadership",
                            "label": "University Office Bearers",
                            "people": [
                                {
                                    "name": "Dr. Ganpat I. Patel (DADA)",
                                    "role": "Patron-In-Chief and President, Ganpat University",
                                    "image": "/uploads/04-copy-263x216.jpg"
                                },
                                {
                                    "name": "Dr. Mahendra Sharma",
                                    "role": "Pro-Chancellor & Director General, Ganpat University",
                                    "image": "/uploads/Mahendra-Sharma-263x216.jpg"
                                },
                                {
                                    "name": "Daniel Montplaisir",
                                    "role": "Joint Director General, Ganpat University",
                                    "image": "/uploads/imageWnFrxR-263x216.jpg"
                                },
                                {
                                    "name": "Dr. Abhishek Parikh",
                                    "role": "Dean - Faculty of Social Sciences & Humanities (FSSH) & Conference Chair",
                                    "image": "/uploads/cropped-GNU_logo_icon.png"
                                },
                                {
                                    "name": "Dr. Ajay Gupta",
                                    "role": "Director R & D, Ganpat University",
                                    "image": "/uploads/cropped-GNU_logo_icon.png"
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "id": "home-quote",
                "type": "quote",
                "data": {
                    "quote": "Development that meets the needs of the present without compromising the ability of future generations to meet their own needs is pivotal for the new age of economic and social dynamics of the world.",
                    "author": "GUNICSH Steering Committee",
                    "citation": "Ganpat University — Faculty of Social Sciences & Humanities",
                    "layout": "editorial"
                }
            },
            {
                "id": "home-resources",
                "type": "card_grid",
                "data": {
                    "title": "Conference Resources & Downloads",
                    "subtitle": "Download brochures, flyers, submission guidelines, and research compendiums",
                    "category": "Downloads",
                    "categoryIcon": "Download",
                    "cardType": "initiative",
                    "columns": 3,
                    "items": [
                        {
                            "title": "Conference Brochure",
                            "subtitle": "Official PDF Brochure",
                            "description": "Download the comprehensive conference brochure with full schedule, tracks, guidelines, and committee list.",
                            "link": "/uploads/Conference-Brochure.pdf",
                            "icon": "FileDown",
                            "tags": ["Brochure", "PDF"]
                        },
                        {
                            "title": "Conference Flyer",
                            "subtitle": "Call for Papers Poster",
                            "description": "Official call for papers flyer highlighting key dates, cash prizes, and registration fee structures.",
                            "link": "/uploads/GUNICSH-Conf.-Flyer.jpeg",
                            "icon": "Image",
                            "tags": ["Flyer", "Poster"]
                        },
                        {
                            "title": "SAARANSH 2023 Compendium",
                            "subtitle": "Research Abstracts File",
                            "description": "Complete research abstract compendium presented during the 3rd International Multidisciplinary Conference.",
                            "link": "/uploads/FINAL-SAARANSH-single-file-kmp.pdf",
                            "icon": "BookOpen",
                            "tags": ["Abstracts", "SAARANSH"]
                        }
                    ]
                }
            }
        ]
    },

    # 2. ABOUT US PAGE
    {
        "id": "page-about-us",
        "slug": "about-us",
        "title": "About Us",
        "metaTitle": "About Us | GUNICSH - Ganpat University",
        "metaDescription": "Learn about the Ganpat University International Conference on Social Sciences & Humanities (GUNICSH), its history, milestones, and objectives.",
        "order": 2,
        "isPublished": True,
        "sections": [
            {
                "id": "about-hero",
                "type": "hero",
                "data": {
                    "title": "About GUNICSH",
                    "subtitle": "Faculty of Social Sciences & Humanities (GUNIFSSH)",
                    "description": "A premier multidisciplinary conference series dedicated to advancing inquiry, research innovation, and academic dialogue across social sciences, humanities, and modern technology.",
                    "isSubpage": True,
                    "variant": "subpage-dark",
                    "bgImage": "/uploads/team-banner.jpg"
                }
            },
            {
                "id": "about-narrative",
                "type": "narrative",
                "data": {
                    "title": "The GUNICSH Journey & Heritage",
                    "category": "Our Foundation",
                    "categoryIcon": "Sparkles",
                    "body": [
                        "The Ganpat University International Conference on Social Sciences and Humanities (GUNICSH) was established to provide an intellectual sanctuary where academicians, practitioners, doctoral scholars, and students collaborate on pressing socio-economic, educational, and technological issues.",
                        "1st National Conference: Organized on 'Emerging Issues in Accounting & Commerce', focusing on conceptual and empirical papers exploring economic expansion, diversified financial instruments, and commerce innovation.",
                        "2nd International Conference: Focused on 'Transforming Business in ESG (Environmental, Social, and Governance)', addressing sustainable development, post-pandemic economic recovery, and ethical business stewardship in alignment with the Brundtland Commission.",
                        "3rd International Multidisciplinary Conference: Convened on 'Education Reforms and its Global Impact through National Education Policy (NEP 2020)', providing educators and policymakers an open forum for evaluating curricular reforms and accreditation frameworks.",
                        "4th International Conference: Expanding into 'Human Technological Interaction (HTI)', exploring novel interfaces, artificial intelligence ethics, multimodal user experience, and technological transformation across social sciences."
                    ],
                    "imageUrl": "/uploads/GUNICSH-Conf.-Flyer.jpeg",
                    "imageAlt": "GUNICSH Conference Flyer",
                    "layout": "editorial"
                }
            },
            {
                "id": "about-pillars",
                "type": "card_grid",
                "data": {
                    "title": "Core Pillars of GUNICSH",
                    "subtitle": "The foundational objectives that drive our international conferences",
                    "columns": 3,
                    "cardType": "pillar",
                    "items": [
                        {
                            "icon": "GraduationCap",
                            "title": "Rigorous Academic Inquiry",
                            "description": "Encouraging rigorous empirical research, innovative methodologies, and deep theoretical perspectives."
                        },
                        {
                            "icon": "Globe",
                            "title": "International Collaboration",
                            "description": "Connecting scholars across global borders to address shared socio-economic and technological opportunities."
                        },
                        {
                            "icon": "BookCheck",
                            "title": "Publication Excellence",
                            "description": "Providing pathways to publish in Scopus-indexed and UGC CARE listed academic journals."
                        }
                    ]
                }
            },
            {
                "id": "about-timeline",
                "type": "timeline",
                "data": {
                    "title": "Evolution of GUNICSH Conferences",
                    "subtitle": "Milestones across the history of our conference series",
                    "style": "vertical",
                    "items": [
                        {
                            "year": "2018",
                            "title": "1st National Conference",
                            "institution": "V. M. Patel College of Management Studies (VMPCMS)",
                            "description": "National Conference on Emerging Issues in Accounting & Commerce.",
                            "highlights": ["50+ Research Papers Presented", "Delegates from across Indian universities"]
                        },
                        {
                            "year": "2022",
                            "title": "2nd International Conference (GCeMP 2k22)",
                            "institution": "Ganpat University (March 12-13, 2022)",
                            "description": "Theme: Transforming Business in ESG (Environmental, Social, and Governance).",
                            "highlights": ["Emphasis on Sustainability & Circular Economy", "Global scholarly participation"]
                        },
                        {
                            "year": "2023",
                            "title": "3rd International Multidisciplinary Conference",
                            "institution": "GUNIFSSH (March 17-18, 2023)",
                            "description": "Theme: Education Reforms and its Global Impact through National Education Policy (NEP 2020).",
                            "highlights": ["Release of SAARANSH 2023 Abstract Compendium", "Plenary addresses by educational policymakers"]
                        },
                        {
                            "year": "2024",
                            "title": "4th International Conference",
                            "institution": "GUNIFSSH (March 02-03, 2024)",
                            "description": "Theme: Human Technological Interaction (HTI).",
                            "highlights": ["Scopus Indexed Special Issues", "Cash Awards for Best Papers in each track"]
                        }
                    ]
                }
            }
        ]
    },

    # 3. THE CONFERENCE PAGE
    {
        "id": "page-the-conference",
        "slug": "the-conference",
        "title": "The Conference",
        "metaTitle": "The Conference | GUNICSH - Ganpat University",
        "metaDescription": "Discover details about the 4th International Conference on Human Technological Interaction (HTI) at Ganpat University.",
        "order": 3,
        "isPublished": True,
        "sections": [
            {
                "id": "conf-hero",
                "type": "hero",
                "data": {
                    "title": "The Conference",
                    "subtitle": "4th International Conference on Human Technological Interaction (HTI)",
                    "description": "March 02-03, 2024 | V. M. Patel College of Management Studies, Ganpat University, Gujarat, India.",
                    "isSubpage": True,
                    "variant": "subpage-dark",
                    "bgImage": "/uploads/ai-banner.jpg"
                }
            },
            {
                "id": "conf-narrative",
                "type": "narrative",
                "data": {
                    "title": "Conference Theme & Setting",
                    "category": "Event Overview",
                    "categoryIcon": "Calendar",
                    "body": [
                        "The Faculty of Social Sciences & Humanities (GUNIFSSH), Ganpat University, cordially invites academicians, industry professionals, doctoral researchers, and postgraduate students to the 4th International Conference on 'Human Technological Interaction (HTI)'.",
                        "Human Technological Interaction (HTI) is an emergent, transformative domain demanding substantial innovation toward radically new forms of collaboration between people and technological systems.",
                        "Venue: V. M. Patel College of Management Studies (VMPCMS), Ganpat University, Ganpat Vidyanagar-384012, Mehsana-Gandhinagar Highway, Mehsana, Gujarat, India.",
                        "The conference features plenary lectures, parallel technical tracks, interactive poster presentations, video-based research showcases, and roundtable discussions with seasoned practitioners."
                    ],
                    "imageUrl": "/uploads/Ganpat-University.jpg",
                    "imageAlt": "Conference Venue Ganpat University",
                    "layout": "editorial",
                    "sidePanel": {
                        "title": "Event Schedule & Details",
                        "type": "details",
                        "details": [
                            { "label": "Dates", "value": "March 02-03, 2024" },
                            { "label": "Venue", "value": "VMPCMS, Ganpat Vidyanagar, Mehsana" },
                            { "label": "Format", "value": "Hybrid (On-Campus & Virtual)" },
                            { "label": "Contact", "value": "gunicsh@ganpatuniversity.ac.in" }
                        ]
                    }
                }
            },
            {
                "id": "conf-archives",
                "type": "card_grid",
                "data": {
                    "title": "Conference Series Archive",
                    "subtitle": "Explore past proceedings, compendiums, and highlights",
                    "columns": 2,
                    "cardType": "standard",
                    "items": [
                        {
                            "title": "3rd International Conference (March 17-18, 2023)",
                            "subtitle": "Education Reforms & NEP 2020",
                            "description": "Delved into the transformational impact of NEP 2020 across higher education, vocational learning, and institutional accreditation. Download the full SAARANSH 2023 compendium.",
                            "link": "/uploads/FINAL-SAARANSH-single-file-kmp.pdf",
                            "icon": "BookOpen"
                        },
                        {
                            "title": "2nd International Conference - GCeMP 2k22",
                            "subtitle": "Transforming Business in ESG",
                            "description": "Investigated ESG performance, corporate governance, post-pandemic economic recovery, and sustainable business models. Download the conference brochure.",
                            "link": "/uploads/GCeMP2k22-Brouchure.pdf",
                            "icon": "FileText"
                        }
                    ]
                }
            }
        ]
    },

    # 4. THEME PAGE
    {
        "id": "page-theme",
        "slug": "theme",
        "title": "Theme",
        "metaTitle": "Conference Themes & Sub-Themes | GUNICSH",
        "metaDescription": "Explore the central theme of Human Technological Interaction (HTI), NEP 2020 sub-themes, and submission areas for GUNICSH.",
        "order": 4,
        "isPublished": True,
        "sections": [
            {
                "id": "theme-hero",
                "type": "hero",
                "data": {
                    "title": "Conference Themes",
                    "subtitle": "Human Technological Interaction (HTI) & NEP 2020 Reforms",
                    "description": "Discover our multidisciplinary research tracks covering technological interaction, educational reform, and sustainable economic dynamics.",
                    "isSubpage": True,
                    "variant": "subpage-dark",
                    "bgImage": "/uploads/ai-banner.jpg"
                }
            },
            {
                "id": "theme-narrative",
                "type": "narrative",
                "data": {
                    "title": "Central Theme: Human Technological Interaction (HTI)",
                    "category": "Theme Focus",
                    "categoryIcon": "Cpu",
                    "body": [
                        "The central theme of GUNI FSSH's 4th International Conference is Human Technological Interaction (HTI). It is a domain in urgent need of significant innovation and breakthrough toward radically new future forms of interaction.",
                        "We encourage participation in the HTI thematic area as a forum for scientific research and innovation in the interaction between humans and technology.",
                        "This thematic area addresses challenging and innovative topics in HTI theory, methodology, and practice, including novel theoretical approaches to interaction, novel user interface concepts and technologies, UI development methods, environments, multimodal user interfaces, emotions in HTI, aesthetic issues, HTI and children, evaluation methods and intelligent tools."
                    ],
                    "imageUrl": "/uploads/ai-banner.jpg",
                    "imageAlt": "Human Technological Interaction",
                    "layout": "editorial"
                }
            },
            {
                "id": "theme-subthemes",
                "type": "card_grid",
                "data": {
                    "title": "Sub-Themes Breakdown",
                    "subtitle": "Multidisciplinary topics welcoming empirical and conceptual contributions",
                    "columns": 2,
                    "cardType": "pillar",
                    "items": [
                        {
                            "icon": "Globe",
                            "title": "Global Impact through NEP 2020",
                            "description": "Indian Educational System and Global Standards; Accreditation, Ranking, and Regulatory Systems for Higher Education; Evaluation and Assessment Standards; Policy, Governance and Leadership; Quality Research and Innovation to Support Higher Education; Changing Higher Education Landscapes.",
                            "tags": ["NEP 2020", "Accreditation", "Global Standards", "Governance"]
                        },
                        {
                            "icon": "BookOpen",
                            "title": "Educational System Reforms through NEP 2020",
                            "description": "Vocational Education and Higher Education; Elementary Education and The National Education Policy 2020; Teacher Education; Multidisciplinary and Holistic Education; Equity and Inclusion in Higher Education; Comprehensive Review of Policies for Research, Patents, Innovations and Start-ups.",
                            "tags": ["System Reforms", "Vocational", "Holistic Education", "Patents"]
                        },
                        {
                            "icon": "Laptop",
                            "title": "Digital Transformation & Technology in Society",
                            "description": "E-learning models, digital pedagogies, accessibility tools, societal adoption of AI, ethics in autonomous systems, and digital literacy across communities.",
                            "tags": ["Digital Pedagogy", "AI Ethics", "Accessibility", "EdTech"]
                        },
                        {
                            "icon": "Leaf",
                            "title": "Sustainable Development & Social Work",
                            "description": "Community resilience, rural youth empowerment, agriculture perception, river and eco-infrastructure projects, self-efficacy among adolescents in difficult circumstances, and digital waste management.",
                            "tags": ["Sustainability", "Social Work", "Community", "Ecology"]
                        }
                    ]
                }
            }
        ]
    },

    # 5. CALL FOR PAPERS PAGE
    {
        "id": "page-call-for-papers",
        "slug": "call-for-papers",
        "title": "Call For Papers",
        "metaTitle": "Call For Papers | GUNICSH - Ganpat University",
        "metaDescription": "Submit your research papers, case studies, and extended abstracts to GUNICSH. Check submission guidelines and important dates.",
        "order": 5,
        "isPublished": True,
        "sections": [
            {
                "id": "cfp-hero",
                "type": "hero",
                "data": {
                    "title": "Call For Papers",
                    "subtitle": "Submission Guidelines & Important Dates",
                    "description": "We invite scholars, academicians, doctoral students, and practitioners to submit original research papers, case studies, and poster proposals.",
                    "isSubpage": True,
                    "variant": "subpage-dark",
                    "bgImage": "/uploads/team-banner.jpg"
                }
            },
            {
                "id": "cfp-narrative",
                "type": "narrative",
                "data": {
                    "title": "Invitation for Submissions",
                    "category": "Submissions",
                    "categoryIcon": "FileText",
                    "body": [
                        "Ideas on the conference themes in the form of full papers (academic/practitioner research/case studies), extended abstracts (work-in-progress), and proposals for poster presentations, video/film-based presentations, and panel/round-table discussions are invited.",
                        "All submissions should strictly be in Microsoft Word (.doc/.docx) format. Each paper will be evaluated through a rigorous double-blind peer review process based on originality, methodology, clarity, and contribution to the thematic area.",
                        "Submissions should be sent directly to the official conference email: gunicsh@ganpatuniversity.ac.in."
                    ],
                    "imageUrl": "/uploads/GUNICSH-Conf.-Flyer-3.jpeg",
                    "imageAlt": "Submission Guidelines",
                    "layout": "editorial",
                    "sidePanel": {
                        "title": "Submission Summary",
                        "type": "details",
                        "details": [
                            { "label": "Submission Email", "value": "gunicsh@ganpatuniversity.ac.in" },
                            { "label": "File Format", "value": "MS Word (.doc, .docx)" },
                            { "label": "Review Mode", "value": "Double-Blind Peer Review" },
                            { "label": "Reference Style", "value": "APA 7th Edition" }
                        ]
                    }
                }
            },
            {
                "id": "cfp-dates",
                "type": "card_grid",
                "data": {
                    "title": "Important Deadlines & Dates",
                    "subtitle": "Critical dates for paper submission, notification, and conference schedule",
                    "columns": 4,
                    "cardType": "roadmap",
                    "items": [
                        {
                            "title": "Abstract Submission",
                            "subtitle": "10th February",
                            "description": "Structured abstract of up to 250 words with 4-5 keywords.",
                            "icon": "FileText"
                        },
                        {
                            "title": "Abstract Acceptance",
                            "subtitle": "20th February",
                            "description": "Intimation of abstract acceptance and invitation for full paper.",
                            "icon": "CheckCircle"
                        },
                        {
                            "title": "Full Paper Submission",
                            "subtitle": "28th February",
                            "description": "Full manuscript submission (6,000 to 8,000 words in APA format).",
                            "icon": "UploadCloud"
                        },
                        {
                            "title": "Conference Dates",
                            "subtitle": "March 02-03",
                            "description": "Inaugural ceremony, plenary talks, and technical sessions.",
                            "icon": "Calendar"
                        }
                    ]
                }
            },
            {
                "id": "cfp-guidelines",
                "type": "card_grid",
                "data": {
                    "title": "Submission & Formatting Guidelines",
                    "subtitle": "Detailed manuscript requirements for authors",
                    "columns": 3,
                    "cardType": "academic",
                    "items": [
                        {
                            "icon": "FileCode",
                            "title": "Full Paper Format",
                            "description": "All full papers must include a title page, structured abstract (max 250 words), 4-5 keywords, main body with figures/tables, and APA references. Total word count: 6,000 to 8,000 words."
                        },
                        {
                            "icon": "FilePlus",
                            "title": "Extended Abstract & Posters",
                            "description": "Extended abstract (max 500 words) for work-in-progress projects is also invited for poster presentations and video/film-based research demonstrations."
                        },
                        {
                            "icon": "FileType",
                            "title": "File Specifications",
                            "description": "All submissions must be in Microsoft Word only. No PDF submissions will be entertained for the review process."
                        },
                        {
                            "icon": "UserCheck",
                            "title": "Title Page Details",
                            "description": "Include paper title, author name(s), designation(s), institutional affiliation(s), contact email ID, phone number, and brief resume/bio-note."
                        },
                        {
                            "icon": "Bookmark",
                            "title": "Citations & References",
                            "description": "References must strictly follow APA (American Psychological Association) 7th edition referencing conventions."
                        },
                        {
                            "icon": "ShieldCheck",
                            "title": "Originality & Ethics",
                            "description": "Manuscripts must be original and not submitted elsewhere. Similarity index must comply with academic standards."
                        }
                    ]
                }
            }
        ]
    },

    # 6. PUBLICATION PAGE
    {
        "id": "page-publication",
        "slug": "publication",
        "title": "Publication",
        "metaTitle": "Publication Opportunities & Awards | GUNICSH",
        "metaDescription": "Explore publication avenues in Scopus indexed journals, ISBN conference proceedings, and best paper cash awards at GUNICSH.",
        "order": 6,
        "isPublished": True,
        "sections": [
            {
                "id": "pub-hero",
                "type": "hero",
                "data": {
                    "title": "Publications & Awards",
                    "subtitle": "Scopus Indexed Journals, Proceedings & Cash Prizes",
                    "description": "Opportunities to publish in premier academic journals and win prestigious Best Paper cash awards.",
                    "isSubpage": True,
                    "variant": "subpage-dark",
                    "bgImage": "/uploads/ai-banner.jpg"
                }
            },
            {
                "id": "pub-narrative",
                "type": "narrative",
                "data": {
                    "title": "Publication Details & Journal Partnerships",
                    "category": "Publishing Avenues",
                    "categoryIcon": "BookOpen",
                    "body": [
                        "Selected papers from GUNICSH will be published in Scopus Indexed & SCOPUS listed Journals, subject to their own online submission and peer-review process.",
                        "A dedicated Special Issue in an indexed journal will be published as part of the conference publication output. Authors will get a prime opportunity to publish revised manuscripts in these special editions.",
                        "All accepted abstracts and registered papers will be published in the official Conference Proceedings with an assigned International Standard Book Number (ISBN).",
                        "Cash prizes and certificates of excellence will be awarded to outstanding researchers across academic, corporate, doctoral, and student categories."
                    ],
                    "imageUrl": "/uploads/ai-banner.jpg",
                    "imageAlt": "Publication Opportunities",
                    "layout": "editorial"
                }
            },
            {
                "id": "pub-awards",
                "type": "card_grid",
                "data": {
                    "title": "Best Paper Cash Awards",
                    "subtitle": "Recognizing excellence in scholarly research",
                    "columns": 2,
                    "cardType": "award",
                    "items": [
                        {
                            "icon": "Trophy",
                            "title": "Academician & Corporate Delegate Category",
                            "subtitle": "First Prize: Rs. 5,100 (Per Track)",
                            "description": "Awarded to the top-ranking research paper in each conference track authored by academicians, corporate practitioners, or doctoral scholars.",
                            "tags": ["Cash Award", "Rs. 5,100", "Per Track"]
                        },
                        {
                            "icon": "Medal",
                            "title": "Student Category",
                            "subtitle": "First Prize: Rs. 2,100",
                            "description": "Special cash prize and certificate of merit awarded to the best presented research paper in the undergraduate/postgraduate student category.",
                            "tags": ["Cash Award", "Rs. 2,100", "Student Category"]
                        }
                    ]
                }
            }
        ]
    },

    # 7. JOURNAL ARTICLES PAGE
    {
        "id": "page-journal-articles",
        "slug": "journal-articles",
        "title": "Journal Articles",
        "metaTitle": "Conference Journal Articles & Papers | GUNICSH",
        "metaDescription": "Browse research papers, journal articles, and the SAARANSH 2023 compendium published through GUNICSH.",
        "order": 7,
        "isPublished": True,
        "sections": [
            {
                "id": "articles-hero",
                "type": "hero",
                "data": {
                    "title": "Journal Articles & Compendium",
                    "subtitle": "Published Research from GUNICSH Conference Series",
                    "description": "Explore empirical studies, case analyses, and conference proceedings published across GUNICSH editions.",
                    "isSubpage": True,
                    "variant": "subpage-dark",
                    "bgImage": "/uploads/team-banner.jpg"
                }
            },
            {
                "id": "articles-disclaimer",
                "type": "narrative",
                "data": {
                    "title": "Conference Research Archive",
                    "category": "Scholarly Archive",
                    "categoryIcon": "FileText",
                    "body": [
                        "Disclaimer: The papers below represent research works presented and published in GUNICSH conferences. They are intended for private academic viewing by legitimate scholars.",
                        "Our archives feature landmark papers across education policy, psychological well-being, sustainable agriculture, environmental development, and commerce innovations."
                    ],
                    "imageUrl": "/uploads/FINAL-SAARANSH-single-file-kmp.pdf",
                    "layout": "editorial",
                    "sidePanel": {
                        "title": "Compendium Access",
                        "type": "list",
                        "items": [
                            "SAARANSH 2023: Full abstract compendium available for download",
                            "Peer-reviewed articles across multidisciplinary tracks",
                            "DOI indexed external links for participating partner journals"
                        ]
                    }
                }
            },
            {
                "id": "articles-grid",
                "type": "card_grid",
                "data": {
                    "title": "Featured Research Papers",
                    "subtitle": "A selection of published conference works",
                    "columns": 2,
                    "cardType": "academic",
                    "items": [
                        {
                            "icon": "FileText",
                            "title": "Factors Affecting Purchase Intention for Natural Frozen Food Products",
                            "subtitle": "Empirical Study on Sustainable Living",
                            "description": "An empirical study on factors affecting purchase intention for natural frozen food products: A way to healthy and sustainable life in today’s busy life.",
                            "tags": ["Sustainable Consumption", "Consumer Behavior", "Commerce"]
                        },
                        {
                            "icon": "FileText",
                            "title": "Promoting Self-Efficacy and Adjustment among Adolescents",
                            "subtitle": "Difficult Circumstances Interventions",
                            "description": "Investigating psychological resilience, coping strategies, and self-efficacy among adolescents facing adverse living circumstances.",
                            "tags": ["Psychology", "Adolescents", "Social Work"]
                        },
                        {
                            "icon": "FileText",
                            "title": "Social Work Education and E-learning during COVID-19",
                            "subtitle": "Challenges and Prospective Models",
                            "description": "Critical analysis of distance education paradigms, pedagogical continuity, and practical fieldwork constraints during the pandemic.",
                            "tags": ["Social Work", "E-Learning", "Higher Education"]
                        },
                        {
                            "icon": "FileText",
                            "title": "Personality, Impulsivity and Internet Consumption on Sexual Attitude",
                            "subtitle": "Youth Behavioral Studies",
                            "description": "Inter-relation of personality, impulsivity, and internet consumption on sexual attitude among modern youth cohorts.",
                            "tags": ["Behavioral Sciences", "Digital Media", "Youth"]
                        },
                        {
                            "icon": "FileText",
                            "title": "Rural Youth and Agriculture: Perception, Problems and Priorities",
                            "subtitle": "Agrarian Economy & Policy",
                            "description": "Comprehensive survey examining youth retention in agriculture, technological modernization of farms, and rural development priorities.",
                            "tags": ["Agriculture", "Rural Economy", "Youth Development"]
                        },
                        {
                            "icon": "FileText",
                            "title": "River Projects on the Ganges: Local Populace Perspectives",
                            "subtitle": "Varanasi Environmental Case Study",
                            "description": "Ecological and sociocultural impact assessment of Ganges developmental projects through field feedback from the local populace of Varanasi.",
                            "tags": ["Environment", "Ganges", "Local Community"]
                        },
                        {
                            "icon": "FileText",
                            "title": "Digitalized Waste Management in Steel City Jamshedpur",
                            "subtitle": "A Way Towards Sustainable Development",
                            "description": "Case study analyzing automated IoT-based waste segregation and circular urban sanitation infrastructure in Jamshedpur.",
                            "tags": ["Waste Management", "Smart Cities", "Urban Development"]
                        },
                        {
                            "icon": "BookOpen",
                            "title": "SAARANSH 2023 - Abstract Compendium",
                            "subtitle": "GUNICSH 2023 Conference Compendium",
                            "description": "Download the complete single-file compendium of research abstracts presented during the 3rd International Multidisciplinary Conference.",
                            "link": "/uploads/FINAL-SAARANSH-single-file-kmp.pdf",
                            "tags": ["Compendium", "SAARANSH", "Proceedings"]
                        }
                    ]
                }
            }
        ]
    },

    # 8. COMMITTEES PAGE
    {
        "id": "page-committees",
        "slug": "committees",
        "title": "Committees",
        "metaTitle": "Committees & Leadership | GUNICSH - Ganpat University",
        "metaDescription": "Meet the University Office Bearers, Conference Chairs, Conveners, Coordinators, and Advisory Committee members of GUNICSH.",
        "order": 8,
        "isPublished": True,
        "sections": [
            {
                "id": "committees-hero",
                "type": "hero",
                "data": {
                    "title": "Committees & Leadership",
                    "subtitle": "Ganpat University International Conference on Social Sciences & Humanities",
                    "description": "Eminent educators, leaders, and scholars orchestrating the GUNICSH conference series.",
                    "isSubpage": True,
                    "variant": "subpage-dark",
                    "bgImage": "/uploads/team-banner.jpg"
                }
            },
            {
                "id": "comm-office-bearers",
                "type": "people",
                "data": {
                    "title": "University Office Bearers",
                    "subtitle": "Visionary patrons guiding Ganpat University and GUNIFSSH",
                    "titleAlignment": "center",
                    "categories": [
                        {
                            "id": "office-bearers",
                            "label": "Office Bearers",
                            "people": [
                                {
                                    "name": "Dr. Ganpat I. Patel (DADA)",
                                    "role": "Patron-In-Chief and President, Ganpat University",
                                    "image": "/uploads/04-copy-263x216.jpg"
                                },
                                {
                                    "name": "Dr. Mahendra Sharma",
                                    "role": "Pro-Chancellor & Director General, Ganpat University",
                                    "image": "/uploads/Mahendra-Sharma-263x216.jpg"
                                },
                                {
                                    "name": "Daniel Montplaisir",
                                    "role": "Joint Director General, Ganpat University",
                                    "image": "/uploads/imageWnFrxR-263x216.jpg"
                                },
                                {
                                    "name": "Dr. Abhishek Parikh",
                                    "role": "Dean - Faculty of Social Sciences & Humanities (FSSH)",
                                    "image": "/uploads/cropped-GNU_logo_icon.png"
                                },
                                {
                                    "name": "Dr. Ajay Gupta",
                                    "role": "Director R & D, Ganpat University",
                                    "image": "/uploads/cropped-GNU_logo_icon.png"
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "id": "comm-chairs-conveners",
                "type": "card_grid",
                "data": {
                    "title": "Chairs & Organizing Conveners",
                    "subtitle": "Leading the coordination and execution of GUNICSH",
                    "columns": 2,
                    "cardType": "standard",
                    "items": [
                        {
                            "icon": "Award",
                            "title": "Conference Chairs",
                            "subtitle": "Academic Leadership",
                            "description": "Dr. Abhishek Parikh (Dean, FSSH)\nDr. Jayesh Patel",
                            "tags": ["Conference Chair", "Leadership"]
                        },
                        {
                            "icon": "UserCheck",
                            "title": "Conference Conveners",
                            "subtitle": "Executive Convening Committee",
                            "description": "Dr. Vipul Patel\nProf. Sanjay Vanani",
                            "tags": ["Convener", "Execution"]
                        },
                        {
                            "icon": "Users",
                            "title": "Co-Conveners",
                            "subtitle": "Core Committee",
                            "description": "Dr. Kundan Patel | Dr. Usha Kaushik | Dr. Kiran Patel | Dr. Vishal Acharya | Prof. Haresh Oza | Prof. Vikrant Desai",
                            "tags": ["Co-Convener"]
                        },
                        {
                            "icon": "PhoneCall",
                            "title": "Conference Coordinators",
                            "subtitle": "Delegate Relations & Operations",
                            "description": "Prof. Rudri Dave (+91 94267 22001)\nProf. Mohammad Ali (+91 84018 45036)\nProf. Khusbu Mistri | Prof. Krupa Modi | Prof. Ankita Mistri | Prof. Bhoomika Patel",
                            "tags": ["Coordinators", "Contacts"]
                        }
                    ]
                }
            },
            {
                "id": "comm-advisory",
                "type": "card_grid",
                "data": {
                    "title": "Advisory Committee",
                    "subtitle": "Distinguished scholars providing academic counsel and peer review oversight",
                    "columns": 4,
                    "cardType": "academic",
                    "items": [
                        { "icon": "GraduationCap", "title": "Dr. Subrat Sahu", "description": "Advisory Committee Member" },
                        { "icon": "GraduationCap", "title": "Dr. Hiren Patel", "description": "Advisory Committee Member" },
                        { "icon": "GraduationCap", "title": "Dr. Kishor Barad", "description": "Advisory Committee Member" },
                        { "icon": "GraduationCap", "title": "Dr. Maurvi Vasavada", "description": "Advisory Committee Member" },
                        { "icon": "GraduationCap", "title": "Dr. Yupal Shukla", "description": "Advisory Committee Member" },
                        { "icon": "GraduationCap", "title": "Dr. Ujal Mehta", "description": "Advisory Committee Member" },
                        { "icon": "GraduationCap", "title": "Prof. Remi Mitra", "description": "Advisory Committee Member" },
                        { "icon": "GraduationCap", "title": "Dr. Yashpalsinh Jadeja", "description": "Advisory Committee Member" }
                    ]
                }
            }
        ]
    },

    # 9. OUR TEAM PAGE
    {
        "id": "page-our-team",
        "slug": "our-team",
        "title": "Our Team",
        "metaTitle": "Our Team | GUNICSH - Ganpat University",
        "metaDescription": "Discover the dedicated leadership and team of the Faculty of Social Sciences & Humanities behind GUNICSH.",
        "order": 9,
        "isPublished": True,
        "sections": [
            {
                "id": "team-hero",
                "type": "hero",
                "data": {
                    "title": "Our Team",
                    "subtitle": "Faculty of Social Sciences & Humanities",
                    "description": "Committed educators, researchers, and administrators shaping the GUNICSH experience.",
                    "isSubpage": True,
                    "variant": "subpage-dark",
                    "bgImage": "/uploads/team-banner.jpg"
                }
            },
            {
                "id": "team-members",
                "type": "people",
                "data": {
                    "title": "Key Leadership Team",
                    "subtitle": "Executive leadership of GUNICSH and Ganpat University",
                    "titleAlignment": "center",
                    "categories": [
                        {
                            "id": "team-patrons",
                            "label": "Leadership Team",
                            "people": [
                                {
                                    "name": "Dr. Ganpat I. Patel (DADA)",
                                    "role": "Patron-In-Chief and President",
                                    "image": "/uploads/04-copy-263x216.jpg"
                                },
                                {
                                    "name": "Dr. Mahendra Sharma",
                                    "role": "Pro-Chancellor & Director General",
                                    "image": "/uploads/Mahendra-Sharma-263x216.jpg"
                                },
                                {
                                    "name": "Daniel Montplaisir",
                                    "role": "Joint Director General",
                                    "image": "/uploads/imageWnFrxR-263x216.jpg"
                                },
                                {
                                    "name": "Dr. Abhishek Parikh",
                                    "role": "Dean - FSSH & Conference Chair",
                                    "image": "/uploads/cropped-GNU_logo_icon.png"
                                },
                                {
                                    "name": "Dr. Ajay Gupta",
                                    "role": "Director R & D, GUNI",
                                    "image": "/uploads/cropped-GNU_logo_icon.png"
                                }
                            ]
                        }
                    ]
                }
            }
        ]
    },

    # 10. REGISTRATION FEES PAGE
    {
        "id": "page-registration-fees",
        "slug": "registration-fess",
        "title": "Registration Fees",
        "metaTitle": "Registration Fees & Payment Details | GUNICSH",
        "metaDescription": "Check the registration fees, tariff schedule, and official bank account details for GUNICSH conference participation.",
        "order": 10,
        "isPublished": True,
        "sections": [
            {
                "id": "reg-hero",
                "type": "hero",
                "data": {
                    "title": "Registration Fees",
                    "subtitle": "Tariff Schedule & Payment Credentials",
                    "description": "Transparent fee structure for Indian and international delegates, doctoral scholars, and students.",
                    "isSubpage": True,
                    "variant": "subpage-dark",
                    "bgImage": "/uploads/ai-banner.jpg"
                }
            },
            {
                "id": "reg-tariffs",
                "type": "card_grid",
                "data": {
                    "title": "Conference Registration Tariff",
                    "subtitle": "Registration fees categorized by delegate type and affiliation",
                    "columns": 3,
                    "cardType": "initiative",
                    "items": [
                        {
                            "icon": "Briefcase",
                            "title": "Indian Academician / Corporate",
                            "subtitle": "INR ₹1,500",
                            "description": "For Indian faculty members, industry executives, and corporate researchers.",
                            "tags": ["INR ₹1,500", "Indian Delegates"]
                        },
                        {
                            "icon": "GraduationCap",
                            "title": "Indian Scholars & Innovators",
                            "subtitle": "INR ₹1,000",
                            "description": "For Indian doctoral candidates, research assistants, and young innovators.",
                            "tags": ["INR ₹1,000", "Scholars"]
                        },
                        {
                            "icon": "Users",
                            "title": "Indian Students",
                            "subtitle": "INR ₹500",
                            "description": "Subsidized registration for undergraduate and postgraduate students from Indian colleges.",
                            "tags": ["INR ₹500", "Students"]
                        },
                        {
                            "icon": "Globe",
                            "title": "International Academician / Corporate",
                            "subtitle": "USD $40",
                            "description": "For foreign faculty members, international practitioners, and corporate delegates.",
                            "tags": ["$40 USD", "International"]
                        },
                        {
                            "icon": "Compass",
                            "title": "International Scholars & Innovators",
                            "subtitle": "USD $30",
                            "description": "For international PhD scholars, researchers, and young innovators.",
                            "tags": ["$30 USD", "International Scholars"]
                        },
                        {
                            "icon": "Award",
                            "title": "International Students",
                            "subtitle": "USD $20",
                            "description": "Subsidized registration for international students enrolled in accredited institutions.",
                            "tags": ["$20 USD", "International Students"]
                        }
                    ]
                }
            },
            {
                "id": "reg-bank-details",
                "type": "narrative",
                "data": {
                    "title": "Bank Account Details for Registration",
                    "category": "Electronic Payment",
                    "categoryIcon": "CreditCard",
                    "body": [
                        "Delegates are requested to remit their registration fee via NEFT / RTGS / IMPS / Direct Transfer to the official Ganpat University bank account specified below.",
                        "Bank Account Name: Ganpat University",
                        "Bank Name: AXIS BANK",
                        "Bank Account Number: 130010100235204",
                        "Bank Branch: MEHSANA",
                        "IFSC Code: UTIB0000130",
                        "GST will be applicable for all types of registration.",
                        "Early bird discount of 10% is available for early registrations.",
                        "After completing your remittance, kindly email the payment confirmation receipt / UTR number along with your paper ID to gunicsh@ganpatuniversity.ac.in."
                    ],
                    "layout": "editorial",
                    "sidePanel": {
                        "title": "Official Bank Details",
                        "type": "details",
                        "details": [
                            { "label": "Account Name", "value": "Ganpat University" },
                            { "label": "Bank Name", "value": "AXIS BANK" },
                            { "label": "Account No", "value": "130010100235204" },
                            { "label": "Branch", "value": "MEHSANA" },
                            { "label": "IFSC Code", "value": "UTIB0000130" }
                        ]
                    }
                }
            }
        ]
    },

    # 11. CONFERENCES AND TALKS PAGE
    {
        "id": "page-conferences-talks",
        "slug": "conferences-and-talks",
        "title": "Conferences And Talks",
        "metaTitle": "Conferences and Talks | GUNICSH - Ganpat University",
        "metaDescription": "Explore keynote talks, plenary lectures, and conference sessions from the GUNICSH series.",
        "order": 11,
        "isPublished": True,
        "sections": [
            {
                "id": "talks-hero",
                "type": "hero",
                "data": {
                    "title": "Conferences & Talks",
                    "subtitle": "Keynotes, Plenaries & Expert Panels",
                    "description": "Highlights of talks delivered by leading thinkers, policymakers, and scholars across GUNICSH editions.",
                    "isSubpage": True,
                    "variant": "subpage-dark",
                    "bgImage": "/uploads/ai-banner.jpg"
                }
            },
            {
                "id": "talks-content",
                "type": "card_grid",
                "data": {
                    "title": "Keynote Sessions & Plenary Dialogues",
                    "subtitle": "Featured sessions across our multidisciplinary conferences",
                    "columns": 2,
                    "cardType": "standard",
                    "items": [
                        {
                            "icon": "Mic",
                            "title": "Human-Centric Interaction in the AI Era",
                            "subtitle": "4th International Conference Keynote",
                            "description": "Examining ethical dilemmas, cognitive ergonomics, and multimodal user experience design in technology-driven societies.",
                            "tags": ["Keynote", "HTI", "AI"]
                        },
                        {
                            "icon": "Mic",
                            "title": "Reimagining Higher Education with NEP 2020",
                            "subtitle": "3rd International Conference Plenary",
                            "description": "Insights into institutional autonomy, credit mobility, multidisciplinary pedagogy, and the new regulatory framework under NEP 2020.",
                            "tags": ["Plenary", "NEP 2020", "Policy"]
                        },
                        {
                            "icon": "Mic",
                            "title": "Corporate Resilience through ESG Metrics",
                            "subtitle": "2nd International Conference (GCeMP 2k22)",
                            "description": "Frameworks for integrating environmental and social impact indicators into corporate balance sheets and stakeholder reports.",
                            "tags": ["ESG", "Corporate Governance", "Sustainability"]
                        },
                        {
                            "icon": "Mic",
                            "title": "Emerging Vistas in Commerce & Accounting",
                            "subtitle": "1st National Conference Address",
                            "description": "Technological disruptions, fintech integration, and evolving compliance standards across the Indian financial ecosystem.",
                            "tags": ["Fintech", "Commerce", "Accounting"]
                        }
                    ]
                }
            }
        ]
    },

    # 12. GALLERY PAGE
    {
        "id": "page-gallery",
        "slug": "gallery",
        "title": "Gallery",
        "metaTitle": "Gallery | GUNICSH - Ganpat University",
        "metaDescription": "View photographs and moments captured during GUNICSH conference ceremonies, presentations, and interactive sessions.",
        "order": 12,
        "isPublished": True,
        "sections": [
            {
                "id": "gallery-hero",
                "type": "hero",
                "data": {
                    "title": "Conference Gallery",
                    "subtitle": "Memories & Highlights from GUNICSH",
                    "description": "Visual highlights from our inaugural ceremonies, keynote addresses, paper presentation sessions, and delegate interactions.",
                    "isSubpage": True,
                    "variant": "subpage-dark",
                    "bgImage": "/uploads/team-banner.jpg"
                }
            },
            {
                "id": "gallery-module",
                "type": "gallery",
                "data": {
                    "title": "GUNICSH Photo Archives",
                    "subtitle": "Snapshots across past conference editions",
                    "categories": [
                        { "id": "all", "label": "All Photos" },
                        { "id": "sessions", "label": "Technical Sessions" },
                        { "id": "campus", "label": "Campus & Dignitaries" }
                    ],
                    "images": [
                        { "id": 1, "category": "sessions", "title": "Conference Presentation", "aspect": "wide", "imageUrl": "/uploads/1.jpg" },
                        { "id": 2, "category": "sessions", "title": "Delegate Session", "aspect": "square", "imageUrl": "/uploads/2.jpg" },
                        { "id": 3, "category": "sessions", "title": "Keynote Interaction", "aspect": "square", "imageUrl": "/uploads/3.jpg" },
                        { "id": 4, "category": "campus", "title": "Dignitary Felicitation", "aspect": "tall", "imageUrl": "/uploads/4.jpg" },
                        { "id": 5, "category": "campus", "title": "Conference Inauguration", "aspect": "wide", "imageUrl": "/uploads/5.jpg" },
                        { "id": 6, "category": "campus", "title": "Valedictory Ceremony", "aspect": "wide", "imageUrl": "/uploads/6.jpg" },
                        { "id": 7, "category": "campus", "title": "Ganpat University Campus", "aspect": "wide", "imageUrl": "/uploads/Ganpat-University.jpg" },
                        { "id": 8, "category": "sessions", "title": "Conference Flyer", "aspect": "tall", "imageUrl": "/uploads/GUNICSH-Conf.-Flyer.jpeg" }
                    ]
                }
            }
        ]
    },

    # 13. CONTACT US PAGE
    {
        "id": "page-contact-us",
        "slug": "contact-us",
        "title": "Contact Us",
        "metaTitle": "Contact Us | GUNICSH - Ganpat University",
        "metaDescription": "Get in touch with the GUNICSH conference team at V. M. Patel College of Management Studies, Ganpat University.",
        "order": 13,
        "isPublished": True,
        "sections": [
            {
                "id": "contact-hero",
                "type": "hero",
                "data": {
                    "title": "Contact Us",
                    "subtitle": "We are here to assist you",
                    "description": "Reach out to the GUNICSH organizing committee for inquiries regarding paper submissions, registration, travel, and accommodation.",
                    "isSubpage": True,
                    "variant": "subpage-dark",
                    "bgImage": "/uploads/team-banner.jpg"
                }
            },
            {
                "id": "contact-details",
                "type": "contact",
                "data": {
                    "title": "Connecting With GUNICSH",
                    "subtitle": "Conference Secretariat & Venue Information",
                    "email": "gunicsh@ganpatuniversity.ac.in",
                    "phone": "+91 94267 22001 / +91 84018 45036",
                    "address": "V. M. Patel College of Management Studies (VMPCMS), Ganpat University, Ganpat Vidyanagar-384012, Mehsana-Gandhinagar Highway, Mehsana, Gujarat, India.",
                    "officeHours": "Monday – Saturday: 9:00 AM – 5:00 PM IST",
                    "mapEmbedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3659.8824887372175!2d72.45524387532675!3d23.46467337886475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c47746536f987%3A0xb355ee246f4eb273!2sGanpat%20University!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                }
            },
            {
                "id": "contact-coordinators",
                "type": "card_grid",
                "data": {
                    "title": "Key Contact Persons",
                    "subtitle": "Direct contact details for conference coordinators",
                    "columns": 2,
                    "cardType": "standard",
                    "items": [
                        {
                            "icon": "Phone",
                            "title": "Prof. Rudri Dave",
                            "subtitle": "Conference Coordinator",
                            "description": "Phone: +91 94267 22001\nEmail: gunicsh@ganpatuniversity.ac.in",
                            "tags": ["Coordinator", "Delegate Assistance"]
                        },
                        {
                            "icon": "Phone",
                            "title": "Prof. Mohammad Ali",
                            "subtitle": "Conference Coordinator",
                            "description": "Phone: +91 84018 45036\nEmail: gunicsh@ganpatuniversity.ac.in",
                            "tags": ["Coordinator", "Submissions & Logistics"]
                        }
                    ]
                }
            }
        ]
    }
]

seed_data["pages"] = pages_list

output_path = "gunish-website/prisma/seed-data.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(seed_data, f, indent=2, ensure_ascii=False)

print(f"Generated {output_path} successfully with {len(pages_list)} pages and {len(seed_data['settings'])} settings!")
