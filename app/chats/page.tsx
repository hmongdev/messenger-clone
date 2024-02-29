'use client';

import clsx from 'clsx';

import EmptyState from '../components/EmptyState';
import useChat from '../lib/hooks/useChat';

const Home = () => {
	const { isOpen } = useChat();

	return (
		<div
			className={clsx(
				'lg:pl-80 h-full lg:block',
				isOpen ? 'block' : 'hidden'
			)}>
			<EmptyState />
		</div>
	);
};

export default Home;
