import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
    log: ['info', 'warn', 'error'],
});

async function main() {
    const password = await bcrypt.hash('password123', 10);

    // --- Users ---
    const users = [
        { email: 'nick.fury@slooze.com', name: 'Nick Fury', role: 'ADMIN', country: 'INDIA' },
        { email: 'captain.marvel@slooze.com', name: 'Captain Marvel', role: 'MANAGER', country: 'INDIA' },
        { email: 'captain.america@slooze.com', name: 'Captain America', role: 'MANAGER', country: 'USA' },
        { email: 'thanos@slooze.com', name: 'Thanos', role: 'MEMBER', country: 'INDIA' },
        { email: 'thor@slooze.com', name: 'Thor', role: 'MEMBER', country: 'INDIA' },
        { email: 'travis@slooze.com', name: 'Travis', role: 'MEMBER', country: 'USA' },
    ];

    for (const user of users) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: { ...user, password },
        });
    }
    console.log('Users seeded');

    // --- Restaurants & Menu Items ---
    const restaurants = [
        {
            id: 'restaurant-india-1',
            name: 'Spicy Tandoor',
            country: 'INDIA',
            menuItems: [
                { name: 'Butter Chicken', price: 600 },
                { name: 'Naan', price: 100 },
                { name: 'Paneer Tikka', price: 300 },
            ],
        },
        {
            id: 'restaurant-india-2',
            name: 'Curry House',
            country: 'INDIA',
            menuItems: [
                { name: 'Chicken Biryani', price: 400 },
                { name: 'Samosa', price: 150 },
                { name: 'Lassi', price: 120 },
            ],
        },
        {
            id: 'restaurant-usa-1',
            name: 'Burger King',
            country: 'USA',
            menuItems: [
                { name: 'Whopper', price: 6.99 },
                { name: 'Fries', price: 2.99 },
                { name: 'Coke', price: 1.99 },
            ],
        },
        {
            id: 'restaurant-usa-2',
            name: 'Pizza Hut',
            country: 'USA',
            menuItems: [
                { name: 'Pepperoni Pizza', price: 15.99 },
                { name: 'Garlic Bread', price: 5.99 },
                { name: 'Pasta', price: 11.99 },
            ],
        },
    ];

    // Clear existing menu items for known restaurants
    await prisma.menuItem.deleteMany({
        where: { restaurantId: { in: restaurants.map((r) => r.id) } },
    });

    for (const restaurant of restaurants) {
        const { id, name, country, menuItems } = restaurant;

        await prisma.restaurant.upsert({
            where: { id },
            update: {},
            create: { id, name, country },
        });

        for (const item of menuItems) {
            await prisma.menuItem.create({
                data: { name: item.name, price: item.price, restaurantId: id },
            });
        }
    }

    console.log('Restaurants seeded');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
