import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';

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
		<Button {...props} className={`bg-red-500 text-white hover:bg-red-600 ${className || ''}`}>
			{props.children}
		</Button>
	);
}

interface ErrorMessageProps extends HTMLAttributes<HTMLParagraphElement> {}

export function ErrorMessage({ className, ...props }: ErrorMessageProps) {
	return props.children ? <p {...props} className={`text-red-500 text-xs ${className}`} /> : null;
}
