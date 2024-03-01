import UserList from '../components/UserList';
import Sidebar from '../components/sidebar/Sidebar';
import getUsers from '../lib/actions/getUsers';

export default async function UsersLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const users = await getUsers(); // fetch Users

	return (
		<Sidebar>
			<div className="h-full">
				<UserList items={users} />
				{children}
			</div>
		</Sidebar>
	);
}
