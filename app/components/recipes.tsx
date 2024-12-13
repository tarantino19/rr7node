import { useParams } from 'react-router';
import { TimeIcon } from './icons';
import { useState, useRef, useEffect } from 'react';

type RecipePageWrapperProps = {
	children: React.ReactNode;
};

export function RecipePageWrapper({ children }: RecipePageWrapperProps) {
	return <div className='lg:flex h-full w-full'>{children}</div>;
}

type RecipeListWrapperProps = {
	children: React.ReactNode;
};

export function RecipeListWrapper({ children }: RecipeListWrapperProps) {
	const params = useParams();

	return (
		<div className={`lg:w-1/4 lg:pr-4 overflow-y-auto max-h-[88vh] ${params.recipeId ? 'hidden lg:block' : ''}`}>
			{children}
		</div>
	);
}

type RecipeDetailWrapperProps = {
	children: React.ReactNode;
};

export function RecipeDetailWrapper({ children }: RecipeDetailWrapperProps) {
	return <div className='lg:w-2/3 overflow-auto pr-4 pl-4'>{children}</div>;
}

type RecipeCardProps = {
	name: string;
	totalTime: string;
	imageUrl?: string;
	isActive?: boolean;
	isLoading?: boolean;
};

function useDelayedBool(value: boolean | undefined, delay: number) {
	const [delayed, setDelayed] = useState(false);
	const timeoutId = useRef<number>(0);
	useEffect(() => {
		if (value) {
			timeoutId.current = window.setTimeout(() => {
				setDelayed(true);
			}, delay);
		} else {
			window.clearTimeout(timeoutId.current);
			setDelayed(false);
		}
		return () => window.clearTimeout(timeoutId.current);
	}, [value, delay]);

	return delayed;
}

export function RecipeCard({ name, totalTime, imageUrl, isActive, isLoading }: RecipeCardProps) {
	const delayedLoading = useDelayedBool(isLoading, 500);

	return (
		<div
			className={`group flex shadow-md rounded-md border-2 max-w-md w-full ${
				isActive ? 'border-primary text-primary' : 'border-white'
			} ${isLoading ? 'border-gray-500 text-gray-500' : ''} hover:text-primary hover:border-primary`}
		>
			<div className='w-14 h-14 rounded-full overflow-hidden my-4 ml-3 shrink-0'>
				{imageUrl && <img src={imageUrl} alt={`recipe named ${name}`} className='object-cover h-full w-full' />}
			</div>
			<div className='p-4 flex-grow overflow-hidden'>
				<h3 className='font-semibold mb-1 text-left truncate'>
					{name} {delayedLoading ? '...' : ''}
				</h3>
				<div
					className={`flex font-light ${isActive ? 'text-primary-light' : 'text-gray-500'} ${
						isLoading ? 'text-gray-500' : ''
					} group-hover:text-primary-light`}
				>
					<TimeIcon />
					<p className='ml-1 truncate'>{totalTime}</p>
				</div>
			</div>
		</div>
	);
}
