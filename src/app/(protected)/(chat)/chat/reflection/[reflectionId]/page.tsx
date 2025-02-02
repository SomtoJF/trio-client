"use client";

import { SparklesCore } from "@/components/ui/sparkles";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/hooks";
import { cn } from "@/lib/utils";
import { queryKeys } from "@/query-key-factory";
import {
	getChatReflections,
	getReflectionChat,
	sendReflectionMessage,
} from "@/services";
import {
	Reflection,
	ReflectionMessage as ReflectionMessageType,
	User,
} from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
	Bot,
	BrainCog,
	ChevronsRight,
	FlipHorizontal2,
	MoonStar,
	SquarePi,
	WholeWord,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const EXAMPLE_MESSAGES = [
	{
		text: "Explain quantum entanglement using only emojis",
		icon: <MoonStar className="w-6 h-6" />,
		color: "blue",
	},
	{
		text: "Write a haiku about machine learning",
		icon: <Bot className="w-6 h-6" />,
		color: "green",
	},
	{
		text: "Explain why 0.1 + 0.2 ≠ 0.3 in JavaScript",
		icon: <SquarePi className="w-6 h-6" />,
		color: "red",
	},
	{
		text: "Describe consciousness without using the letter 'e'",
		icon: <WholeWord className="w-6 h-6" />,
		color: "purple",
	},
];

