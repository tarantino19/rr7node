import db from '~/db.server';

export async function getAllShelves() {
	try {
		return await db.pantryShelf.findMany();
	} catch (error) {
		console.error('Error fetching shelves:', error);
		throw new Error('Failed to fetch shelves');
	}
}
