import { getMagicLinkPayload } from '~/magic-links.sever';
import type { Route } from './+types/validate-magic-link';
import { data, Form, redirect, useActionData } from 'react-router';
import { commitSession, getSession } from '~/sessions';
import { createUser, getUser } from '~/models/user.server';
import { ErrorMessage, PrimaryButton, PrimaryInput } from '~/components/forms';
import { z } from 'zod';
import { validateForm } from '~/utils/validation';

//10 minutes
const magicLinkMaxAge = 1000 * 60 * 60 * 24;
export const loader = async ({ request }: Route.LoaderArgs) => {
	const magicLinkPayload = getMagicLinkPayload(request);

	const createdAt = new Date(magicLinkPayload.createdAt);
	const expiresAt = new Date(createdAt.getTime() + magicLinkMaxAge);

	if (Date.now() > expiresAt.getTime()) {
		throw new Error('Magic link expired');
	}

	const cookieHeader = request.headers.get('cookie');
	const session = await getSession(cookieHeader);

	if (session.get('nonce') !== magicLinkPayload.nonce) {
		throw new Error('Invalid nonce');
	}

	const user = await getUser(magicLinkPayload.email);

	if (user) {
		session.set('userId', user.id);
		session.unset('nonce');
		return redirect('/app/pantry', {
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		});
	}

	if (!user) {
		return new Response(JSON.stringify('No User Found'), {
			headers: {
				'Content-Type': 'application/json',
			},
			status: 400,
		});
	}
};

const signUpSchema = z.object({
	firstName: z.string().min(1, { message: 'First name is required' }),
	lastName: z.string().min(1, { message: 'Last name is required' }),
});
export const action = async ({ request }: Route.ActionArgs) => {
	const formData = await request.formData();

	return validateForm(
		formData,
		signUpSchema,
		async ({ firstName, lastName }) => {
			const magicLinkPayload = getMagicLinkPayload(request);
			const user = await createUser(magicLinkPayload.email, firstName, lastName);

			const cookieHeader = request.headers.get('cookie');
			const session = await getSession(cookieHeader);
			session.set('userId', user.id);
			session.unset('nonce');
			return redirect('/app/pantry', {
				headers: {
					'Set-Cookie': await commitSession(session),
				},
			});
		},
		(errors) => {
			return new Response(
				JSON.stringify({ errors, firstName: formData.get('firstName'), lastName: formData.get('lastName') }),
				{
					headers: {
						'Content-Type': 'application/json',
					},
					status: 400,
				}
			);
		}
	);
};
export default function ValidateMagicLink() {
	const actionData = useActionData();
	return (
		<div className='text-center'>
			<h1 className='text-2xl my-8'>You're almost done!</h1>
			<h2>Type in your name below to complete the signup process</h2>
			<form
				method='post'
				className='flex flex-col px-8 mx-16 md:mx-auto border-2 border-gray-200 rounded-md p-8 mt-8 md:w-80'
			>
				<fieldset className='mb-8 flex flex-col'>
					<div className='mb-4 text-left'>
						<label htmlFor='firstName' className='block mb-2'>
							First Name
						</label>
						<PrimaryInput
							id='firstName'
							name='firstName'
							autoComplete='off'
							defaultValue={actionData?.firstName}
							className='w-full'
						/>
						<ErrorMessage>{actionData?.errors?.firstName}</ErrorMessage>
					</div>
					<div className='mb-4 text-left'>
						<label htmlFor='lastName' className='block mb-2'>
							Last Name
						</label>
						<PrimaryInput
							id='lastName'
							name='lastName'
							defaultValue={actionData?.lastName}
							autoComplete='off'
							className='w-full'
						/>
						<ErrorMessage>{actionData?.errors?.lastName}</ErrorMessage>
					</div>
				</fieldset>

				<PrimaryButton className='w-36 mx-auto flex items-center justify-center py-3 text-md'>Sign Up</PrimaryButton>
			</form>
		</div>
	);
}
