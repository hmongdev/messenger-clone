import prisma from '@/app/lib/prismadb';

export default async function getMessages(chatId: string) {
	try {
		// find messages
		const messages = await prisma.message.findMany({
			where: {
				chatId: chatId,
			},
			include: {
				sender: true,
				seen: true,
			},
			orderBy: {
				createdAt: 'asc', // not 'desc' because we want the newest messages at the bottom, not the top
			},
		});

		return messages;
	} catch (error: any) {
		return [];
	}
}
