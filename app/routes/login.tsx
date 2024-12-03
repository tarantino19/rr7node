import { ErrorMessage, PrimaryButton } from '~/components/forms';
import type { Route } from './+types/login';
import { z } from 'zod';
import { validateForm } from '~/utils/validation';
import { Form, useActionData } from 'react-router';

export function headers() {
	return {
		'Set-Cookie': 'rr7cookie=myValue',
	};
}

const loginSchema = z.object({
	email: z.string().email('Please enter a valid email'),
});
export const action = async ({ request }: Route.ActionArgs) => {
	const formData = await request.formData();

	return validateForm(
		formData,
		loginSchema,
		({ email }) => {
			email;
		},
		(errors) => {
			return { errors, email: formData.get('email'), status: 400 };
		}
	);
};
export default function Login() {
	const actionData = useActionData();

	return (
		<>
			<div className='text-center mt-36'>
				<h1 className='text-3xl mb-8'>RR7 Recipes</h1>
				<Form method='post' className='mx-auto md:w-1/3'>
					<div className='pb-4'>
						<input
							type='email'
							name='email'
							defaultValue={actionData?.email}
							placeholder='Email'
							autoComplete='off'
							className='w-4/5 mx-auto outline-none border-2 border-gray-200 focus:border-primary rounded-md p-2'
						/>
						<ErrorMessage className='mt-2'>{actionData?.errors?.email}</ErrorMessage>
					</div>
					<PrimaryButton className='w-1/3 mx-auto flex items-center justify-center py-3 text-md'>Login</PrimaryButton>
				</Form>
			</div>
		</>
	);
}
