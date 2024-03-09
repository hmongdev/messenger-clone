'use client';
// this is the component for the messages

import { useEffect, useRef, useState } from 'react';

import useChat from '@/app/lib/hooks/useChat';
import { pusherClient } from '@/app/lib/pusher';
import { FullMessageType } from '@/app/types';
import axios from 'axios';
import { find } from 'lodash';
import MessageBox from './MessageBox';

interface BodyProps {
	initialMessages: FullMessageType[];
}

export default function Body({ initialMessages = [] }: BodyProps) {
	const bottomRef = useRef<HTMLDivElement>(null); // automatically scroll to bottom
	const [messages, setMessages] = useState(initialMessages);

	const { chatId } = useChat(); // used for pusherClient

	useEffect(() => {
		axios.post(`/api/chats/${chatId}/seen`);
	}, [chatId]);

	useEffect(() => {
		// first user has to subscribe to pusher
		pusherClient.subscribe(chatId);
		bottomRef?.current?.scrollIntoView();

		// receives new messages from pusher
		const messageHandler = (message: FullMessageType) => {
			// alert other users that we have seen the message
			axios.post(`/api/chats/${chatId}/seen`);

			setMessages((current) => {
				// compare messages to make sure we don't duplicate them
				if (find(current, { id: message.id })) {
					return current;
				}

				return [...current, message];
			});
			// scrolls to the bottom
			bottomRef?.current?.scrollIntoView();
		};
		// this updates the messages so both users will know when their messages are "seen" by the other
		const updateMessageHandler = (newMessage: FullMessageType) => {
			setMessages((current) =>
				current.map((currentMessage) => {
					if (
						currentMessage.id ===
						newMessage.id
					) {
						return newMessage;
					}

					return currentMessage;
				})
			);
		};

		pusherClient.bind('messages:new', messageHandler);
		pusherClient.bind('message:update', updateMessageHandler);

		return () => {
			pusherClient.unsubscribe(chatId);
			pusherClient.unbind('messages:new', messageHandler);
			pusherClient.unbind(
				'message:update',
				updateMessageHandler
			);
		};
	}, [chatId]);

	return (
		<div className="flex-1 overflow-y-auto">
			{messages.map((message, i) => (
				<MessageBox
					isLast={i === messages.length - 1}
					key={message.id}
					data={message}
				/>
			))}
			<div className="pt-24" ref={bottomRef} />
		</div>
	);
}
