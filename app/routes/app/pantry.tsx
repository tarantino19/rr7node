import { LoaderFunction, useLoaderData } from 'react-router';
import { PantryShelf, PantryItem } from '@prisma/client';
import { getAllShelves } from '~/models/pantry-shelf.server';

export const loader: LoaderFunction = async () => {
	const shelves = await getAllShelves();
	return new Response(JSON.stringify({ shelves }), {
		headers: { 'Content-Type': 'application/json' },
	});
};

export default function Pantry() {
	const { shelves } = useLoaderData<{ shelves: PantryShelf[] }>();

	return (
		<>
			<div>
				<ul className='flex gap-8 overflow-x-auto snap-x snap-mandatory'>
					{shelves.map((shelf: PantryShelf) => (
						<li
							className='border-2 border-primary rounded-md p-4 w-[calc(100vw-2rem)] flex-none snap-center h-fit md:w-96'
							key={shelf.id}
						>
							<h1 className='text-2xl font-extrabold mb-2'>{shelf.name}</h1>
							<ul>
								{/* @ts-ignore */}
								{shelf.items.map((item: PantryItem) => (
									<li className='py-2' key={item.id}>
										{item.name}
									</li>
								))}
							</ul>
						</li>
					))}
				</ul>
			</div>
		</>
	);
}
