import type { Route } from './+types/home';

export function loader({ context }: Route.LoaderArgs) {
	return { message: context.VALUE_FROM_EXPRESS };
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return (
		<>
			<div className='bg-primary'>
				<h1>Home</h1>
				<p>This is the home page</p>
			</div>
		</>
	);
}
