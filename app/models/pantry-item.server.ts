import db from '~/db.server';

export async function getAllPantryItems() {
	try {
		const items = await db.pantryItem.findMany();
		return items;
	} catch (error) {
		// Log the error for debugging
		console.error('Error fetching pantry items:', error);

		// Optionally rethrow the error to be handled by the caller
		throw new Error('Failed to fetch pantry items');
	}
}
