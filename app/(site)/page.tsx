import Image from 'next/image';
import AuthForm from './components/AuthForm';

export default function Home() {
	return (
		<div>
			<h1 className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<Image
						alt="Logo"
						src="/images/logo.png"
						height={48}
						width={48}
						className="mx-auto w-auto"
					/>
					<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-800">
						Sign into your account
					</h2>
				</div>
				<AuthForm />
			</h1>
		</div>
	);
}
