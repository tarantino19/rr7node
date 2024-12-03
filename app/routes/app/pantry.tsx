import { useFetcher, Form, useLoaderData, useNavigation, useSearchParams, LoaderFunction } from 'react-router';
import { createShelf, deleteShelf, getAllShelves, saveShelfName } from '~/models/pantry-shelf.server';
import { PlusIcon, SaveIcon, SearchIcon, TrashIcon } from '~/components/icons';
import type { Route } from './+types/pantry';
import { DeleteButton, ErrorMessage, PrimaryButton } from '~/components/forms';
import { z } from 'zod';
import { validateForm } from '~/utils/validation';
import { createShelfItems, deleteShelfItem } from '~/models/pantry-item.server';

//loaders
export const loader = async ({ request }: Route.LoaderArgs) => {
	const url = new URL(request.url);
	const q = url.searchParams.get('q');
	const shelves = await getAllShelves(q);
	return { shelves };
};

//zod validations
const saveShelfNameSchema = z.object({
	shelfId: z.string(),
	shelfName: z.string().min(1, { message: 'Shelf name is required' }),
});

const deleteShelfSchema = z.object({
	shelfId: z.string(),
});

const createShelfItemSchema = z.object({
	shelfId: z.string(),
	itemName: z.string().min(1, { message: 'Item name is required' }),
});

const deleteShelfItemSchema = z.object({
	itemId: z.string(),
});

//actions for form
export const action = async ({ request }: Route.ActionArgs) => {
	const formData = await request.formData();

	switch (formData.get('_action')) {
		case 'createShelf': {
			return createShelf();
		}
		case 'deleteShelf': {
			return validateForm(
				formData,
				deleteShelfSchema,
				(data) => deleteShelf(data.shelfId),
				(errors) => ({ errors, status: 400 })
			);
		}
		case 'saveShelfName': {
			return validateForm(
				formData,
				saveShelfNameSchema,
				(data) => saveShelfName(data.shelfId, data.shelfName),
				(errors) => ({ errors, status: 400 })
			);
		}
		case 'createShelfItem': {
			return validateForm(
				formData,
				createShelfItemSchema,
				(data) => createShelfItems(data.shelfId, data.itemName),
				(errors) => ({ errors, status: 400 })
			);
		}
		case 'deleteShelfItem': {
			return validateForm(
				formData,
				deleteShelfItemSchema,
				(data) => deleteShelfItem(data.itemId),
				(errors) => ({ errors, status: 400 })
			);
		}
		default: {
			return null;
		}
	}
};
export default function Pantry() {
	const { shelves } = useLoaderData<typeof loader>();
	const [searchParams, setSearchParams] = useSearchParams();
	const navigation = useNavigation();
	const createShelfFetcher = useFetcher();
	const isSearching = navigation.formData?.has('q');
	const isCreatingShelf = createShelfFetcher.formData?.get('_action') === 'createShelf';

	return (
		<>
			<div>
				<Form className='flex border-2 border-gray-300 rounded-md focus-within:border-primary md:w-96'>
					<button className='px-2 relative'>
						{isSearching && (
							<div className='absolute inset-0 bg-white/70 flex items-center justify-center animate-spin rounded-full'>
								<svg className='h-5 w-5 text-gray-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
									<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
									<path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'></path>
								</svg>
							</div>
						)}
						<SearchIcon />
					</button>
					<input
						defaultValue={searchParams.get('q') ?? ''}
						className='w-full py-3 px-2 outline-none'
						type='text'
						name='q'
						placeholder='Search shelves...'
					/>
				</Form>
				<createShelfFetcher.Form method='post'>
					<PrimaryButton
						disabled={isCreatingShelf}
						name='_action'
						value='createShelf'
						className={`mt-4 w-full md:w-fit ${isCreatingShelf ? 'bg-primary-light' : 'bg-primary'}`}
					>
						<PlusIcon />
						<span className='pl-2'>{isCreatingShelf ? 'Creating Shelf...' : 'Create Shelf'}</span>
					</PrimaryButton>
				</createShelfFetcher.Form>
				{/* //SHELVES AND ITEMS - Shelf Component below */}
				<ul className='flex gap-8 overflow-x-auto snap-x snap-mandatory mt-4 pb-4'>
					{shelves.map((shelf) => (
						<Shelf key={shelf.id} shelf={shelf} />
					))}
				</ul>
			</div>
		</>
	);
}

