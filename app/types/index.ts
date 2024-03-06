import { Chat, Message, User } from '@prisma/client';

export type FullChatType = Chat & {
	users: User[];
	messages: FullMessageType[];
};

export type FullMessageType = Message & {
	sender: User;
	seen: User[];
};

