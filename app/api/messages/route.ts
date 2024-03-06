// this is the route that will receive messages from the user and post them to MongoDB

import { NextResponse } from 'next/server';

import getCurrentUser from '@/app/lib/actions/getCurrentUser';
import prisma from '@/app/lib/prismadb';

export async function POST(request: Request) {
	try {
		const currentUser = await getCurrentUser();
		const body = await request.json();
		const { message, image, chatId } = body;

		// check if user is authorized to view messages
		if (!currentUser?.id || !currentUser?.email) {
			return new NextResponse('Unauthorized', {
				status: 401,
			});
		}
		//! 1. create new message within a chat
		// newMessage includes the sender and seen
		const newMessage = await prisma.message.create({
			include: {
				seen: true,
				sender: true,
			},
			data: {
				body: message,
				image: image,
				chat: {
					connect: { id: chatId },
				},
				sender: {
					connect: { id: currentUser.id },
				},
				seen: {
					connect: {
						id: currentUser.id,
					},
				},
			},
		});

		//! 2. update the chat to include all messages
		// const updatedChat = await prisma.chat.update({
		// 	// find the chat
		// 	where: {
		// 		id: chatId,
		// 	},
		// 	// update the lastMessageAt field
		// 	data: {
		// 		lastMessageAt: new Date(),
		// 		messages: {
		// 			connect: {
		// 				id: newMessage.id,
		// 			},
		// 		},
		// 	},
		// 	include: {
		// 		users: true,
		// 		messages: {
		// 			include: {
		// 				seen: true,
		// 			},
		// 		},
		// 	},
		// });

		// await pusherServer.trigger(chatId, 'messages:new', newMessage);

		// const lastMessage =
		// 	updatedChat.messages[updatedChat.messages.length - 1];

		// updatedChat.users.map((user) => {
		// 	pusherServer.trigger(user.email!, 'chat:update', {
		// 		id: chatId,
		// 		messages: [lastMessage],
		// 	});
		// });

		return NextResponse.json(newMessage);
	} catch (error) {
		console.log(error, 'ERROR_MESSAGES');
		return new NextResponse('Error', { status: 500 });
	}
}
