import { NavLink, Outlet } from 'react-router';

export default function App() {
	return (
		<>
			<div className='flex flex-col h-full'>
				<h1 className='text-2xl font-bold my-2'>Easy Pantry</h1>
				<nav className='pb-2 mt-2 text-1xl'>
					<NavLink
						to='recipes'
						className={({ isActive }) =>
							`hover:text-gray-500 border-b-4 px-2 md:px-2 pb-2 ${isActive ? 'border-b-primary' : 'border-b-transparent'}`
						}
					>
						Recipes
					</NavLink>
					<NavLink
						to='pantry'
						className={({ isActive }) =>
							`hover:text-gray-500 border-b-4 px-2 md:px-2 pb-2 ${isActive ? 'border-b-primary' : 'border-b-transparent'}`
						}
					>
						Pantry
					</NavLink>
				</nav>
				{/* */}
				<div className=''>
					<div className='border-t border-gray-300 mb-6'></div>
					<Outlet />
				</div>
			</div>
		</>
	);
}
