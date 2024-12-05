import db from '~/db.server';

export async function getUser(email: string) {
	return db.user.findUnique({ where: { email } });
}

export async function createUser(email: string, firstName: string, lastName: string) {
	return db.user.create({
		data: {
			email,
			firstName,
			lastName,
		},
	});
}

export async function getUserById(id: string) {
	return db.user.findUnique({ where: { id } });
}
