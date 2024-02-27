'use client';

import Button from '@/app/components/inputs/Button';
import Input from '@/app/components/inputs/Input';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import AuthSocialButton from './AuthSocialButton';

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
	const router = useRouter();
	const [variant, setVariant] = useState<Variant>('LOGIN');
	const [isLoading, setIsLoading] = useState(false); // disables buttons/form after submission

	// callback fn to set variant
	const toggleVariant = useCallback(() => {
		if (variant === 'LOGIN') {
			setVariant('REGISTER');
		} else {
			setVariant('LOGIN');
		}
	}, [variant]);

	// react-hook-form ACTIONS
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	});

	// submit function
	const onSubmit: SubmitHandler<FieldValues> = (data) => {
		setIsLoading(true);

		// axios REGISTER
		if (variant === 'REGISTER') {
			axios.post('/api/register', data)
				.then(() =>
					signIn('credentials', {
						...data,
						redirect: false,
					})
				)
				.then((callback) => {
					if (callback?.error) {
						toast.error(
							'Invalid credentials!'
						);
					}

					if (callback?.ok) {
						router.push('/conversations');
					}
				})
				.catch(() =>
					toast.error('Something went wrong!')
				)
				.finally(() => setIsLoading(false));
		}

		// NextAuth LOGIN
		if (variant === 'LOGIN') {
			signIn('credentials', {
				...data,
				redirect: false,
			})
				.then((callback) => {
					if (callback?.error) {
						toast.error(
							'Invalid credentials!'
						);
					}

					if (callback?.ok) {
						router.push('/conversations');
					}
				})
				.finally(() => setIsLoading(false));
		}
	};

	// NextAuth SOCIALS
	const socialAction = (action: string) => {
		setIsLoading(true);

		signIn(action, { redirect: false })
			.then((callback) => {
				if (callback?.error) {
					toast.error('Invalid credentials!');
				}

				if (callback?.ok) {
					router.push('/conversations');
				}
			})
			.finally(() => setIsLoading(false));
	};

	return (
		<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
			<div
				className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10
			">
				<form
					className="space-y-6"
					onSubmit={handleSubmit(onSubmit)}>
					{variant === 'REGISTER' && (
						<Input
							id="name"
							label="Name"
							register={register}
							errors={errors}
							disabled={isLoading}
						/>
					)}
					<Input
						id="email"
						label="Email Address"
						type="email"
						register={register}
						errors={errors}
						disabled={isLoading}
					/>
					<Input
						id="password"
						label="Password"
						type="password"
						register={register}
						errors={errors}
						disabled={isLoading}
					/>
					<div>
						<Button
							disabled={isLoading}
							fullWidth
							type="submit" // will trigger onSubmit
						>
							{variant === 'LOGIN'
								? 'Sign In'
								: 'Register'}
						</Button>
					</div>
				</form>
				<div className="mt-6">
					<div className="relative">
						<div
							className="
                absolute 
                inset-0 
                flex 
                items-center
              ">
							<div className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="bg-white px-2 text-gray-500">
								Or continue with
							</span>
						</div>
					</div>

					<div className="mt-6 flex gap-2">
						<AuthSocialButton
							icon={BsGithub}
							onClick={() =>
								socialAction(
									'github'
								)
							}
						/>
						<AuthSocialButton
							icon={BsGoogle}
							onClick={() =>
								socialAction(
									'google'
								)
							}
						/>
					</div>
				</div>

				<div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
					<div>
						{variant === 'LOGIN'
							? 'New to Messenger?'
							: 'Already have an account?'}
					</div>
					<div
						onClick={toggleVariant}
						className="underline cursor-pointer">
						{variant === 'LOGIN'
							? 'Create an account'
							: 'Login'}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthForm;
