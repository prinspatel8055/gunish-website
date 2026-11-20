import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const seedPath = path.join(process.cwd(), 'prisma', 'seed-data.json');
  const data = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

  const validSlugs = data.pages.map((p: any) => p.slug);
  
  // 1. Delete pages not in authentic list
  const del = await prisma.page.deleteMany({
    where: {
      slug: {
        notIn: validSlugs
      }
    }
  });
  console.log(`Deleted ${del.count} obsolete pages.`);

  // 2. Upsert each page
  for (const p of data.pages) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        sections: p.sections,
        order: p.order,
        isPublished: p.isPublished,
      },
      create: {
        id: p.id,
        slug: p.slug,
        title: p.title,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        sections: p.sections,
        order: p.order,
        isPublished: p.isPublished,
      }
    });
  }
  console.log(`Upserted all ${data.pages.length} authentic Gunish pages.`);

  // 3. Update global header & footer settings
  const headerSetting = await prisma.setting.findUnique({ where: { key: 'global_header' } });
  if (headerSetting) {
    const val = typeof headerSetting.value === 'string' ? JSON.parse(headerSetting.value) : headerSetting.value;
    val.logoUrl = '/uploads/LOGO-1.png';
    val.siteName = 'GUNICSH';
    val.subheading = 'Faculty of Social Sciences & Humanities — Ganpat University';
    val.ctaLabel = 'Registration Link';
    val.ctaUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScNZ1BmA6WxlZ4Bqp2yeGzY6r3Ee9ow2sIpm9WD8dyDXcfE8Q/viewform?usp=sf_link';
    await prisma.setting.update({
      where: { key: 'global_header' },
      data: { value: JSON.stringify(val) }
    });
  }

  const footerSetting = await prisma.setting.findUnique({ where: { key: 'global_footer' } });
  if (footerSetting) {
    const val = typeof footerSetting.value === 'string' ? JSON.parse(footerSetting.value) : footerSetting.value;
    val.logoUrl = '/uploads/LOGO-1.png';
    val.copyright = 'Copyright© 2024 - Gunicsh. All rights reserved.';
    await prisma.setting.update({
      where: { key: 'global_footer' },
      data: { value: JSON.stringify(val) }
    });
  }

  // 4. Update theme to theme-gunish
  await prisma.setting.upsert({
    where: { key: 'theme' },
    update: { value: 'theme-gunish' },
    create: { key: 'theme', value: 'theme-gunish' }
  });

  console.log('Database synchronization complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
