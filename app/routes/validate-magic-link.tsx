import { getMagicLinkPayload } from '~/magic-links.sever';
import type { Route } from './+types/validate-magic-link';
import { data, redirect } from 'react-router';
import { commitSession, getSession } from '~/sessions';
import { getUser } from '~/models/user.server';

//10 minutes
const magicLinkMaxAge = 1000 * 60 * 60 * 24;
export const loader = async ({ request }: Route.LoaderArgs) => {
	const magicLinkPayload = getMagicLinkPayload(request);
	console.log('magicLinkPayload', magicLinkPayload);

	const createdAt = new Date(magicLinkPayload.createdAt);
	const expiresAt = new Date(createdAt.getTime() + magicLinkMaxAge);

	if (Date.now() > expiresAt.getTime()) {
		throw new Error('Magic link expired');
	}

	const cookieHeader = request.headers.get('cookie');
	const session = await getSession(cookieHeader);

	if (magicLinkPayload.nonce !== session.get('nonce')) {
		throw new Error('Invalid nonce');
	}

	const user = await getUser(magicLinkPayload.email);

	if (!user) {
		throw new Error('User not found');
	}

	if (user) {
		session.set('userId', user.id);
		return redirect('/app', {
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		});
	}

	return new Response(JSON.stringify('alright'), {
		headers: {
			'Set-Cookie': await commitSession(session),
		},
		status: 200,
	});
};
