import prisma from '@/app/lib/prismadb';
import getSession from './getSession';

export default async function getUsers() {
	const session = await getSession();

	if (!session?.user?.email) {
		return [];
	}

	try {
		const users = await prisma.user.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			where: {
				NOT: {
					// find all the users that are NOT me
					email: session.user.email,
				},
			},
		});

		return users;
	} catch (error: any) {
		return [];
	}
}
