import {
	isRouteErrorResponse,
	Link,
	Links,
	Meta,
	NavLink,
	Outlet,
	Scripts,
	ScrollRestoration,
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
			<body className='md:flex h-screen '>
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
		message = error.status === 404 ? '404' : 'Error';
		details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className='pt-16 p-4 container mx-auto'>
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className='w-full p-4 overflow-x-auto'>
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
