import { redirect } from 'react-router';
import { getUserById } from '~/models/user.server';
import { getSession } from '~/sessions';

export async function getCurrentUser(request: Request) {
	const cookieHeader = request.headers.get('cookie');
	const session = await getSession(cookieHeader);
	const userIdFromSession = session.get('userId');

	if (typeof userIdFromSession !== 'string') {
		return null;
	}

	const userId = await getUserById(userIdFromSession);
	return userId;
}

export async function requiredLoggedOutUser(request: Request) {
	const user = await getCurrentUser(request);

	if (user !== null) {
		throw redirect('/app/pantry');
	}
}

export async function requiredLoggedInUser(request: Request) {
	const user = await getCurrentUser(request);

	if (user === null) {
		throw redirect('/login');
	}

	return user;
}