export default function Page() {
	const { reflectionId } = useParams();
	const [message, setMessage] = useState("");
	const [isChatEmpty, setIsChatEmpty] = useState(true);
	const [isSendingMessage, setIsSendingMessage] = useState(false);
	const { user } = useAuthStore();

	console.log(user);

	const { data: reflectionChat } = useQuery({
		queryKey: queryKeys.chat.getOneReflectionChat(reflectionId as string),
		queryFn: () => getReflectionChat(reflectionId as string),
	});

	const { data: reflections, isFetching: isReflectionsFetching } = useQuery({
		queryKey: queryKeys.chat.getChatReflections(reflectionId as string),
		queryFn: () => getChatReflections(reflectionId as string),
		enabled: !!reflectionChat,
	});

	useEffect(() => {
		if (!isReflectionsFetching && reflections && reflections.length > 0) {
			setIsChatEmpty(false);
		}
	}, [reflections, isReflectionsFetching]);

	const onSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		sendReflectionMessage(reflectionId as string, { content: message });
	};

	const mockReflections: Reflection[] = [
		{
			id: "1",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			messages: [
				{
					id: "msg-1",
					content:
						"How can we model the cascading effects of Arctic permafrost thaw on global climate systems, considering feedback loops and methane release?",
					isOptimal: false,
					senderName: "currentUser",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
				{
					id: "msg-2",
					content:
						"The model should focus on direct temperature impacts and methane release rates. We can use existing climate models like CMIP6 and add permafrost-specific parameters.",
					isOptimal: false,
					senderName: "Reflector",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
				{
					id: "msg-3",
					content:
						"We should also consider economic impacts and policy scenarios in the model, including carbon pricing and mitigation strategies.",
					isOptimal: false,
					senderName: "Reflector",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
				{
					id: "msg-4",
					content:
						"A comprehensive model would need to integrate multiple components:\n1. Thermal dynamics of permafrost degradation\n2. Biogeochemical processes (methane & CO2 release)\n3. Ocean-atmosphere coupling\n4. Vegetation changes\n5. Albedo feedback effects\n\nWe should use a coupled Earth System Model (ESM) that combines:\n- Land surface processes (CLM5)\n- Atmospheric chemistry (WACCM)\n- Ocean circulation (POP2)\n- Sea ice dynamics (CICE)\n\nKey feedback loops to model:\n- Permafrost thaw → GHG release → warming → more thaw\n- Ice loss → albedo change → warming → more ice loss\n- Vegetation shifts → carbon cycle changes → atmospheric composition\n\nTime scales: Run simulations from decades to centuries, with spatial resolution of 0.5° grid cells.",
					isOptimal: true,
					senderName: "Reflector",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
			],
		},
	];

	return (
		<div className="w-full h-full flex flex-col justify-between items-center gap-5 sm:px-[10%] px-4 relative">
			<div className="absolute top-0 left-0 text-white">
				{reflectionChat?.chatName}
			</div>
			<div className="h-[95%] w-full">
				{/* TODO: Messages go here */}
				{/* {isChatEmpty && <MessageExample setMessage={setMessage} user={user} />} */}
				{mockReflections.map((reflection) => (
					<ReflectionMessage
						key={reflection.id}
						reflection={reflection}
						userName="currentUser"
					/>
				))}
			</div>
			<div className="absolute bottom-0 w-full z-10 flex flex-col sm:px-[10%] px-4 gap-4 bg-black shadow-[0_-15px_20px_0px_rgba(0,0,0,0.9)]">
				<form onSubmit={onSendMessage}>
					<label
						htmlFor="message-input"
						className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-3xl px-4"
					>
						<Textarea
							placeholder="Ask me anything..."
							className="flex-1 rounded-3xl bg-neutral-900 text-white outline-none border-none focus-visible:ring-0 focus-visible:ring-offset-0
							 focus-visible:border-none h-fit resize-none min-h-[40px] max-h-[200px] overflow-y-auto"
							id="message-input"
							value={message}
							required
							onChange={(e) => setMessage(e.target.value)}
							onInput={(e) => {
								const target = e.target as HTMLTextAreaElement;
								target.style.height = "auto";
								target.style.height = `${target.scrollHeight}px`;
							}}
						/>
						<button
							type="submit"
							className="p-3 bg-fuchsia-700 hover:bg-fuchsia-800 transition-colors rounded-full aspect-square flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={
								isSendingMessage || isReflectionsFetching || message === ""
							}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="w-6 h-6"
							>
								<path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
							</svg>
						</button>
					</label>
				</form>
				<p className="text-center w-full text-xs text-neutral-400">
					People sometimes make mistakes, AI does too.
				</p>
			</div>
		</div>
	);
}

function MessageExample({
	setMessage,
	user,
}: {
	setMessage: (message: string) => void;
	user: User | null;
}) {
	return (
		<div className="w-full h-full flex flex-col justify-center items-center gap-10">
			<div className="flex flex-col items-center gap-2 text-center -mt-[30%]">
				<h2 className="text-2xl text-gray-400 font-semibold">
					Hi {user?.userName}
				</h2>
				<h1 className="text-4xl font-extrabold bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 inline-block text-transparent bg-clip-text">
					What would you like to know?
				</h1>
			</div>
			<div className="flex gap-4">
				{EXAMPLE_MESSAGES.map((message, index) => (
					<div
						key={index}
						className={`w-40 h-36 rounded-3xl flex flex-col items-start justify-between text-xs gap-2 px-2 py-8  bg-neutral-900 border border-neutral-800 transition-all duration-300 hover:scale-105 cursor-pointer`}
						onClick={() => setMessage(message.text)}
					>
						<p className="text-xs text-neutral-400">{message.icon}</p>
						<p>{message.text}</p>
					</div>
				))}
			</div>
		</div>
	);
}

function ReflectionMessage({
	reflection,
	userName,
}: {
	reflection: Reflection;
	userName: string;
}) {
	const [featuredMessage, setFeaturedMessage] =
		useState<ReflectionMessageType | null>(null);

	const userMessage = reflection.messages.find(
		(message) => message.senderName === userName
	);

	const reflectorMessages = reflection.messages.filter(
		(message) => message.senderName !== userName
	);

	const optimalMessage = reflection.messages.find(
		(message) => message.isOptimal === true
	);

	useEffect(() => {
		if (optimalMessage) {
			setFeaturedMessage(optimalMessage);
		}
	}, [optimalMessage]);

	return (
		<div className="w-full h-full flex flex-col text-sm items-center gap-10">
			{userMessage && (
				<div className="self-end px-3 py-2 bg-purple-100 text-black rounded-xl max-w-[70%]">
					{userMessage.content}
				</div>
			)}
			{featuredMessage && (
				<div className="self-start grid grid-cols-[25px,1fr] grid-rows-1 gap-3">
					<BrainCog className="text-purple-800 border border-gray-700 bg-purple-100 rounded-full p-1" />
					<p>{featuredMessage.content}</p>
				</div>
			)}
			<div className="flex gap-2 justify-start w-full px-[25px] overflow-x-auto overflow-y-hidden">
				{reflectorMessages.map((message) => (
					<div
						className={cn(
							"px-3 py-2 bg-neutral-900 rounded-xl flex flex-col gap-2 cursor-pointer hover:bg-neutral-800 transition-colors relative",
							message.isOptimal && "border border-gray-800",
							message.id === featuredMessage?.id && "bg-neutral-800"
						)}
						onClick={() => setFeaturedMessage(message)}
						key={message.id}
					>
						{message.isOptimal && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild className="absolute inset-0">
										<div className="w-full absolute inset-0 h-screen">
											<SparklesCore
												id="tsparticlesfullpage"
												background="transparent"
												minSize={0.6}
												maxSize={1.4}
												particleDensity={100}
												className="w-full h-full"
												particleColor="#FFFFFF"
											/>
										</div>
									</TooltipTrigger>
									<TooltipContent className="text-xs" side="bottom">
										This is the optimal answer
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
						<p className="self-start text-xs text-white line-clamp-4 overflow-hidden text-ellipsis w-[200px] ">
							{message.content}
						</p>
						<p className="text-xs text-neutral-400 flex items-center gap-1">
							<FlipHorizontal2 className="w-4 h-4 mr-1" />
							{message.senderName}
						</p>
					</div>
				))}
				<p className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer h-fit self-end px-3 py-2 text-nowrap flex">
					View generation sequence <ChevronsRight className="w-4 h-4 ml-1" />
				</p>
			</div>
		</div>
	);
}
