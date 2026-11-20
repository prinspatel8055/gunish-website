import type { Metadata } from 'next';
import { Inter, Playfair_Display, Outfit } from 'next/font/google';
import { prisma } from '@/lib/prisma';
import '@/styles/fonts.css';
import '@/styles/globals.css';
import SmoothScroll from '@/app/components/SmoothScroll';
import ScrollToTop from '@/app/components/shared/ScrollToTop';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Outfit is the default heading font (pairing-modern-sans) — always preloaded
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

// Playfair Display is only used in the non-default 'pairing-classic' mode — not preloaded
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'app_settings' },
    });
    if (setting) {
      const appSettings = JSON.parse(setting.value);
      return {
        title: {
          default: appSettings.defaultMetaTitle || 'GUNICSH - Ganpat University | International Conference on Social Sciences & Humanities',
          template: `%s | ${appSettings.siteName || 'GUNICSH - Ganpat University'}`,
        },
        description: appSettings.defaultMetaDescription || 'Ganpat University International Conference on Social Sciences & Humanities (GUNICSH) — Human Technological Interaction, Education Reforms, and Research Excellence.',
        icons: {
          icon: appSettings.faviconUrl || '/favicon.ico',
        },
        keywords: ['GUNICSH', 'Gunish', 'Ganpat University', 'Social Sciences', 'Humanities', 'NEP 2020', 'International Conference', 'Research Papers', 'VMPCMS'],
      };
    }
  } catch (error) {
    console.error('Failed to generate metadata:', error);
  }

  return {
    title: {
      default: 'GUNICSH - Ganpat University | International Conference on Social Sciences & Humanities',
      template: '%s | GUNICSH - Ganpat University',
    },
    description:
      'Ganpat University International Conference on Social Sciences & Humanities (GUNICSH) — Human Technological Interaction, Education Reforms, and Research Excellence.',
    icons: {
      icon: '/favicon.ico',
    },
    keywords: ['GUNICSH', 'Gunish', 'Ganpat University', 'Social Sciences', 'Humanities', 'NEP 2020', 'International Conference', 'Research Papers', 'VMPCMS'],
  };
}

export const revalidate = 10; // Cache and revalidate settings every 10 seconds for speed

async function getThemeAndFont() {
  try {
    const [themeSetting, fontSetting] = await Promise.all([
      prisma.setting.findUnique({ where: { key: 'theme' } }),
      prisma.setting.findUnique({ where: { key: 'fontPairing' } }),
    ]);
    return {
      theme: themeSetting?.value || 'theme-gunish',
      fontPairing: fontSetting?.value || 'pairing-modern-sans',
    };
  } catch {
    return {
      theme: 'theme-gunish',
      fontPairing: 'pairing-modern-sans',
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let { theme, fontPairing } = await getThemeAndFont();
  if (theme.startsWith('{')) theme = 'theme-gunish';
  if (fontPairing.startsWith('{')) fontPairing = 'pairing-modern-sans';

  const isModernFont = fontPairing === 'pairing-modern-sans';

  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${playfairDisplay.variable} ${outfit.variable} ${theme}`}
      style={{
        '--font-heading': isModernFont ? "var(--font-outfit), sans-serif" : "var(--font-playfair), serif",
        '--font-body': "var(--font-inter), sans-serif",
      } as React.CSSProperties}
    >
      <body className="antialiased">
        <SmoothScroll />
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
