import { NavLink, Outlet } from 'react-router';

export default function App() {
	return (
		<>
			<div className='flex flex-col h-full'>
				<h1 className='text-2xl font-bold my-2'>Recipe App</h1>
				<nav className='pb-2 mt-2 text-1xl'>
					<NavLink
						to='pantry'
						className={({ isActive }) =>
							isActive ? 'hover:text-gray-500 border-b-4 px-2 md:px-2 pb-2.5 border-b-primary' : ''
						}
					>
						Pantry
					</NavLink>
				</nav>
			</div>
			<div className='py-4'>
				<Outlet />
			</div>
		</>
	);
}
