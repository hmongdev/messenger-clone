import getCurrentUser from '@/app/lib/actions/getCurrentUser';
import { NextResponse } from 'next/server';

import prisma from '@/app/lib/prismadb';
import { pusherServer } from '@/app/lib/pusher';

export async function POST(request: Request) {
	try {
		const currentUser = await getCurrentUser();
		const body = await request.json();
		const {
			userId, // single chat
			isGroup, // boolean, group chat
			members, // name of the members in a group
			name, // name of the group chat
		} = body;

		// if currentUser !exist...
		if (!currentUser?.id || !currentUser?.email) {
			return new NextResponse('Unauthorized', {
				status: 400,
			});
		}

		// if group !exist...
		if (isGroup && (!members || members.length < 2 || !name)) {
			return new NextResponse('Invalid data', {
				status: 400,
			});
		}

		// if group EXISTS...
		if (isGroup) {
			const newChat = await prisma.chat.create({
				data: {
					name,
					isGroup,
					users: {
						connect: [
							...members.map(
								(member: {
									value: string;
								}) => ({
									id: member.value,
								})
							),
							{
								id: currentUser.id, // adding our userid
							},
						],
					},
				},
				include: {
					users: true, // populates users when we fetch chats => NEED to do this in prisma
				},
			});

			// Update all connections with new chat
			newChat.users.forEach((user) => {
				if (user.email) {
					pusherServer.trigger(
						user.email,
						'chat:new',
						newChat
					);
				}
			});

			return NextResponse.json(newChat);
		}
		// check if existing chat with another user exists...
		const existingChats = await prisma.chat.findMany({
			// look thru all chats
			where: {
				OR: [
					{
						userIds: {
							equals: [
								currentUser.id, // find id of loggedin currentUser
								userId, // find id of the user we want to message
							],
						},
					},
					// this is here bc there was an error that duplicated the creation of a chat
					{
						userIds: {
							equals: [
								userId,
								currentUser.id,
							],
						},
					},
				],
			},
		});

		const singleChat = existingChats[0];
		// if existing chat exists, return that chat
		if (singleChat) {
			return NextResponse.json(singleChat);
		}

		// if existing chat doesn't exist, create a new 1-1 chat...
		const newChat = await prisma.chat.create({
			data: {
				users: {
					connect: [
						{
							id: currentUser.id,
						},
						{
							id: userId,
						},
					],
				},
			},
			include: {
				users: true, // include true when using with UI
			},
		});

		// Update all connections with new chat
		newChat.users.map((user) => {
			if (user.email) {
				pusherServer.trigger(
					user.email,
					'chat:new',
					newChat
				);
			}
		});

		return NextResponse.json(newChat);
	} catch (error) {
		return new NextResponse('Internal Error', { status: 500 });
	}
}
