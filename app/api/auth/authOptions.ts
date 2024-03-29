import prisma from '@/app/lib/prismadb'; // client session
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcrypt';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: AuthOptions = {
	// adapter
	adapter: PrismaAdapter(prisma),

	// providers
	providers: [
		// github
		GithubProvider({
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
		}),

		// google
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env
				.GOOGLE_CLIENT_SECRET as string,
		}),

		// credentials
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: 'email', type: 'text' },
				password: {
					label: 'password',
					type: 'password',
				},
			},

			// authorize function => compares user's password in DB with what the user typed
			async authorize(credentials) {
				// check if email + password exists
				if (
					!credentials?.email ||
					!credentials?.password
				) {
					throw new Error('Invalid credentials');
				}
				// if user exists, find user by email in DB
				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email,
					},
				});

				// check is necessary bc users who signed up with google / github have no hashed password
				if (!user || !user?.hashedPassword) {
					throw new Error('Invalid credentials');
				}

				//
				const isCorrectPassword = await bcrypt.compare(
					credentials.password,
					user.hashedPassword
				);

				if (!isCorrectPassword) {
					throw new Error('Invalid credentials');
				}

				return user;
			},
		}),
	],

	// debug
	debug: process.env.NODE_ENV === 'development',
	session: {
		strategy: 'jwt',
	},
	secret: process.env.NEXTAUTH_SECRET,
};
