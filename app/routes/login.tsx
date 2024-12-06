import { ErrorMessage, PrimaryButton, PrimaryInput } from '~/components/forms';
import type { Route } from './+types/login';
import { z } from 'zod';
import { validateForm } from '~/utils/validation';
import { Form, useActionData } from 'react-router';
import { commitSession, getSession } from '~/sessions';
import { generateMagicLink, sendMagicLinkEmail } from '~/magic-links.sever';
import { v4 as uuid } from 'uuid';
import { requiredLoggedOutUser } from '~/utils/auth.server';

const loginSchema = z.object({
	email: z.string().email('Please enter a valid email'),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
	await requiredLoggedOutUser(request);
	return null;
};
export const action = async ({ request }: Route.ActionArgs) => {
	await requiredLoggedOutUser(request);

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
			await sendMagicLinkEmail(link, email);
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
	console.log('actionDataRed', actionData);

	return (
		<>
			<div className='text-center mt-36'>
				{actionData === 'okay' ? (
					<div>
						<h1 className='text-3xl py-8'>You're almost there!</h1>
						<p>Check your email for a magic link to log in</p>
					</div>
				) : (
					<div>
						<h1 className='text-3xl mb-8'>RR7 Recipes</h1>
						<Form method='post' className='mx-auto md:w-1/3'>
							<div className='pb-4'>
								<PrimaryInput
									type='email'
									name='email'
									defaultValue={actionData?.email}
									placeholder='Email'
									autoComplete='off'
								/>
								<ErrorMessage className='mt-2'>{actionData?.errors?.email}</ErrorMessage>
							</div>
							<PrimaryButton className='w-1/3 mx-auto flex items-center justify-center py-3 text-md'>Login</PrimaryButton>
						</Form>
					</div>
				)}
			</div>
		</>
	);
}
