import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes } from 'react';

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
		<Button {...props} className={`bg-primary text-white hover:bg-primary-extra-dark ${className || ''}`}>
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
