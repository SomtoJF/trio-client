"use client";

import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/custom/Navbar";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { FlipWords } from "@/components/ui/flip-words";
import { ChatDemo } from "@/components/custom/ChatDemo";
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
		<main className="w-full min-h-screen bg-black text-gray-200 relative overflow-hidden">
			<Navbar />

			{/* Hero Section */}
			<article className="w-full text-white text-center px-4 lg:px-32 flex flex-col gap-10 relative z-20 min-h-[90vh] bg-black bg-grid-small-white/[0.2] items-center pt-[8%] pb-20">
				<div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,white)]"></div>
				<HoverBorderGradient
					containerClassName="rounded-full"
					as="button"
					className="bg-gray-900 text-gray-200 flex items-center py-1 px-4 space-x-2 text-xs font-semibold group"
					aria-label="Production status"
				>
					<p>Welcome to Trio</p>
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
					<Button className="bg-white w-[200px] max-w-sm p-0 rounded-lg text-black hover:bg-gray-200">
						<Link
							href={user ? "/chat/new" : "/login"}
							className="w-full h-full flex justify-center items-center px-8 py-4"
							aria-label="Get started with Trio"
						>
							Get Started
						</Link>
					</Button>
				</div>

				{/* Chat Demo Section */}
				<div className="w-full max-w-6xl mx-auto mt-16 relative z-20">
					<div className="text-center mb-8">
						<h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
							Experience Trio in Action
						</h2>
						<p className="text-neutral-400 max-w-2xl mx-auto">
							Try our interactive demo below. Ask any question and watch as both
							GPT and Claude respond with their unique perspectives.
						</p>
					</div>
					<ChatDemo />
				</div>
			</article>

			{/* Additional Content Section */}
			<section className="w-full bg-neutral-950 relative">
				<div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black"></div>
				<div className="relative z-10 px-4 lg:px-32 py-20">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">
							Why Choose Trio?
						</h2>
						<div className="grid md:grid-cols-3 gap-8 mt-12">
							<div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
								<div className="text-3xl mb-4">🤖</div>
								<h3 className="text-xl font-semibold text-white mb-3">
									Multiple AI Agents
								</h3>
								<p className="text-neutral-400">
									Chat with multiple AI models simultaneously and compare their
									unique responses and perspectives.
								</p>
							</div>
							<div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
								<div className="text-3xl mb-4">⚡</div>
								<h3 className="text-xl font-semibold text-white mb-3">
									Real-time Conversations
								</h3>
								<p className="text-neutral-400">
									Experience seamless, real-time conversations with AI agents
									that respond naturally and contextually.
								</p>
							</div>
							<div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
								<div className="text-3xl mb-4">🎯</div>
								<h3 className="text-xl font-semibold text-white mb-3">
									Custom Personalities
								</h3>
								<p className="text-neutral-400">
									Configure agents with custom traits and personalities to get
									specialized responses for your needs.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
