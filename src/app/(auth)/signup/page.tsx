"use client";

import { useToast } from "@/hooks";
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
import { queryKeys } from "@/query-key-factory";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signUp } from "@/services";
import { AiOutlineLoading } from "react-icons/ai";
import { useRouter } from "next/navigation";

const formSchema = z.object({
	fullName: z
		.string()
		.max(50, { message: "Fullname cannot be more than 50 characters" }),
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

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			userName: "",
			password: "",
		},
	});

	const signupMutation = useMutation({
		mutationFn: (data: z.infer<typeof formSchema>) => signUp(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
			toast.success("Account created successfully");
			setTimeout(() => {
				push("/login");
			}, 2000);
		},
		onError: (error) => {
			toast.error("We couldn't create your account");
			throw error;
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		signupMutation.mutate(values);
	}

	return (
		<div className="w-full h-full flex justify-end">
			<section className="w-full p-10 lg:p-20 space-y-8 bg-white text-black rounded-xl lg:h-full">
				<div>
					<h2 className="font-bold text-2xl">Create an account.</h2>
					<p className="text-gray-500">
						Join the chat and discover what happens when two AI agents
						collaborate. Let&apos;s get you set up!
					</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="fullName"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-bold text-sm">Full Name</FormLabel>
									<FormControl>
										<Input placeholder="Your full name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="userName"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-bold text-sm">Username</FormLabel>
									<FormControl>
										<Input
											placeholder="Agents will call you by this name"
											{...field}
										/>
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
										<Input placeholder="*******" {...field} type="password" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<small>
							Already have an account?{" "}
							<Link href="/login" className="font-bold">
								Login
							</Link>
						</small>
						<Button
							type="submit"
							className="w-full"
							disabled={signupMutation.isPending}
						>
							{signupMutation.isPending ? (
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
