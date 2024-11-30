import { Link, Outlet } from 'react-router';
export default function Settings() {
	return (
		<>
			<div className=''>
				<h1>Settings</h1>
				<p>This is the settings page</p>
				<nav className='bg-yellow-300'>
					<Link to='app'>App</Link>
					<Link to='profile'>Profile</Link>
				</nav>
				<Outlet />
			</div>
		</>
	);
}
