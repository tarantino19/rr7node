import { requiredLoggedInUser } from '~/utils/auth.server';
import { Route } from './+types/recipes';
import db from '~/db.server';
import { RecipeCard, RecipeDetailWrapper, RecipeListWrapper, RecipePageWrapper } from '~/components/recipes';
import { data, Form, NavLink, Outlet, redirect, useLocation, useNavigation } from 'react-router';
import { PrimaryButton, SearchBar } from '~/components/forms';
import { PlusIcon } from '~/components/icons';

export const loader = async ({ request }: Route.LoaderArgs) => {
	const user = await requiredLoggedInUser(request);
	const url = new URL(request.url);
	const q = url.searchParams.get('q');

	const recipes = await db.recipe.findMany({
		where: {
			userId: user.id,
			name: {
				contains: q ?? '',
				mode: 'insensitive',
			},
		},
		select: {
			name: true,
			totalTime: true,
			imageUrl: true,
			id: true,
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	return { recipes };
};

export const action = async ({ request }: Route.ActionArgs) => {
	const user = await requiredLoggedInUser(request);

	const recipe = await db.recipe.create({
		data: {
			userId: user.id,
			name: 'Create New Recipe',
			totalTime: '30 mins',
			imageUrl: '/images/french-dip-sandwiches.jpg',
			instructions: '',
		},
	});

	const url = new URL(request.url);
	url.pathname = `/app/recipes/${recipe.id}`;

	return redirect(url.toString());
};

export default function recipes({ loaderData }: Route.ComponentProps) {
	const data = loaderData;
	const location = useLocation();
	const navigation = useNavigation();

	return (
		<RecipePageWrapper>
			<RecipeListWrapper>
				<SearchBar placeholder='Search recipes...' />
				<Form method='post' className='mt-4'>
					<PrimaryButton className=''>
						<div className='flex w-full justify-center'>
							<PlusIcon />
							<span className='ml-2'>Create Recipe</span>
						</div>
					</PrimaryButton>
				</Form>
				<ul>
					{data.recipes.map((recipe) => {
						const isLoading = navigation.location?.pathname.endsWith(recipe.id);

						return (
							<li className='my-4' key={recipe.id}>
								<NavLink
									to={{ pathname: recipe.id, search: location.search }}
									// prefetch='viewport'
								>
									{({ isActive }) => (
										<RecipeCard
											name={recipe.name}
											imageUrl={recipe.imageUrl}
											totalTime={recipe.totalTime}
											isActive={isActive}
											isLoading={isLoading}
										/>
									)}
								</NavLink>
							</li>
						);
					})}
				</ul>
			</RecipeListWrapper>
			<RecipeDetailWrapper>
				<Outlet />
			</RecipeDetailWrapper>
		</RecipePageWrapper>
	);
}
