import db from '~/db.server';

export function getAllShelves() {
	try {
		return db.pantryShelf.findMany({
			include: {
				items: {
					orderBy: {
						name: 'asc',
					},
				},
			},
		});
	} catch (error) {
		console.error('Error fetching shelves:', error);
		throw new Error('Failed to fetch shelves');
	}
}
