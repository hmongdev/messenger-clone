import prisma from '@/app/lib/prismadb';
import getCurrentUser from './getCurrentUser';

export default async function getChatById(chatId: string) {
	try {
		const currentUser = await getCurrentUser();
		// check if currentUser has email address
		if (!currentUser?.email) {
			return null;
		}

		// find unique chat with currentUser
		const chat = await prisma.chat.findUnique({
			where: {
				id: chatId,
			},
			include: {
				users: true,
			},
		});

		return chat;
	} catch (error) {
		console.log(error, 'SERVER_ERROR');
		return null;
	}
}
