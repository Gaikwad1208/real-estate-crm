import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@realestatecrm.com' },
    update: {},
    create: {
      email: 'admin@realestatecrm.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+919876543210',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create sample agent
  const agent = await prisma.user.upsert({
    where: { email: 'agent@realestatecrm.com' },
    update: {},
    create: {
      email: 'agent@realestatecrm.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Agent',
      phone: '+919876543211',
      role: 'AGENT',
      isActive: true,
    },
  });

  console.log('✅ Agent user created:', agent.email);

  // Create sample leads
  const leads = await prisma.lead.createMany({
    data: [
      {
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'rajesh.kumar@example.com',
        phone: '+919876543212',
        source: 'WEBSITE',
        status: 'NEW',
        priority: 'HIGH',
        budget: 5000000,
        preferredLocation: 'Nashik',
        propertyType: 'APARTMENT',
        assignedToId: agent.id,
        createdById: admin.id,
      },
      {
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya.sharma@example.com',
        phone: '+919876543213',
        source: 'REFERRAL',
        status: 'CONTACTED',
        priority: 'MEDIUM',
        budget: 8000000,
        preferredLocation: 'Mumbai',
        propertyType: 'VILLA',
        assignedToId: agent.id,
        createdById: admin.id,
      },
    ],
  });

  console.log('✅ Sample leads created');

  // Create sample properties
  const properties = await prisma.property.createMany({
    data: [
      {
        title: '3BHK Luxury Apartment in Nashik',
        description: 'Spacious 3BHK apartment with modern amenities',
        propertyType: 'APARTMENT',
        listingType: 'SALE',
        price: 4500000,
        area: 1200,
        bedrooms: 3,
        bathrooms: 2,
        address: 'College Road',
        city: 'Nashik',
        state: 'Maharashtra',
        zipCode: '422005',
        country: 'India',
        amenities: ['Parking', 'Gym', 'Swimming Pool', 'Security'],
        status: 'AVAILABLE',
        ownerId: admin.id,
      },
      {
        title: '4BHK Villa with Garden',
        description: 'Beautiful villa with private garden and parking',
        propertyType: 'VILLA',
        listingType: 'SALE',
        price: 12000000,
        area: 2500,
        bedrooms: 4,
        bathrooms: 3,
        address: 'Mumbai Naka',
        city: 'Nashik',
        state: 'Maharashtra',
        zipCode: '422001',
        country: 'India',
        amenities: ['Garden', 'Parking', 'Modular Kitchen', 'Power Backup'],
        status: 'AVAILABLE',
        ownerId: admin.id,
      },
    ],
  });

  console.log('✅ Sample properties created');

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });