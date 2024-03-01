import prisma from '@/app/lib/prismadb';
import getCurrentUser from '../actions/getCurrentUser';

export default async function getChats() {
	const currentUser = await getCurrentUser();
	// if there's no currentUser
	if (!currentUser?.id) {
		return [];
	}

	// if currentUser has id, fetch their chats
	try {
		const chats = await prisma.chat.findMany({
			orderBy: {
				lastMessageAt: 'desc', // fetch chats based on newest message
			},
			where: {
				userIds: {
					has: currentUser.id,
				},
			},
			include: {
				users: true, // populates users
				messages: {
					// populates messages
					include: {
						sender: true, // author of message
						seen: true, // array of people who've seen the message
					},
				},
			},
		});

		return chats;
	} catch (error: any) {
		return [];
	}
}
