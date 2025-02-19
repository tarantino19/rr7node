import { Prisma } from '@prisma/client';
import db from '~/db.server';

export async function createShelfItems(userId: string, shelfId: string, name: string) {
	return await db.pantryItem.create({
		data: {
			userId,
			shelfId,
			name,
		},
	});
}

export async function deleteShelfItem(id: string) {
	try {
		await db.pantryItem.delete({
			where: {
				id: id,
			},
		});
		return { message: 'Successfully deleted item' };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === 'P2025') {
				throw new Error('Shelf not found');
			}
		}
		throw new Error('Failed to delete shelf');
	}
}

export function getShelfItem(id: string) {
	return db.pantryItem.findUnique({
		where: {
			id: id,
		},
	});
}
