'use client';

import { Chat, User } from '@prisma/client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { HiChevronLeft } from 'react-icons/hi';
import { HiEllipsisHorizontal } from 'react-icons/hi2';

import useActiveList from '@/app/lib/hooks/useActiveList';
import useOtherUser from '@/app/lib/hooks/useOtherUser';

// import AvatarGroup from '@/app/components/AvatarGroup';
// import ProfileDrawer from './ProfileDrawer';

interface HeaderProps {
	chat: Chat & {
		users: User[];
	};
}

export default function Header({ chat }: HeaderProps) {
	// hook for displaying username
	const { members } = useActiveList();
	const otherUser = useOtherUser(chat);

	// states
	const [drawerOpen, setDrawerOpen] = useState(false);
	const isActive = members.indexOf(otherUser?.email!) !== -1;

	const statusText = useMemo(() => {
		if (chat.isGroup) {
			return `${chat.users.length} members`;
		}

		return isActive ? 'Active' : 'Offline';
	}, [chat, isActive]);

	return (
		<>
			{/* <ProfileDrawer
				data={chat}
				isOpen={drawerOpen}
				onClose={() => setDrawerOpen(false)}
			/> */}
			<div
				className="
        bg-white 
        w-full 
        flex 
        border-b-[1px] 
        sm:px-4 
        py-3 
        px-4 
        lg:px-6 
        justify-between 
        items-center 
        shadow-sm
      ">
				<div className="flex gap-3 items-center">
					<Link
						href="/chats"
						className="
            lg:hidden 
            block 
            text-sky-500 
            hover:text-sky-600 
            transition 
            cursor-pointer
          ">
						<HiChevronLeft size={32} />
					</Link>
					{/* {chat.isGroup ? (
						<AvatarGroup
							users={chat.users}
						/>
					) : (
						<Avatar user={otherUser} />
					)} */}
					<div className="flex flex-col">
						<div>
							{chat.name ||
								otherUser.name}
						</div>
						<div className="text-sm font-light text-neutral-500">
							{statusText}
						</div>
					</div>
				</div>
				<HiEllipsisHorizontal
					size={32}
					onClick={() => setDrawerOpen(true)}
					className="
          text-sky-500
          cursor-pointer
          hover:text-sky-600
          transition
        "
				/>
			</div>
		</>
	);
}
