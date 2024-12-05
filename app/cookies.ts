import { createCookie } from 'react-router';

if (typeof process.env.AUTH_COOKIE_SECRET !== 'string') {
	throw new Error('AUTH_COOKIE_SECRET is not set');
}

export const sessionCookie = createCookie('rr7-session', {
	secrets: [process.env.AUTH_COOKIE_SECRET],
	httpOnly: true,
	secure: true,
	maxAge: 60 * 60 * 24 * 7, //7 Days
});
