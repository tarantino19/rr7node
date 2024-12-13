import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes } from 'react';
import { Form, useSearchParams, useNavigation } from 'react-router';
import { SearchIcon } from './icons';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

export function Button({ children, className, disabled, ...props }: ButtonProps) {
	return (
		<button disabled={disabled} {...props} className={`flex px-3 py-2 rounded-md items-center ${className || ''}`}>
			{children}
		</button>
	);
}

export function PrimaryButton({ className, ...props }: ButtonProps) {
	return (
		<Button {...props} className={`bg-primary text-white hover:bg-primary-light ${className || ''}`}>
			{props.children}
		</Button>
	);
}

export function DeleteButton({ className, ...props }: ButtonProps) {
	return (
		<Button {...props} className={`text-dark hover:bg-primary-light ${className || ''}`}>
			{props.children}
		</Button>
	);
}

interface ErrorMessageProps extends HTMLAttributes<HTMLParagraphElement> {}

export function ErrorMessage({ className, ...props }: ErrorMessageProps) {
	return props.children ? <p {...props} className={`text-red-500 text-xs ${className}`} /> : null;
}

interface PrimaryInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function PrimaryInput({ className, ...props }: PrimaryInputProps) {
	return (
		<input
			{...props}
			className={`w-4/5 mx-auto outline-none border-2 border-gray-200 focus:border-primary rounded-md p-2 ${
				className || ''
			}`}
		/>
	);
}

type SearchBarProps = {
	placeholder: string;
};

export function SearchBar({ placeholder }: SearchBarProps) {
	const navigation = useNavigation();
	const isSearching = navigation.formData?.has('q');
	const [searchParams, setSearchParams] = useSearchParams();

	return (
		<>
			<Form className='flex border-2 border-gray-300 rounded-md focus-within:border-primary md:w-96'>
				<button className='px-2 relative'>
					{isSearching && (
						<div className='absolute inset-0 bg-white/70 flex items-center justify-center animate-spin rounded-full'>
							<svg className='h-5 w-5 text-gray-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
								<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
								<path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'></path>
							</svg>
						</div>
					)}
					<SearchIcon />
				</button>
				<input
					defaultValue={searchParams.get('q') ?? ''}
					className='w-full py-3 px-2 outline-none rounded-md'
					type='text'
					name='q'
					placeholder={placeholder}
				/>
			</Form>
		</>
	);
}
