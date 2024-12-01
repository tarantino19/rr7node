import db from '~/db.server';

export function getAllPantryItems() {
	try {
		const items = db.pantryItem.findMany();
		return items;
	} catch (error) {
		console.error('Error fetching pantry items:', error);
		throw new Error('Failed to fetch pantry items');
	}
}
