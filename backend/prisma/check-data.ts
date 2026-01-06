import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("--- USERS ---");
    const users = await prisma.user.findMany();
    users.forEach(u => console.log(`${u.name} (${u.email}) - Role: ${u.role}, Country: ${u.country}`));

    console.log("\n--- RESTAURANTS ---");
    const restaurants = await prisma.restaurant.findMany();
    restaurants.forEach(r => console.log(`${r.name} - Country: ${r.country}`));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
