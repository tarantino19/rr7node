import { LoaderFunction, useLoaderData } from 'react-router';
import { PantryShelf, PantryItem } from '@prisma/client';
import { getAllShelves } from '~/models/pantry-shelf.server';
import { getAllPantryItems } from '~/models/pantry-item.server';

export const loader: LoaderFunction = async () => {
	try {
		const [shelves, items] = await Promise.all([getAllShelves(), getAllPantryItems()]);

		return new Response(JSON.stringify({ shelves, items }), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Error loading shelves and items:', error);
		throw new Response('Failed to load pantry data', { status: 500 });
	}
};

export default function Pantry() {
	const { shelves, items } = useLoaderData() as { shelves: PantryShelf[]; items: PantryItem[] };

	return (
		<>
			<div>
				<h1 className='font-bold'>Pantry Shelves List</h1>
				<div>
					{shelves.map((shelf: PantryShelf) => (
						<div key={shelf.id}>
							<p>{shelf.name}</p>
						</div>
					))}
				</div>
				{''}
				<h1 className='font-bold'>Pantry Items List</h1>
				<div>
					{items.map((item: PantryItem) => (
						<div key={item.id}>
							<p>{item.name}</p>
						</div>
					))}
				</div>
			</div>
		</>
	);
}
