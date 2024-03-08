import { NextResponse } from 'next/server';
// route to update name and image thru settings modal
import getCurrentUser from '@/app/lib/actions/getCurrentUser';
import prisma from '@/app/lib/prismadb';

export async function POST(request: Request) {
	try {
		const currentUser = await getCurrentUser();
		const body = await request.json();
		const { name, image } = body;

		if (!currentUser?.id) {
			return new NextResponse('Unauthorized', {
				status: 401,
			});
		}

		const updatedUser = await prisma.user.update({
			where: {
				id: currentUser.id,
			},
			data: {
				image: image,
				name: name,
			},
		});

		return NextResponse.json(updatedUser);
	} catch (error) {
		console.log(error, 'ERROR_MESSAGES');
		return new NextResponse('Error', { status: 500 });
	}
}
