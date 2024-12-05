import { ErrorMessage, PrimaryButton, PrimaryInput } from '~/components/forms';
import type { Route } from './+types/login';
import { z } from 'zod';
import { validateForm } from '~/utils/validation';
import { Form, useActionData } from 'react-router';
import { getUser } from '~/models/user.server';
import { data } from 'react-router';
import { sessionCookie } from '~/cookies';
import { commitSession, getSession } from '~/sessions';
import { generateMagicLink } from '~/magic-links.sever';
import { v4 as uuid } from 'uuid';

const loginSchema = z.object({
	email: z.string().email('Please enter a valid email'),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
	const cookieHeader = request.headers.get('cookie');
	const session = await getSession(cookieHeader);
	console.log('sessionData', session.data);
};
export const action = async ({ request }: Route.ActionArgs) => {
	const cookieHeader = request.headers.get('cookie');
	const session = await getSession(cookieHeader);
	const formData = await request.formData();

	return validateForm(
		formData,
		loginSchema,
		async ({ email }) => {
			const nonce = uuid();
			session.set('nonce', nonce);
			const link = generateMagicLink(email, nonce);
			console.log('magic link', link);
			return new Response('okay', {
				headers: {
					'Set-Cookie': await commitSession(session),
				},
			});
		},
		(errors) => {
			return new Response(JSON.stringify({ errors }), {
				headers: {
					'Content-Type': 'application/json',
				},
			});
		}
	);
};
export default function Login({ loaderData }: Route.ComponentProps) {
	const actionData = useActionData();

	return (
		<>
			<div className='text-center mt-36'>
				<h1 className='text-3xl mb-8'>RR7 Recipes</h1>
				<Form method='post' className='mx-auto md:w-1/3'>
					<div className='pb-4'>
						<PrimaryInput type='email' name='email' defaultValue={actionData?.email} placeholder='Email' autoComplete='off' />
						<ErrorMessage className='mt-2'>{actionData?.errors?.email}</ErrorMessage>
					</div>
					<PrimaryButton className='w-1/3 mx-auto flex items-center justify-center py-3 text-md'>Login</PrimaryButton>
				</Form>
			</div>
		</>
	);
}
