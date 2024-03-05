import EmptyState from '@/app/components/EmptyState';
import getChatById from '@/app/lib/actions/getChatById';
import getMessages from '@/app/lib/actions/getMessages';
import Body from './components/Body';
import Form from './components/Form';
import Header from './components/Header';

interface IParams {
	chatId: string;
}

export default async function ChatId({ params }: { params: IParams }) {
	const chat = await getChatById(params.chatId);
	const messages = await getMessages(params.chatId);

	// if no chats
	if (!chat) {
		return (
			<div className="lg:pl-80 h-full">
				<div className="h-full flex flex-col">
					<EmptyState />
				</div>
			</div>
		);
	}

	return (
		<div className="lg:pl-80 h-full">
			<div className="h-full flex flex-col">
				Test
				<Header chat={chat} />
				<Body initialMessages={messages} />
				<Form />
			</div>
		</div>
	);
}
