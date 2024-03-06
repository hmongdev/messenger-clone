'use client';

import useChat from '@/app/lib/hooks/useChat';
import axios from 'axios';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import MessageInput from './MessageInput';

export default function Form() {
	const { chatId } = useChat();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			message: '',
		},
	});

	const onSubmit: SubmitHandler<FieldValues> = (data) => {
		const chatIdString = new Object(chatId).toString();

		axios.post('/api/messages', {
			...data,
			chatId: chatIdString,
		});

		setValue('message', '', { shouldValidate: true });
	};

	return (
		<div
			className="
		py-4 
		px-4 
		bg-white 
		border-t 
		flex 
		items-center 
		gap-2 
		lg:gap-4 
		w-full
	">
			<HiPhoto size={30} className="text-sky-500" />
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex items-center gap-2 lg:gap-4 w-full">
				<MessageInput
					id="message"
					register={register}
					errors={errors}
					required
					placeholder="Write your message here..."
				/>
				<button
					type="submit"
					className="
				rounded-full 
				p-2 
				bg-sky-500 
				cursor-pointer 
				hover:bg-sky-600 
				transition
			">
					<HiPaperAirplane
						size={18}
						className="text-white"
					/>
				</button>
			</form>
		</div>
	);
}
