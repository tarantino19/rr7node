import db from '~/db.server';

export function getAllShelves() {
	try {
		return db.pantryShelf.findMany();
	} catch (error) {
		console.error('Error fetching shelves:', error);
		throw new Error('Failed to fetch shelves');
	}
}
