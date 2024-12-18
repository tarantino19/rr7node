import { Prisma } from '@prisma/client';
import db from '~/db.server';

export async function getAllShelves(userId: string, query: string | null) {
	try {
		const shelves = await db.pantryShelf.findMany({
			where: {
				userId,
				name: {
					contains: query ?? '',
					mode: 'insensitive',
				},
			},
			include: {
				items: {
					orderBy: {
						name: 'asc',
					},
				},
			},
			orderBy: {
				updatedAt: 'desc',
			},
		});
		return shelves;
	} catch (error) {
		console.error('Error fetching shelves:', error);
		throw new Error('Failed to fetch shelves');
	}
}

export async function createShelf(userId: string) {
	try {
		const newShelf = await db.pantryShelf.create({
			data: {
				userId,
				name: 'New Shelf',
			},
		});
		return newShelf;
	} catch (error) {
		console.error('Error creating shelf:', error);
		throw new Error('Failed to create shelf');
	}
}

export async function deleteShelf(shelfId: string) {
	try {
		const deletedShelf = await db.pantryShelf.delete({
			where: {
				id: shelfId,
			},
		});
		return deletedShelf;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === 'P2025') {
				throw new Error('Shelf not found');
			}
		}
		throw new Error('Failed to delete shelf');
	}
}

export const saveShelfName = async (shelfId: string, shelfName: string) => {
	try {
		const updatedShelf = await db.pantryShelf.update({
			where: {
				id: shelfId,
			},
			data: {
				name: shelfName,
			},
		});
		return updatedShelf;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === 'P2025') {
				throw new Error('Shelf not found');
			}
		}
		throw new Error('Failed to save shelf name');
	}
};

export const getShelf = async (shelfId: string) => {
	try {
		const shelf = await db.pantryShelf.findUnique({
			where: {
				id: shelfId,
			},
		});
		return shelf;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === 'P2025') {
				throw new Error('Shelf not found');
			}
		}
		throw new Error('Failed to get shelf');
	}
};
