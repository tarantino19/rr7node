import { requiredLoggedInUser } from '~/utils/auth.server';
import { Route } from './+types/recipeId';
import db from '~/db.server';
export const loader = async ({ params }: Route.LoaderArgs) => {
	const recipe = await db.recipe.findUnique({
		where: {
			id: params.recipeId,
		},
	});

	return { recipe };
};

export default function RecipeDetails({ loaderData }: Route.ComponentProps) {
	const data = loaderData;

	return <div>{data.recipe?.name}</div>;
}
