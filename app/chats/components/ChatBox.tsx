'use client';

import clsx from 'clsx';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

// import AvatarGroup from '@/app/components/AvatarGroup';
import Avatar from '@/app/components/Avatar';
import useOtherUser from '@/app/lib/hooks/useOtherUser';
import { FullChatType } from '@/app/types';

interface ChatBoxProps {
	data: FullChatType;
	selected?: boolean;
}

const ChatBox = ({ data, selected }: ChatBoxProps) => {
	const otherUser = useOtherUser(data);
	const session = useSession();
	const router = useRouter();

	const handleClick = useCallback(() => {
		router.push(`/chats/${data.id}`);
	}, [data, router]);
	// lastMessage
	const lastMessage = useMemo(() => {
		const messages = data.messages || [];

		return messages[messages.length - 1];
	}, [data.messages]);
	// userEmail
	const userEmail = useMemo(
		() => session.data?.user?.email,
		[session.data?.user?.email]
	);

	// hasSeen
	const hasSeen = useMemo(() => {
		if (!lastMessage) {
			return false;
		}

		const seenArray = lastMessage.seen || [];

		if (!userEmail) {
			return false;
		}

		return (
			seenArray.filter((user) => user.email === userEmail)
				.length !== 0
		);
	}, [userEmail, lastMessage]);

	// lastMessageText
	const lastMessageText = useMemo(() => {
		if (lastMessage?.image) {
			return 'Sent an image';
		}

		if (lastMessage?.body) {
			return lastMessage?.body;
		}

		return 'Started a chat';
	}, [lastMessage]);

	return (
		<div
			onClick={handleClick}
			className={clsx(
				`
        w-full 
        relative 
        flex 
        items-center 
        space-x-3 
        p-3 
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
        `,
				selected ? 'bg-neutral-100' : 'bg-white'
			)}>
			{data.isGroup ? (
				// <AvatarGroup users={data.users} />
				<p>Blank</p>
			) : (
				<Avatar user={otherUser} />
			)}
			<div className="min-w-0 flex-1">
				<div className="focus:outline-none">
					<span
						className="absolute inset-0"
						aria-hidden="true"
					/>
					<div className="flex justify-between items-center mb-1">
						<p className="text-md font-medium text-gray-900">
							{data.name ||
								otherUser.name}
						</p>
						{lastMessage?.createdAt && (
							<p
								className="
                  text-xs 
                  text-gray-400 
                  font-light
                ">
								{format(
									new Date(
										lastMessage.createdAt
									),
									'p'
								)}
							</p>
						)}
					</div>
					<p
						className={clsx(
							`
              truncate 
              text-sm
              `,
							hasSeen // dynamic class that changes styling of messages if seen
								? 'text-gray-500'
								: 'text-black font-medium'
						)}>
						{lastMessageText}
					</p>
				</div>
			</div>
		</div>
	);
};

export default ChatBox;