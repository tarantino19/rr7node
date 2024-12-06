import { redirect } from 'react-router';
import { getSession, destroySession } from '~/sessions';
import { Route } from './+types/logout';

export const loader = async ({ request }: Route.LoaderArgs) => {
	const cookieHeader = request.headers.get('cookie');
	const session = await getSession(cookieHeader);
	session.unset('userId');
	return redirect('/login', {
		headers: {
			'Set-Cookie': await destroySession(session),
		},
	});
};
