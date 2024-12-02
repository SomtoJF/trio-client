"use client";

import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/custom/Navbar";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { FlipWords } from "@/components/ui/flip-words";
import { FaAngleRight } from "react-icons/fa6";
import { getCurrentUser } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/query-key-factory";
import { useEffect } from "react";
import { useAuthStore } from "@/hooks";
import Link from "next/link";

export default function Index() {
	const { setUser, user } = useAuthStore((state) => state);

	const currentUserQuery = useQuery({
		queryKey: queryKeys.user.currentUser(),
		queryFn: getCurrentUser,
	});

	useEffect(() => {
		if (!currentUserQuery.isFetching) setUser(currentUserQuery.data ?? null);
	}, [currentUserQuery.isFetching, currentUserQuery.data]);

	return (
		<div className="w-full min-h-screen bg-black text-gray-200 relative overflow-hidden px-4 lg:px-10">
			<Navbar />
			<section className="w-full text-white text-center px-4 lg:px-32 flex flex-col gap-10 relative z-20 h-[90vh] bg-black bg-grid-small-white/[0.2] items-center pt-[8%]">
				<div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,white)]"></div>
				<HoverBorderGradient
					containerClassName="rounded-full"
					as="button"
					className="bg-gray-900 text-gray-200 flex items-center py-1 px-4 space-x-2 text-xs font-semibold group"
				>
					<p>still in production, but coming soon</p>
					<FaAngleRight className="group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />
				</HoverBorderGradient>
				<h1 className="text-4xl sm:text-5xl text-white relative z-20 lg:px-20 font-semibold">
					Ever wondered what it&apos;s like to talk to <br /> two{" "}
					<FlipWords
						words={["GPTs", "Geminis", "Claudes"]}
						duration={2000}
						className="text-white"
					/>{" "}
					<br />
					at once?
				</h1>
				<p className="relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 lg:w-1/2 self-center">
					Trio empowers you to do exactly this by letting you add agents with
					custom personalities and traits to group chats.
				</p>
				<div className="flex gap-10 self-center">
					<Button className="bg-white p-0 rounded-lg text-black hover:bg-gray-200">
						<Link
							href={user ? "/chat" : "/login"}
							className="w-full h-full flex justify-center items-center px-8 py-4"
						>
							Get Started
						</Link>
					</Button>
					<Button
						variant={"outline"}
						className=" px-8 py-4 bg-transparent rounded-lg border-solid border-[1px] border-gray-200"
					>
						Learn More
					</Button>
				</div>
			</section>
		</div>
	);
}
