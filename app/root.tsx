import {
	isRouteErrorResponse,
	Links,
	Meta,
	NavLink,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useNavigation,
	useResolvedPath,
	useRouteError,
} from 'react-router';

import type { Route } from './+types/root';
import stylesheet from './tailwind.css?url';
import { DiscoverIcon, HomeIcon, LoginIcon, LogoutIcon, RecipeBookIcon, SettingsIcon } from './components/icons';
import { getCurrentUser } from './utils/auth.server';

interface ErrorBoundaryProps {
	children?: React.ReactNode;
}

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
			<body className='md:flex md:h-screen'>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export const loader = async ({ request }: Route.LoaderArgs) => {
	const user = await getCurrentUser(request);
	const isLoggedIn = user !== null;

	return { isLoggedIn };
};

export default function App() {
	const data = useLoaderData();
	return (
		<>
			<nav className='bg-primary text-white md:w-16 flex justify-between md:flex-col'>
				<ul className='flex md:flex-col'>
					<AppNavLink to='/'>
						<HomeIcon />
					</AppNavLink>

					<AppNavLink to='/discover'>
						<DiscoverIcon />
					</AppNavLink>
					{data.isLoggedIn ? (
						<AppNavLink to='/app/recipes'>
							<RecipeBookIcon />
						</AppNavLink>
					) : null}
					<AppNavLink to='/settings'>
						<SettingsIcon />
					</AppNavLink>
				</ul>
				<ul>
					{data.isLoggedIn ? (
						<AppNavLink to='/logout'>
							<LogoutIcon />
						</AppNavLink>
					) : (
						<AppNavLink to='/login'>
							<LoginIcon />
						</AppNavLink>
					)}
				</ul>
			</nav>
			<div className='p-4 w-full md:w-[calc(100%-4rem)]'>
				<Outlet />
			</div>
		</>
	);
}

type AppNavLinkProps = {
	children: React.ReactNode;
	to: string;
};

export function AppNavLink({ children, to }: AppNavLinkProps) {
	const path = useResolvedPath(to);
	const navigation = useNavigation();

	// Check if form submissions are active for searching or creating
	//these all came from the formData actions
	const isCreatingShelf = navigation.formData?.has('createShelf');

	// Determine if the link should show a loading spinner
	const isLoading =
		navigation.state === 'loading' && navigation.location?.pathname === path.pathname && !isCreatingShelf;

	return (
		<li className='w-16'>
			<NavLink to={to}>
				{({ isActive, isPending }) => (
					<div
						className={`py-4 flex justify-center items-center relative font-medium hover:bg-primary-light
							${isActive ? 'bg-primary-light' : 'bg-primary'}
						`}
					>
						{isLoading && (
							<div className='absolute inset-0 flex items-center justify-center bg-primary-light/80 animate-pulse z-10'>
								<svg
									className='h-7 w-7 text-white animate-spin'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
								>
									<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
									<path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'></path>
								</svg>
							</div>
						)}

						{/* Children Content */}
						<span className={`${isLoading ? 'opacity-50' : 'opacity-100'}`}>{children}</span>
					</div>
				)}
			</NavLink>
		</li>
	);
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
	const error = useRouteError();

	// Initialize variables for error details
	let message = 'An unexpected error occurred.';
	let details = "Something went wrong, but we couldn't find more details.";
	let stack: string | undefined;

	// Handle RouteErrorResponse or standard Error
	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? `I know this kinda sucks, but that page does not exist` : `Error ${error.status}`;
		details = error.statusText || 'No additional details available.';
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		message = 'An error occurred during rendering.';
		details = error.message;
		stack = error.stack;
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
