import formData from 'form-data';
import Mailgun from 'mailgun.js';

if (typeof process.env.MAILGUN_API_KEY !== 'string') {
	throw new Error('Missing mailgun api key');
}

const mailgun = new Mailgun(formData);
const client = mailgun.client({
	username: 'api',
	key: process.env.MAILGUN_API_KEY,
});

type Message = {
	from: string;
	to: string;
	subject: string;
	html: string;
};

export function sendEmail(message: Message) {
	if (typeof process.env.MAILGUN_DOMAIN !== 'string') {
		throw new Error('Missing mailgun domain or email');
	}

	return client.messages.create(process.env.MAILGUN_DOMAIN, message);
}
