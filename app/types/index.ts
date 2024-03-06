import { Chat, Message, User } from '@prisma/client';

export type FullMessageType = Message & {
	sender: User;
	seen: User[];
};

// this is necessary =>
export type FullChatType = Chat & {
	//! uses existing chat
	users: User[]; //! extends it to include populated users
	messages: FullMessageType[]; //! extends it to include populated messages
};

//! Why do we need the FullChatType?
//? In getChats.ts,
/*
We're populating `users` and `messages` making the types incompatible.

That's why we need to create a new type that holds both.
*/
