import { Form } from 'react-router';
import { Route } from './+types/recipeId';
import db from '~/db.server';
import { ErrorMessage, Input } from '~/components/forms';
import { TimeIcon, TrashIcon } from '~/components/icons';
import { Fragment } from 'react';
export const loader = async ({ params }: Route.LoaderArgs) => {
	const recipe = await db.recipe.findUnique({
		where: {
			id: params.recipeId,
		},
		include: {
			ingredients: {
				select: {
					id: true,
					name: true,
					amount: true,
				},
			},
		},
	});

	return { recipe };
};

export default function RecipeDetail({ loaderData }: Route.ComponentProps) {
	const data = loaderData;

	return (
		<>
			<p>
				How to edit? create an edit route and edit button, then use the edit route - edit will have it's own component,
				loading the current data from the loader + the ability to submit the new form either get the params url or the
				loader data for the id, then use the id to update the recipe
				https://reactrouter.com/tutorials/address-book#updating-contacts-with-formdata
			</p>
			<Form method='post' reloadDocument>
				<div className='mb-2'>
					<Input
						key={data.recipe?.id}
						type='text'
						placeholder='name'
						autoComplete='off'
						className='text-2xl font-extrabold'
						name='name'
						defaultValue={data.recipe?.name}
					></Input>
					<ErrorMessage></ErrorMessage>
				</div>
				<div className='flex'>
					<TimeIcon />
					<div className='ml-2 flex-grow'>
						<Input
							key={data.recipe?.id}
							placeholder='time'
							name='totalTime'
							type='text'
							autoComplete='off'
							defaultValue={data.recipe?.totalTime}
						></Input>
						<ErrorMessage></ErrorMessage>
					</div>
				</div>
				<div className='grid grid-cols-[30%_auto_min-content] my-4 gap-2'>
					<h2 className='text-sm font-bold pb-1 mt-3'>Amount</h2>
					<h2 className='text-sm font-bold pb-1 mt-3'>Name</h2>
					<div></div>
					{data.recipe?.ingredients.map((ingredient) => (
						<Fragment key={ingredient.id}>
							<div>
								<Input type='text' autoComplete='off' name='ingredientAmount' defaultValue={ingredient.amount ?? ''}></Input>
								<ErrorMessage></ErrorMessage>
								<Input type='text' autoComplete='off' name='ingredientName' defaultValue={ingredient.name ?? ''}></Input>
								<ErrorMessage></ErrorMessage>
							</div>
							<button>
								<TrashIcon />
							</button>
						</Fragment>
					))}
				</div>
			</Form>
		</>
	);
}
