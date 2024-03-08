'use client';
// this is the component for the messages

import { useEffect, useRef, useState } from 'react';

import useChat from '@/app/lib/hooks/useChat';
import { FullMessageType } from '@/app/types';
import axios from 'axios';
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

	// useEffect(() => {
	// 	pusherClient.subscribe(chatId);
	// 	bottomRef?.current?.scrollIntoView();

	// 	const messageHandler = (message: FullMessageType) => {
	// 		axios.post(`/api/chats/${chatId}/seen`);

	// 		setMessages((current) => {
	// 			if (find(current, { id: message.id })) {
	// 				return current;
	// 			}

	// 			return [...current, message];
	// 		});

	// 		bottomRef?.current?.scrollIntoView();
	// 	};

	// 	const updateMessageHandler = (newMessage: FullMessageType) => {
	// 		setMessages((current) =>
	// 			current.map((currentMessage) => {
	// 				if (
	// 					currentMessage.id ===
	// 					newMessage.id
	// 				) {
	// 					return newMessage;
	// 				}

	// 				return currentMessage;
	// 			})
	// 		);
	// 	};

	// 	pusherClient.bind('messages:new', messageHandler);
	// 	pusherClient.bind('message:update', updateMessageHandler);

	// 	return () => {
	// 		pusherClient.unsubscribe(chatId);
	// 		pusherClient.unbind('messages:new', messageHandler);
	// 		pusherClient.unbind(
	// 			'message:update',
	// 			updateMessageHandler
	// 		);
	// 	};
	// }, [chatId]);

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
