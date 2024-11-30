import {
	isRouteErrorResponse,
	Link,
	Links,
	Meta,
	NavLink,
	Outlet,
	Scripts,
	ScrollRestoration,
	useMatches,
	useNavigate,
	useNavigation,
	useResolvedPath,
} from 'react-router';

import type { Route } from './+types/root';
import stylesheet from './tailwind.css?url';
import { DiscoverIcon, HomeIcon, RecipesIcon, SettingsIcon } from './components/icons';
import path from 'path';

export const links: Route.LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous',
	},
	{
		rel: 'stylesheet',
		href:
			'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
	},
	{ rel: 'stylesheet', href: stylesheet },
];

export function meta({}: Route.MetaArgs) {
	return [{ title: 'RR7-Node' }, { name: 'description', content: 'RR7-Node' }];
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<head>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<Meta />
				<Links />
			</head>
			<body className='md:flex h-screen'>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return (
		<>
			<nav className='bg-primary text-white'>
				<ul className='flex md:flex-col'>
					<li>
						<AppNavLink to='/'>
							<HomeIcon />
						</AppNavLink>
					</li>
					<li>
						<AppNavLink to='/discover'>
							<DiscoverIcon />
						</AppNavLink>
					</li>
					<li>
						<AppNavLink to='/app'>
							<RecipesIcon />
						</AppNavLink>
					</li>
					<li>
						<AppNavLink to='/settings'>
							<SettingsIcon />
						</AppNavLink>
					</li>
				</ul>
			</nav>
			<div>
				<div className='p-4'>
					<Outlet />
				</div>
			</div>
		</>
	);
}

type AppNavLinkProps = {
	children: React.ReactNode;
	to: string;
};

function AppNavLink({ children, to }: AppNavLinkProps) {
	return (
		<>
			<li className='w-16 4rem'>
				<NavLink to={to}>
					{({ isActive, isPending }) => (
						<div
							className={`py-4 flex justify-center font-medium hover:bg-primary-light 
								${isActive ? 'bg-primary-light' : 'bg-primary'}
								${isPending ? 'animate-pulse bg-primary-light' : ''}
							`}
						>
							{children}
						</div>
					)}
				</NavLink>
			</li>
		</>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = 'Oops!';
	let details = 'An unexpected error occurred.';
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? `I know this kinda sucks, but that page does not exist` : 'Error';
		details = error.status === 404 ? '⬇️⬇️⬇️ Probly need to do this ⬇️⬇️⬇️' : error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<div className='fixed inset-0 bg-primary-light flex items-center justify-center text-gray-900'>
			<div className='w-full max-w-md bg-white shadow-lg rounded-lg p-6 text-center animate-fade-in'>
				<h1 className='text-3xl font-bold text-primary mb-4 animate-bounce-in'>{message}</h1>
				<p className='text-md text-gray-700 mb-6 animate-slide-up'>{details}</p>

				{stack && (
					<pre className='text-sm bg-gray-100 p-4 rounded overflow-x-auto text-left text-gray-800 animate-slide-up'>
						<code>{stack}</code>
					</pre>
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
