/**
 * Seed demo merchants into the database.
 * Marks merchants as demo by appending " (demo)" to names and adding description notes.
 * Owners are set to the super admin (dev@swee.sg) for convenience.
 *
 * Usage: node scripts/seed-demo-merchants.js
 */

const { PrismaClient, Category } = require('@prisma/client');
const prisma = new PrismaClient();

const DEMO_NOTE = 'DEMO: This merchant is for testing only. Not a real business.';

const demoProviders = [
  {
    slug: 'bella-beauty-studio',
    name: 'Bella Beauty Studio (demo)',
    category: 'Hair & Beauty',
    address: '123 Orchard Road, #02-45, Singapore 238858',
    trustScore: 96.2,
    services: ['Hair Cut & Style', 'Hair Color', 'Highlights', 'Hair Treatment'],
  },
  {
    slug: 'hair-lounge-singapore',
    name: 'The Hair Lounge (demo)',
    category: 'Hair & Beauty',
    address: '277A Holland Avenue, Singapore 278624',
    trustScore: 92.5,
    services: ['Hair Cut', 'Hair Color', 'Styling', 'Treatment'],
  },
  {
    slug: 'zen-wellness-spa',
    name: 'Zen Wellness Spa (demo)',
    category: 'Massage & Spa',
    address: '123 Orchard Road, Singapore 238858',
    trustScore: 95.0,
    services: ['Hot Stone Massage', 'Aromatherapy', 'Deep Tissue'],
  },
  {
    slug: 'perfect-nails-studio',
    name: 'Perfect Nails Studio (demo)',
    category: 'Nails',
    address: '456 Bugis Street, Singapore 188867',
    trustScore: 87.3,
    services: ['Manicure', 'Pedicure', 'Gel Polish'],
  },
  {
    slug: 'fit-zone-gym',
    name: 'FitZone Personal Training (demo)',
    category: 'Fitness',
    address: '789 Marina Bay, Singapore 018956',
    trustScore: 89.8,
    services: ['Personal Training', 'HIIT Classes', 'Strength Training'],
  },
  {
    slug: 'glow-skincare-clinic',
    name: 'Glow Skincare Clinic (demo)',
    category: 'Skincare',
    address: '321 Somerset Road, Singapore 238865',
    trustScore: 96.2,
    services: ['HydraFacial', 'Microneedling', 'LED Therapy'],
  },
  {
    slug: 'bliss-massage-therapy',
    name: 'Bliss Massage Therapy (demo)',
    category: 'Massage & Spa',
    address: '88 Tanjong Pagar Road, Singapore 088488',
    trustScore: 82.1,
    services: ['Swedish Massage', 'Deep Tissue', 'Prenatal Massage'],
  },
  {
    slug: 'urban-cuts-barbershop',
    name: 'Urban Cuts Barbershop (demo)',
    category: 'Hair & Beauty',
    address: '45 Club Street, Singapore 069419',
    trustScore: 78.6,
    services: ['Haircut', 'Beard Trim', 'Styling'],
  },
  {
    slug: 'pure-yoga-studio',
    name: 'Pure Yoga Studio (demo)',
    category: 'Fitness',
    address: '67 Tras Street, Singapore 079008',
    trustScore: 73.4,
    services: ['Hatha Yoga', 'Vinyasa', 'Meditation'],
  },
  {
    slug: 'luxe-beauty-bar',
    name: 'Luxe Beauty Bar (demo)',
    category: 'Hair & Beauty',
    address: '12 Ann Siang Road, Singapore 069692',
    trustScore: 91.7,
    services: ['Hair Styling', 'Makeup', 'Bridal Package'],
  },
  {
    slug: 'serenity-wellness-center',
    name: 'Serenity Wellness Center (demo)',
    category: 'Health & Wellness',
    address: '90 Boat Quay, Singapore 049849',
    trustScore: 85.9,
    services: ['Acupuncture', 'Physiotherapy', 'Wellness Consultation'],
  },
];

function mapCategory(label) {
  switch (label) {
    case 'Hair & Beauty':
    case 'Nails':
    case 'Skincare':
      return Category.BEAUTY;
    case 'Massage & Spa':
    case 'Health & Wellness':
      return Category.WELLNESS;
    case 'Fitness':
      return Category.FITNESS;
    default:
      return Category.OTHER;
  }
}

async function main() {
  console.log('🌱 Seeding demo merchants...');

  // Ensure super admin exists
  const owner = await prisma.user.upsert({
    where: { email: 'dev@swee.sg' },
    update: {},
    create: {
      email: 'dev@swee.sg',
      name: 'Super Admin (Dev)',
      role: 'ADMIN',
    },
  });

  for (const p of demoProviders) {
    const existing = await prisma.merchant.findFirst({ where: { name: p.name } });
    let merchant;
    if (existing) {
      merchant = await prisma.merchant.update({
        where: { id: existing.id },
        data: {
          description: DEMO_NOTE,
          address: p.address,
          trustScore: p.trustScore,
          email: `demo+${p.slug}@swee.sg`,
          website: `https://demo.swee.app/${p.slug}`,
          ownerId: owner.id,
        },
      });
      console.log(`🔁 Updated demo merchant: ${merchant.name}`);
    } else {
      merchant = await prisma.merchant.create({
        data: {
          name: p.name,
          description: DEMO_NOTE,
          address: p.address,
          phone: '+65 0000 0000',
          email: `demo+${p.slug}@swee.sg`,
          website: `https://demo.swee.app/${p.slug}`,
          trustScore: p.trustScore,
          ownerId: owner.id,
        },
      });
      console.log(`✅ Created demo merchant: ${merchant.name}`);
    }

    // Create a couple of demo services per merchant
    const existingServices = await prisma.service.findMany({
      where: { merchantId: merchant.id },
      select: { title: true },
    });
    const existingTitles = new Set(existingServices.map(s => s.title));

    let count = 0;
    for (const title of p.services.slice(0, 2)) {
      if (existingTitles.has(title)) continue;
      await prisma.service.create({
        data: {
          title,
          description: `${title} — Demo service. Not a real offering.`,
          price: 8000,
          duration: 60,
          category: mapCategory(p.category),
          merchantId: merchant.id,
        },
      });
      count++;
    }
    if (count > 0) console.log(`   ➕ Added ${count} services for ${merchant.name}`);
  }

  console.log('🎉 Demo merchants seeding complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

