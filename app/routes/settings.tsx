import { Link, LoaderFunction, Outlet, useLoaderData } from 'react-router';
import { Suspense } from 'react';

export async function loader() {
	return new Response(JSON.stringify({ message: 'Welcome to React Router 7!' }), {
		headers: { 'Content-Type': 'application/json' },
	});
}

export default function Settings() {
	const data = useLoaderData();

	return (
		<>
			<div className=''>
				<h1>Settings</h1>
				<p>
					This is the settings page This is the settings pageThis is the settings pageThis is the settings pageThis is the
					settings pageThis is the settings pageThis is the settings pageThis is the settings pageThis is the settings
					pageThis is the settings pageThis is the settings pageThis is the settings pageThis is the settings pageThis is the
					settings pageThis is the settings pageThis is the settings page
				</p>
				<nav className='bg-primary'>
					<Link className='mr-2' to='app2'>
						App
					</Link>
					<Link className='mr-2' to='profile'>
						Profile
					</Link>
				</nav>
				<div>Message from loader: {data?.message}</div>
				<Outlet />
			</div>
		</>
	);
}

// import { useMatchesData } from '~/utils/useMatchesData';
// const matches = useMatchesData('routes/settings/profile');
