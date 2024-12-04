import Cryptr from 'cryptr';

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
	url.searchParams.set('payload', encryptedPayload);
	return url.toString();
}
