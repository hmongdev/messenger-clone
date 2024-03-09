import getCurrentUser from '@/app/lib/actions/getCurrentUser';
import prisma from '@/app/lib/prismadb';
import { pusherServer } from '@/app/lib/pusher';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		// get currentUser
		const currentUser = await getCurrentUser();
		const body = await request.json();
		// what are we sending to mongoDB?
		const { message, image, chatId } = body;

		// check if user is authorized
		if (!currentUser?.id || !currentUser?.email) {
			return new NextResponse('Unauthorized', {
				status: 401,
			});
		}

		// create new message
		const newMessage = await prisma.message.create({
			data: {
				body: message,
				image: image,
				chat: {
					connect: {
						id: chatId,
					},
				},
				sender: {
					connect: {
						id: currentUser.id,
					},
				},
			},
			include: {
				seen: true,
				sender: true,
			},
		});

		// update chat to show all messages
		const updatedChat = await prisma.chat.update({
			where: {
				id: chatId,
			},
			data: {
				lastMessageAt: new Date(),
				messages: {
					connect: {
						id: newMessage.id,
					},
				},
			},
			include: {
				users: true,
				messages: {
					include: {
						seen: true,
					},
				},
			},
		});

		// pusher
		//adds new message in real-time
		await pusherServer.trigger(chatId, 'messages:new', newMessage);

		const lastMessage =
			updatedChat.messages[updatedChat.messages.length - 1];

		// this is to update messages for the desktopsidebar
		updatedChat.users.map((user) => {
			pusherServer.trigger(user.email!, 'chat:update', {
				id: chatId,
				messages: [lastMessage],
			});
		});

		return NextResponse.json(newMessage);
	} catch (error: any) {
		console.log(error, 'ERROR_MESSAGES');
		return new NextResponse('InternalError', {
			status: 500,
		});
	}
}
