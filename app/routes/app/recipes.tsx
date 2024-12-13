import { requiredLoggedInUser } from '~/utils/auth.server';
import { Route } from './+types/recipes';
import db from '~/db.server';
import { RecipeCard, RecipeDetailWrapper, RecipeListWrapper, RecipePageWrapper } from '~/components/recipes';
import { NavLink, Outlet } from 'react-router';
import { SearchBar } from '~/components/forms';

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
	});

	return { recipes };
};

export default function recipes({ loaderData }: Route.ComponentProps) {
	const data = loaderData;

	return (
		<RecipePageWrapper>
			<RecipeListWrapper>
				<SearchBar placeholder='Search recipes...' />
				<ul>
					{data.recipes.map((recipe) => (
						<li className='my-4' key={recipe.id}>
							<NavLink to={recipe.id}>
								{({ isActive }) => (
									<RecipeCard name={recipe.name} imageUrl={recipe.imageUrl} totalTime={recipe.totalTime} isActive={isActive} />
								)}
							</NavLink>
						</li>
					))}
				</ul>
			</RecipeListWrapper>
			<RecipeDetailWrapper>
				<Outlet />
			</RecipeDetailWrapper>
		</RecipePageWrapper>
	);
}
