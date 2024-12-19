import {
	useFetcher,
	Form,
	useNavigation,
	useSearchParams,
	data,
	isRouteErrorResponse,
	NavLink,
	useRouteError,
} from 'react-router';
import { createShelf, deleteShelf, getAllShelves, getShelf, saveShelfName } from '~/models/pantry-shelf.server';
import { PlusIcon, SaveIcon, SearchIcon, TrashIcon } from '~/components/icons';
import type { Route } from './+types/pantry';
import { DeleteButton, ErrorMessage, Input, PrimaryButton, SearchBar } from '~/components/forms';
import { z } from 'zod';
import { validateForm } from '~/utils/validation';
import { createShelfItems, deleteShelfItem, getShelfItem } from '~/models/pantry-item.server';
import { requiredLoggedInUser } from '~/utils/auth.server';
import React, { useEffect, useRef } from 'react';

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

//loaders
export const loader = async ({ request }: Route.LoaderArgs) => {
	const user = await requiredLoggedInUser(request);
	const url = new URL(request.url);
	const q = url.searchParams.get('q');
	const shelves = await getAllShelves(user.id, q);
	return { shelves };
};

//actions for form
export const action = async ({ request }: Route.ActionArgs) => {
	const user = await requiredLoggedInUser(request);
	const formData = await request.formData();

	switch (formData.get('_action')) {
		case 'createShelf': {
			return createShelf(user.id);
		}
		case 'deleteShelf': {
			return validateForm(
				formData,
				deleteShelfSchema,
				async (data) => {
					const shelf = await getShelf(data.shelfId);

					if (shelf !== null && shelf.userId !== user.id) {
						return { errors: { message: 'You are not allowed to delete this shelf' }, status: 401 };
					}
					return deleteShelf(data.shelfId);
				},
				(errors) => ({ errors, status: 400 })
			);
		}
		case 'saveShelfName': {
			return validateForm(
				formData,
				saveShelfNameSchema,
				async (data) => {
					const shelf = await getShelf(data.shelfId);

					if (shelf !== null && shelf.userId !== user.id) {
						return { errors: { shelfId: 'You are not allowed to delete this shelf' }, status: 400 };
					}
					return saveShelfName(data.shelfId, data.shelfName);
				},
				(errors) => ({ errors, status: 400 })
			);
		}
		case 'createShelfItem': {
			return validateForm(
				formData,
				createShelfItemSchema,
				(data) => {
					createShelfItems(user.id, data.shelfId, data.itemName);
				},
				(errors) => ({ errors, status: 400 })
			);
		}
		case 'deleteShelfItem': {
			return validateForm(
				formData,
				deleteShelfItemSchema,
				async (data) => {
					const item = await getShelfItem(data.itemId);

					if (item !== null && item.userId !== user.id) {
						return { errors: { message: `This item ain't yours man, you are not allowed to delete this item` }, status: 401 };
					}
					return deleteShelfItem(data.itemId);
				},
				(errors) => ({ errors, status: 400 })
			);
		}
		default: {
			return null;
		}
	}
};
export default function Pantry({ loaderData }: Route.ComponentProps) {
	const { shelves } = loaderData;
	const createShelfFetcher = useFetcher();
	const isCreatingShelf = createShelfFetcher.formData?.get('_action') === 'createShelf';

	return (
		<>
			<div>
				<SearchBar placeholder='Search' />
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

//sub-components
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

function Shelf({ shelf }: ShelfProps) {
	const deleteShelfFetcher = useFetcher();
	const saveShelfNameFetcher = useFetcher();
	const createShelfItemFetcher = useFetcher();
	const isDeletingShelf = deleteShelfFetcher.formData?.get('_action') === 'deleteShelf';

	const formRef = useRef<HTMLFormElement>(null);

	// Reset the form when the fetcher state transitions back to idle
	useEffect(() => {
		if (createShelfItemFetcher.state === 'idle' && formRef.current) {
			formRef.current.reset();
		}
	}, [createShelfItemFetcher.state]);

	return isDeletingShelf ? null : (
		<li
			className='border-2 border-primary rounded-md p-4 w-[calc(100vw-2rem)] flex-none snap-center h-fit
						md:w-96'
			key={shelf.id}
		>
			<saveShelfNameFetcher.Form method='post' className='flex'>
				<div className='w-full mb-2'>
					<Input
						required
						type='text'
						defaultValue={shelf.name}
						name='shelfName'
						placeholder='Shelf Name'
						autoComplete='off'
						error={saveShelfNameFetcher.data?.errors?.shelfName}
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
						className={`pt-2 pb-2 text-2xl font-extrabold`}
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
			<createShelfItemFetcher.Form
				method='post'
				ref={formRef} // Attach the form ref
				className='flex py-2'
			>
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
				{shelf.items.map((shelfItem) => (
					<ShelfItem key={shelfItem.id} shelfItem={shelfItem} />
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

//why we're creating new component? because we cant use fetcher hooks inside mapping/looping funcs

interface ErrorBoundaryProps {
	children?: React.ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
	const error = useRouteError();

	// Initialize variables for error details
	let message = 'An unexpected error occurred.';
	let details = "Something went wrong, but we couldn't find more details.";
	let stack: string | undefined;

	// Handle RouteErrorResponse or standard Error
	if (isRouteErrorResponse(error)) {
		message = error.status ? `You cant' delete this shelf ` : `Error ${error.status}`;
	}

	return (
		<div className='fixed inset-0 bg-primary-light flex items-center justify-center text-gray-900'>
			<div className='w-full max-w-md bg-white shadow-lg rounded-lg p-6 text-center animate-fade-in'>
				<h1 className='text-3xl font-bold text-primary mb-4 animate-bounce-in'>{message}</h1>
				<p className='text-md text-gray-700 mb-6 animate-slide-up'>{details}</p>

				{stack && (
					<pre className='bg-green-200 p-2 rounded text-green-900 text-left text-sm overflow-auto max-h-40'>{stack}</pre>
				)}
				{import.meta.env.DEV && (
					<p className='text-xs text-green-600'>(You’re seeing this because the app is in development mode.)</p>
				)}

				<div className='mt-6'>
					<NavLink
						to='/'
						className='inline-block px-6 py-3 bg-primary text-white font-medium rounded-md shadow hover:bg-primary-light transition transform hover:scale-105 animate-pop-in'
					>
						Go back to the Home Page
					</NavLink>
				</div>
			</div>
		</div>
	);
}
