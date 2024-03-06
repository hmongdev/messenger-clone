'use client';
// this is the component for the messages

import { useRef } from 'react';

import useChat from '@/app/lib/hooks/useChat';
import { FullMessageType } from '@/app/types';
// import MessageBox from './MessageBox';

interface BodyProps {
	initialMessages: FullMessageType[];
}

export default function Body() {
	const bottomRef = useRef<HTMLDivElement>(null);
	// const [messages, setMessages] = useState(initialMessages);

	const { chatId } = useChat();

	return (
		<div className="flex-1 overflow-y-auto">
			{/* {messages.map((message, i) => (
				<MessageBox
					isLast={i === messages.length - 1}
					key={message.id}
					data={message}
				/>
			))} */}
			<div className="pt-24" ref={bottomRef} />
		</div>
	);
}
