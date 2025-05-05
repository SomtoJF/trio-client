"use client";

import React, { useEffect } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { LoadingScreen, Navbar } from "@/components/custom/";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/query-key-factory";
import { getCurrentUser } from "@/services";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks";

export default function Layout({ children }: { children: React.ReactNode }) {
	const { push } = useRouter();
	const setUser = useAuthStore((state) => state.setUser);
	const currentUserQuery = useQuery({
		queryKey: queryKeys.user.currentUser(),
		queryFn: getCurrentUser,
		retry: false,
	});

	useEffect(() => {
		if (!currentUserQuery.isFetching) setUser(currentUserQuery.data ?? null);
	}, [currentUserQuery.isFetching, currentUserQuery.data]);

	if (currentUserQuery.isPending || currentUserQuery.isFetching) {
		return <LoadingScreen />;
	} else if (currentUserQuery.isSuccess) {
		setTimeout(() => {
			push("/");
		}, 1000);
	} else
		return (
			<div className="bg-neutral-950 relative antialiased">
				<BackgroundBeams className="!absolute hidden sm:block" />
				<Navbar className="px-10" />
				<div className="w-full h-[90vh] flex justify-center lg:justify-between items-center px-4 md:px-10 py-5 gap-20">
					<div className="hidden h-full w-1/2  bg-transparent relative lg:flex flex-col items-start py-20">
						<div className="max-w-2xl mx-auto p-4 relative z-10 space-y-8 ">
							<h1 className="relative z-10 text-lg md:text-7xl font-sans font-bold">
								Join the conversation
							</h1>
							<p className="max-w-lg my-2 text-sm relative z-10">
								Welcome to Trio, your collaborative AI chat platform. With Trio,
								you can either chat with multiple AI agents for diverse
								perspectives or engage in an iterative conversation where a
								single agent refines its responses step by step until you reach
								the optimal answer—all designed to help you get the best results
								from your AI interactions.
							</p>
						</div>
					</div>
					<div className="w-full max-w-[500px] h-fit relative z-50">
						{children}
					</div>
				</div>
			</div>
		);
}
