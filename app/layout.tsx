import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ActiveStatus from './components/ActiveStatus';
import AuthContext from './context/AuthContext';
import ToasterContext from './context/ToasterContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Messenger Clone',
	description: 'Real-Time Messaging with Nextjs and Pusher',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<AuthContext>
					<ToasterContext />
					<ActiveStatus />
					{children}
				</AuthContext>
			</body>
		</html>
	);
}
