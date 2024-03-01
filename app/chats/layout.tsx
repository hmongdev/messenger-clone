import Sidebar from '../components/sidebar/Sidebar';
import getUsers from '../lib/actions/getUsers';
import getChats from '../lib/hooks/getChats';
import ChatList from './components/ChatList';

export default async function ChatsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const chats = await getChats();
	const users = await getUsers();

	return (
		<Sidebar>
			<div className="h-full">
				<ChatList
					users={users}
					title="Messages"
					initialItems={chats}
				/>
				{children}
			</div>
		</Sidebar>
	);
}
