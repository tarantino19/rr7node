import { Link, LoaderFunction, Outlet, useLoaderData } from 'react-router';
export const loader: LoaderFunction = () => {
	return { message: 'Hello World' };
};

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
				<nav className='bg-yellow-300'>
					<Link to='app'>App</Link>
					<Link to='profile'>Profile</Link>
				</nav>
				<div>Message from loader: {data?.message}</div>
				<Outlet />
			</div>
		</>
	);
}

// import { useMatchesData } from '~/utils/useMatchesData';
// const matches = useMatchesData('routes/settings/profile');
