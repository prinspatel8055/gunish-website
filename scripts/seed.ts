import { PrismaClient } from "@prisma/client";
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log("=== Seeding Gunish (GUNICSH) Database ===");
  
  const seedPaths = [
    path.join(process.cwd(), 'prisma', 'seed-data.json'),
    path.join(process.cwd(), 'backups', 'db_backup.json'),
  ];

  let backupData: any = null;

  for (const p of seedPaths) {
    if (fs.existsSync(p)) {
      try {
        backupData = JSON.parse(fs.readFileSync(p, 'utf8'));
        console.log(`Loaded Gunish snapshot from: ${p}`);
        break;
      } catch (e: any) {
        console.warn(`Could not parse ${p}:`, e.message);
      }
    }
  }

  if (backupData && backupData.pages && backupData.pages.length > 0) {
    // 1. Seed Users
    if (backupData.users && backupData.users.length > 0) {
      console.log(`Seeding ${backupData.users.length} users...`);
      for (const u of backupData.users) {
        await prisma.user.upsert({
          where: { username: u.username },
          update: {
            passwordHash: u.passwordHash,
            role: u.role,
          },
          create: u,
        });
      }
    }

    // 2. Seed Settings
    if (backupData.settings && backupData.settings.length > 0) {
      console.log(`Seeding ${backupData.settings.length} settings...`);
      for (const s of backupData.settings) {
        await prisma.setting.upsert({
          where: { key: s.key },
          update: { value: s.value },
          create: s,
        });
      }
    }

    // 3. Seed Media
    if (backupData.media && backupData.media.length > 0) {
      console.log(`Seeding ${backupData.media.length} media items...`);
      for (const m of backupData.media) {
        await prisma.media.upsert({
          where: { id: m.id },
          update: m,
          create: m,
        });
      }
    }

    // 4. Seed Pages
    if (backupData.pages && backupData.pages.length > 0) {
      console.log(`Seeding ${backupData.pages.length} pages...`);
      for (const p of backupData.pages) {
        await prisma.page.upsert({
          where: { slug: p.slug },
          update: {
            title: p.title,
            metaTitle: p.metaTitle,
            metaDescription: p.metaDescription,
            sections: p.sections,
            order: p.order,
            isPublished: p.isPublished,
            isMaintenance: p.isMaintenance ?? false,
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
            isMaintenance: p.isMaintenance ?? false,
          },
        });
      }
    }

    console.log("Gunish Database seeded successfully from snapshot!");
    return;
  }

  console.log("No backup snapshot found, seeding default Gunish root page...");
  await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      slug: 'home',
      title: 'Home',
      metaTitle: 'GUNICSH - Ganpat University | International Conference on Social Sciences & Humanities',
      metaDescription: 'Ganpat University International Conference on Social Sciences & Humanities (GUNICSH) — Human Technological Interaction, Education Reforms, and Research Excellence.',
      order: 1,
      isPublished: true,
      sections: [],
    }
  });

  console.log("Gunish Database seeded successfully with default template!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
