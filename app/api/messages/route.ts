import getCurrentUser from '@/app/lib/actions/getCurrentUser';
import prisma from '@/app/lib/prismadb';
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

		return NextResponse.json(newMessage);
	} catch (error: any) {
		console.log(error, 'ERROR_MESSAGES');
		return new NextResponse('InternalError', {
			status: 500,
		});
	}
}
