'use client';
// this is the component for the user input => writing messages

import useChat from '@/app/lib/hooks/useChat';
import axios from 'axios';
// import { CldUploadButton } from 'next-cloudinary';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import MessageInput from './MessageInput';

export default function Form() {
	// hooks
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
		console.log('chatId', chatId);
		// after user sends message, clear the input
		setValue('message', '', { shouldValidate: true });
		// send user's message to messages route
		axios.post('/api/messages', {
			...data,
			chatId: chatId,
		});
	};

	const handleUpload = (result: any) => {
		axios.post('/api/messages', {
			image: result.info.secure_url,
			chatId: chatId,
		});
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
			{/* <CldUploadButton
				options={{ maxFiles: 1 }}
				onUpload={handleUpload}
				uploadPreset="pgc9ehd5">
			</CldUploadButton> */}
			<HiPhoto size={30} className="text-sky-500" />
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex items-center gap-2 lg:gap-4 w-full">
				<MessageInput
					id="message"
					register={register}
					errors={errors}
					required
					placeholder="Write a message"
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