type ShelfProps = {
	shelf: {
		id: string;
		name: string;
		items: {
			id: string;
			name: string;
		}[];
	};
};
export function Shelf({ shelf }: ShelfProps) {
	const deleteShelfFetcher = useFetcher();
	const saveShelfNameFetcher = useFetcher();
	const createShelfItemFetcher = useFetcher();
	const isDeletingShelf = deleteShelfFetcher.formData?.get('_action') === 'deleteShelf';

	return isDeletingShelf ? null : (
		<li
			className='border-2 border-primary rounded-md p-4 w-[calc(100vw-2rem)] flex-none snap-center h-fit
						md:w-96'
			key={shelf.id}
		>
			<saveShelfNameFetcher.Form method='post' className='flex'>
				<div className='w-full mb-2'>
					<input
						required
						type='text'
						defaultValue={shelf.name}
						name='shelfName'
						placeholder='Shelf Name'
						autoComplete='off'
						onChange={(e) => {
							e.target.value !== '' &&
								saveShelfNameFetcher.submit(
									{
										_action: 'saveShelfName',
										shelfName: e.target.value,
										shelfId: shelf.id,
									},
									{
										method: 'post',
									}
								);
						}}
						className={`pt-2 pb-2 text-2xl font-extrabold w-full outline-none border-b-2 mb-1 focus:border-primary ${
							saveShelfNameFetcher.data?.errors?.shelfName ? 'border-b-red-500' : ''
						}`}
					/>
					<ErrorMessage>{saveShelfNameFetcher.data?.errors?.shelfName}</ErrorMessage>
				</div>
				<button
					name='_action'
					value='saveShelfName'
					className={`m-4 relative ${
						saveShelfNameFetcher.state === 'idle' && saveShelfNameFetcher.data?.success ? 'animate-pulse text-green-500' : ''
					}`}
				>
					{saveShelfNameFetcher.state === 'submitting' ? (
						<svg
							className='animate-spin h-6 w-6 text-gray-500'
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
						>
							<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
							<path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'></path>
						</svg>
					) : (
						<SaveIcon />
					)}
				</button>
				<input type='hidden' name='shelfId' value={shelf.id} />
			</saveShelfNameFetcher.Form>
			{/* SHELF ITEMS */}
			<createShelfItemFetcher.Form method='post' className='flex py-2'>
				<div className='w-full mb-2'>
					<input
						required
						type='text'
						name='itemName'
						placeholder='add new item'
						autoComplete='off'
						className={`pb-1 w-full outline-none border-b-2 focus:border-primary mb-1 ${
							createShelfItemFetcher.data?.errors?.shelfName ? 'border-b-red-500' : ''
						}`}
					/>
					<ErrorMessage>{createShelfItemFetcher.data?.errors?.itemName}</ErrorMessage>
				</div>
				<button name='_action' value='createShelfItem' className='ml-4 mr-4 mb-2'>
					<SaveIcon />
				</button>
				<input type='hidden' name='shelfId' value={shelf.id} />
			</createShelfItemFetcher.Form>
			<ul>
				{shelf.items.map((item) => (
					<ShelfItem key={item.id} shelfItem={item} />
				))}
			</ul>
			<deleteShelfFetcher.Form method='post' className='pt-8'>
				<input type='hidden' name='shelfId' value={shelf.id} />
				<input type='hidden' name='_action' value='deleteShelf' />
				<ErrorMessage className='pb-2'>{deleteShelfFetcher.data?.errors?.shelfId}</ErrorMessage>
				<DeleteButton
					disabled={isDeletingShelf}
					className={`w-full flex justify-center items-center ${
						isDeletingShelf ? 'bg-gray-300 text-gray-500' : 'bg-primary text-white'
					}`}
				>
					Delete Shelf
				</DeleteButton>
			</deleteShelfFetcher.Form>
		</li>
	);
}

interface ShelfItemProps {
	shelfItem: {
		id: string;
		name: string;
	};
}

function ShelfItem({ shelfItem }: ShelfItemProps) {
	const deleteShelfItemFetcher = useFetcher();
	const isDeletingItem = deleteShelfItemFetcher.formData?.get('_action') === 'deleteShelfItem';

	return (
		<li className='mt-1 mb-4 mr-1' key={shelfItem.id}>
			<deleteShelfItemFetcher.Form method='post' className='flex'>
				<p className='w-full'> {shelfItem.name}</p>
				<input type='hidden' name='itemId' value={shelfItem.id} />
				<input type='hidden' name='_action' value='deleteShelfItem' />
				<ErrorMessage className='pb-2'>{deleteShelfItemFetcher.data?.errors?.itemId}</ErrorMessage>
				<div>
					<DeleteButton disabled={isDeletingItem} className='text-sm text-white-500'>
						<TrashIcon />
					</DeleteButton>
				</div>
			</deleteShelfItemFetcher.Form>
		</li>
	);
}

//why we're creating new component? because we cant use fetcher hooks inside mapping funcs
