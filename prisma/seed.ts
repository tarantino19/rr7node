import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

function getShelves() {
	return [
		{
			name: 'Dairy',
			items: {
				create: [{ name: 'Cheese' }, { name: 'Milk' }, { name: 'Butter' }, { name: 'Eggs' }, { name: 'Yogurt' }],
			},
		},
		{
			name: 'Fruits',
			items: {
				create: [{ name: 'Apples' }, { name: 'Oranges' }, { name: 'Mango' }, { name: 'Bananas' }],
			},
		},
	];
}

async function seed() {
	await Promise.all(getShelves().map((shelf) => db.pantryShelf.create({ data: shelf })));
}

seed();
