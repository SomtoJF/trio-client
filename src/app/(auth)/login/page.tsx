"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	AiOutlineEye,
	AiOutlineEyeInvisible,
	AiOutlineLoading,
} from "react-icons/ai";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { guestLogin, login } from "@/services";
import { queryKeys } from "@/query-key-factory";
import { useToast } from "@/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CircleUserRound } from "lucide-react";

const formSchema = z.object({
	userName: z
		.string()
		.min(2, {
			message: "Username must be at least 2 characters.",
		})
		.max(20, { message: "username cannot be more than 20 characters" }),
	password: z
		.string()
		.min(8, {
			message: "Password must be at least 8 characters.",
		})
		.max(20, { message: "Password cannot be more than 20 characters" }),
});

export default function Page() {
	const toast = useToast();
	const queryClient = useQueryClient();
	const { push } = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			userName: "",
			password: "",
		},
	});

	const loginMutation = useMutation({
		mutationFn: (data: z.infer<typeof formSchema>) => login(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
			toast.success("Login successful");
			setTimeout(() => {
				push("/chat/new");
			}, 1000);
		},
		onError: (error) => {
			toast.error(error.message);
			throw error;
		},
	});

	const guestLoginMutation = useMutation({
		mutationFn: () => guestLogin(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
			toast.success("Guest login successful");
			setTimeout(() => {
				push("/chat/new");
			}, 1000);
		},
		onError: (error) => {
			toast.error(error.message);
			throw error;
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		loginMutation.mutate(values);
	}

	return (
		<div className="w-full h-full flex justify-end">
			<section className="w-full p-10 lg:p-20 space-y-6 bg-white text-black rounded-xl lg:h-full">
				<div>
					<h2 className="font-bold text-2xl">Welcome back</h2>
					<p className="text-gray-500">
						Ready to continue the conversation? Log in and pick up right where
						you left off.
					</p>
				</div>
				<div className="flex flex-col justify-center items-center gap-2">
					<Button
						onClick={() => guestLoginMutation.mutate()}
						className="w-full"
						variant="outline"
					>
						{guestLoginMutation.isPending ? (
							<AiOutlineLoading className="animate-spin" />
						) : (
							<>
								<CircleUserRound className="w-6 h-6" />
								Continue as guest
							</>
						)}
					</Button>
				</div>

				<div className="flex justify-between gap-2 items-center">
					<hr className="w-full" />
					<p className="text-gray-500">Or</p>
					<hr className="w-full" />
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="userName"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-bold text-sm">Username</FormLabel>
									<FormControl>
										<Input placeholder="Your username..." {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-bold text-sm">Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												placeholder="*******"
												{...field}
												type={showPassword ? "text" : "password"}
											/>
											<button
												type="button"
												onClick={() => setShowPassword(!showPassword)}
												className="absolute right-3 top-1/2 -translate-y-1/2"
											>
												{showPassword ? (
													<AiOutlineEyeInvisible className="h-4 w-4 text-gray-500" />
												) : (
													<AiOutlineEye className="h-4 w-4 text-gray-500" />
												)}
											</button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<small>
							Dont have an account?{" "}
							<Link href="/signup" className="font-bold">
								Sign up
							</Link>
						</small>
						<Button
							type="submit"
							className="w-full"
							disabled={loginMutation.isPending}
						>
							{loginMutation.isPending ? (
								<AiOutlineLoading className="animate-spin" />
							) : (
								"Submit"
							)}
						</Button>
					</form>
				</Form>
			</section>
		</div>
	);
}
