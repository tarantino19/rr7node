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
