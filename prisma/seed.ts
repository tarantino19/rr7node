import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

function createUser() {
	return db.user.create({
		data: {
			email: '0V0oR@example.com',
			firstName: 'John',
			lastName: 'Doe',
		},
	});
}

function getShelves(userId: string) {
	return [
		{
			userId,
			name: 'Dairy',
			items: {
				create: [
					{ userId, name: 'Cheese' },
					{ userId, name: 'Milk' },
					{ userId, name: 'Butter' },
					{ userId, name: 'Eggs' },
					{ userId, name: 'Yogurt' },
				],
			},
		},
		{
			userId,
			name: 'Fruits',
			items: {
				create: [
					{ userId, name: 'Apples' },
					{ userId, name: 'Oranges' },
					{ userId, name: 'Mango' },
					{ userId, name: 'Bananas' },
				],
			},
		},
	];
}

async function seed() {
	const user = await createUser();
	await Promise.all(getShelves(user.id).map((shelf) => db.pantryShelf.create({ data: shelf })));
}

seed();
