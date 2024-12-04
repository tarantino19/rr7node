import db from '~/db.server';

export async function getUser(email: string) {
	return db.user.findUnique({ where: { email } });
}
