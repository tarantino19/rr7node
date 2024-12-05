import Cryptr from 'cryptr';
import { sendEmail } from './utils/emails.server';

if (typeof process.env.MAGIC_LINK_SECRET !== 'string') {
	throw new Error('missing env for magic link secret');
}

const cryptr = new Cryptr(process.env.MAGIC_LINK_SECRET);

type MagicLinkPayload = {
	email: string;
	nonce: string;
	createdAt: string;
};

export function generateMagicLink(email: string, nonce: string) {
	const payload: MagicLinkPayload = {
		email,
		nonce,
		createdAt: new Date().toISOString(),
	};

	const encryptedPayload = cryptr.encrypt(JSON.stringify(payload));

	if (typeof process.env.ORIGIN !== 'string') {
		throw new Error('Missing origin site');
	}

	const url = new URL(process.env.ORIGIN);
	url.pathname = '/validate-magic-link';
	url.searchParams.set('magic', encryptedPayload);
	return url.toString();
}

const isMagicLinkPayload = (payload: any): payload is MagicLinkPayload => {
	return (
		typeof payload === 'object' &&
		typeof payload.email === 'string' &&
		typeof payload.nonce === 'string' &&
		typeof payload.createdAt === 'string'
	);
};

export function getMagicLinkPayload(request: Request) {
	const url = new URL(request.url);
	const magic = url.searchParams.get('magic');

	if (typeof magic !== 'string') {
		throw new Error('Invalid magic link');
	}

	const magicLinkPayload = JSON.parse(cryptr.decrypt(magic));

	if (!isMagicLinkPayload(magicLinkPayload)) {
		throw new Error('Invalid magic link payload');
	}

	return magicLinkPayload;
}

export async function sendMagicLinkEmail(link: string, email: string): Promise<void> {
	if (process.env.NODE_ENV === 'development') {
		// Construct the HTML content as a string
		const html = `
	<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
		<h1 style="color: #4CAF50;">Login to RR7 App</h1>
		<p>
			Hey there,<br />
			Here's your login link:<br />
			<a href="${link}" style="color: #1E90FF;">${link}</a>
		</p>
		<p>Thanks!</p>
		<p>
			This platform uses <strong>passwordless login</strong>. Instead of storing a password, we rely on the security of
			your email inbox.
		</p>
	</div>
`;

		// Send the email using the sendEmail function
		try {
			await sendEmail({
				from: 'RR7 App <tolentinored19@gmail.com>',
				to: email,
				subject: 'Login to RR7 App',
				html: html,
			});
			console.log(`Magic link email sent to ${email}`);
		} catch (error) {
			console.error(`Failed to send magic link email to ${email}:`, error);
			throw error; // Re-throw the error after logging it
		}
	} else {
		console.log(link);
	}
}
