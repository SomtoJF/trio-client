"use client";

import { Textarea } from "@/components/ui/textarea";
import { useAuthStore, useToast } from "@/hooks";
import { queryKeys } from "@/query-key-factory";
import { motion, AnimatePresence } from "framer-motion";
import {
	getChatReflections,
	getReflectionChat,
	sendReflectionMessage,
} from "@/services";
import { Reflection, User } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	Bot,
	ChevronRight,
	Loader2Icon,
	MoonStar,
	SquarePi,
	WholeWord,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import ReflectionMessage from "@/components/custom/ReflectionMessage";
import ReflectionSequence from "@/components/custom/ReflectionSequence";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
	const [newReflection, setNewReflection] = useState<Reflection | null>(null);
	const [selectedReflection, setSelectedReflection] =
		useState<Reflection | null>(null);
	const [status, setStatus] = useState<string[]>([]);
	const [openReflectionSequence, setOpenReflectionSequence] = useState(false);
	const { user } = useAuthStore();
	const toast = useToast();
	const queryClient = useQueryClient();

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

	const onSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setStatus([]);
		setIsSendingMessage(true);
		await sendReflectionMessage(
			reflectionId as string,
			{ content: message },
			(status) => setStatus(status),
			(reflection) => setNewReflection(reflection),
			(error) => {
				setIsSendingMessage(false);
				setNewReflection(null);
				toast.error("An error occured while sending your message");
				console.error(error);
			},
			() => {
				setIsSendingMessage(false);
				setNewReflection(null);
				queryClient.invalidateQueries({
					queryKey: queryKeys.chat.getChatReflections(reflectionId as string),
				});
			}
		);
	};

	return (
		<div className="w-full h-full flex flex-col justify-between items-center gap-5 sm:px-[10%] lg:px-[20%] px-4 relative">
			<nav className="bg-neutral-900 border-b border-neutral-800 flex items-center gap-5 absolute h-12 w-full px-2 z-50">
				<SidebarTrigger className="hover:bg-neutral-700 hover:text-white" />{" "}
				<div className="h-[60%] w-[1px] bg-neutral-800" />
				<div className="flex items-center gap-2 px-2">
					<p>{reflectionChat?.chatName}</p>
				</div>
			</nav>
			<ReflectionSequence
				userName={user?.userName ?? ""}
				reflection={selectedReflection}
				open={openReflectionSequence}
				setOpen={setOpenReflectionSequence}
			/>

			<div className="h-[95%] w-full overflow-y-auto pb-40 flex flex-col gap-14 overflow-x-hidden">
				{isChatEmpty && <MessageExample setMessage={setMessage} user={user} />}
				{reflections?.map((reflection) => (
					<ReflectionMessage
						key={reflection.id}
						reflection={reflection}
						userName={user?.userName ?? ""}
						setSelectedReflection={setSelectedReflection}
						setOpenReflectionSequence={setOpenReflectionSequence}
					/>
				))}
				{newReflection && (
					<ReflectionMessage
						key={newReflection.id}
						reflection={newReflection}
						userName={user?.userName ?? ""}
						setSelectedReflection={setSelectedReflection}
						setOpenReflectionSequence={setOpenReflectionSequence}
					/>
				)}
			</div>
			<div className="absolute bottom-0 w-full z-10 flex flex-col sm:px-[10%] px-4 gap-4 bg-black shadow-[0_-15px_20px_0px_rgba(0,0,0,0.9)]">
				<AnimatePresence mode="wait">
					{isSendingMessage && status.length > 0 && (
						<motion.span
							key={status[status.length - 1]}
							className="text-sm font-semibold text-neutral-400"
							initial={{ y: 10, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: -10, opacity: 0 }}
							transition={{ duration: 0.3 }}
						>
							{status[status.length - 1]}
						</motion.span>
					)}
				</AnimatePresence>
				<form onSubmit={onSendMessage}>
					<label
						htmlFor="message-input"
						className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-4"
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
							className="px-4 py-0 h-10 bg-fuchsia-700 hover:bg-fuchsia-800 transition-colors rounded-lg aspect-square flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-xs"
							disabled={
								isSendingMessage || isReflectionsFetching || message === ""
							}
						>
							{isSendingMessage ? (
								<Loader2Icon className="w-5 h-5 animate-spin" />
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="w-5 h-5"
								>
									<path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
								</svg>
							)}
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
