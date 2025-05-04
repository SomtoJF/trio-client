"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore, useToast } from "@/hooks";
import { queryKeys } from "@/query-key-factory";
import {
	getBasicChat,
	getBasicChatMessages,
	sendBasicMessage,
} from "@/services";
import { User } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	Bot,
	Loader2Icon,
	MoonStar,
	SquarePi,
	WholeWord,
	Send,
	Info,
	X,
	MessageSquare,
	Clock,
	ArrowUpRight,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BasicChat {
	id: string;
	chatName: string;
	chatAgents: Array<{
		id: string;
		AgentName: string;
		AgentTraits: string[];
		createdAt: string;
	}>;
}

interface BasicChatMessage {
	id: string;
	content: string;
	senderName: string;
	createdAt: string;
}

interface AgentStatus {
	agentName: string;
	status: string;
}

interface AgentResponse {
	agentName: string;
	content: string;
}

interface ChatResponse {
	status: AgentStatus[];
	agentResponses: AgentResponse[];
	error?: string;
}

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
	const { id } = useParams();
	const { data: basicChat } = useQuery({
		queryKey: queryKeys.chat.getOneBasicChat(id as string),
		queryFn: () => getBasicChat(id as string),
	});
	const { data: basicChatMessages, isFetching: isBasicChatMessagesFetching } =
		useQuery({
			queryKey: queryKeys.chat.getBasicChatMessages(id as string),
			queryFn: () => getBasicChatMessages(id as string),
		});
	const { user } = useAuthStore();
	const [message, setMessage] = useState("");
	const [selectedAgent, setSelectedAgent] = useState<
		BasicChat["chatAgents"][0] | null
	>(null);
	const [agentStatuses, setAgentStatuses] = useState<{ [key: string]: string }>(
		{}
	);
	const [streamedResponses, setStreamedResponses] = useState<{
		[key: string]: string;
	}>({});
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const toast = useToast();
	const queryClient = useQueryClient();

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [basicChatMessages, streamedResponses]);

	const handleSendMessage = () => {
		if (message.trim()) {
			sendMessageMutation.mutate(message);
			setMessage("");
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const sendMessageMutation = useMutation({
		mutationFn: (message: string) =>
			new Promise<void>((resolve, reject) => {
				sendBasicMessage(
					id as string,
					message,
					(response) => {
						// Update agent statuses and responses
						response.status.forEach((status) => {
							setAgentStatuses((prev) => ({
								...prev,
								[status.agentName]: status.status,
							}));
						});

						response.agentResponses.forEach((agentResponse) => {
							setStreamedResponses((prev) => ({
								...prev,
								[agentResponse.agentName]: agentResponse.content,
							}));
						});

						if (response.error) {
							toast.error(response.error);
						}
					},
					() => {
						// On done
						queryClient.invalidateQueries({
							queryKey: queryKeys.chat.getBasicChatMessages(id as string),
						});
						setAgentStatuses({});
						setStreamedResponses({});
						resolve();
					},
					(error) => {
						// On error
						toast.error(error);
						reject(error);
					}
				);
			}),
		onError: () => {
			toast.error("An error occurred while sending your message");
		},
	});

	if (!basicChat) return null;

	return (
		<div className="flex h-full">
			{/* Main chat area */}
			<div className="flex-1 flex flex-col border-r border-neutral-800">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-neutral-800">
					<div className="flex items-center gap-2">
						<SidebarTrigger />
						<MessageSquare className="w-5 h-5 text-purple-500" />
						<h1 className="text-lg font-medium">{basicChat.chatName}</h1>
					</div>
				</div>

				{/* Messages area */}
				<ScrollArea className="flex-1 p-4">
					<div className="space-y-6">
						{basicChatMessages?.map((message: BasicChatMessage) => (
							<div
								key={message.id}
								className={cn(
									"flex flex-col gap-1",
									message.senderName === user?.userName
										? "items-end"
										: "items-start"
								)}
							>
								<div className="flex items-center gap-2">
									{message.senderName !== user?.userName && (
										<>
											<Bot className="w-4 h-4 text-purple-500" />
											<span className="text-sm font-medium text-purple-300">
												{message.senderName}
											</span>
										</>
									)}
									<span className="text-xs text-neutral-500">
										<Clock className="w-3 h-3 inline mr-1" />
										{moment(message.createdAt).format("HH:mm")}
									</span>
								</div>
								<div
									className={cn(
										"rounded-lg px-4 py-2 max-w-[80%] text-sm",
										message.senderName === user?.userName
											? "bg-purple-900/50 text-white"
											: "bg-neutral-800 text-neutral-200"
									)}
								>
									{message.content.split(/(@\w+)/g).map((part, index) =>
										part.startsWith("@") ? (
											<span key={index} className="text-blue-500">
												{part}
											</span>
										) : (
											part
										)
									)}
								</div>
							</div>
						))}

						{Object.entries(streamedResponses).map(([agentName, content]) => (
							<div key={agentName} className="flex flex-col gap-1">
								<div className="flex items-center gap-2">
									<Bot className="w-4 h-4 text-purple-500" />
									<span className="text-sm font-medium text-purple-300">
										{agentName}
									</span>
									{agentStatuses[agentName] && (
										<Badge variant="outline" className="text-xs">
											{agentStatuses[agentName]}
										</Badge>
									)}
								</div>
								<div className="rounded-lg px-4 py-2 bg-neutral-800 text-neutral-200 max-w-[80%] text-sm">
									{content.split(/(@\w+)/g).map((part, index) =>
										part.startsWith("@") ? (
											<span key={index} className="text-blue-500">
												{part}
											</span>
										) : (
											part
										)
									)}
								</div>
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>
				</ScrollArea>

				{/* Input area */}
				<div className="p-4 border-t border-neutral-800">
					<div className="flex gap-2">
						<Textarea
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Type your message..."
							className="min-h-[60px] resize-none bg-neutral-900 border-neutral-800 focus:border-purple-500"
						/>
						<Button
							onClick={handleSendMessage}
							disabled={!message.trim() || sendMessageMutation.isPending}
							className="bg-purple-500 hover:bg-purple-600"
						>
							{sendMessageMutation.isPending ? (
								<Loader2Icon className="w-4 h-4 animate-spin" />
							) : (
								<Send className="w-4 h-4" />
							)}
						</Button>
					</div>
				</div>
			</div>

			{/* Agent info sidebar */}
			<div className="w-80 flex flex-col border-l border-neutral-800">
				<div className="p-4 border-b border-neutral-800">
					<h2 className="text-lg font-medium flex items-center gap-2">
						<Bot className="w-5 h-5 text-purple-500" />
						Agents
					</h2>
				</div>
				<ScrollArea className="flex-1">
					<div className="p-4 space-y-4">
						{basicChat.chatAgents.map((agent: BasicChat["chatAgents"][0]) => (
							<div
								key={agent.id}
								className={cn(
									"p-4 rounded-lg cursor-pointer transition-colors",
									selectedAgent?.id === agent.id
										? "bg-purple-900/50"
										: "bg-neutral-800/50 hover:bg-neutral-800"
								)}
								onClick={() => setSelectedAgent(agent)}
							>
								<div className="flex items-center gap-2 mb-2">
									<Bot className="w-4 h-4 text-purple-500" />
									<h3 className="font-medium text-purple-300">
										{agent.AgentName}
									</h3>
								</div>
								<div className="flex flex-wrap gap-2 mb-2">
									{agent.AgentTraits.map((trait, index) => (
										<Badge
											key={index}
											variant="secondary"
											className="bg-purple-900/50 text-purple-300 text-xs"
										>
											{trait}
										</Badge>
									))}
								</div>
								<div className="flex items-center gap-2 text-xs text-neutral-500">
									<Clock className="w-3 h-3" />
									Created {moment(agent.createdAt).fromNow()}
								</div>
							</div>
						))}
					</div>
				</ScrollArea>
			</div>

			{/* Agent Info Dialog */}
			<Dialog
				open={!!selectedAgent}
				onOpenChange={() => setSelectedAgent(null)}
			>
				<DialogContent className="bg-neutral-900 text-white border-none max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Bot className="w-5 h-5 text-purple-500" />
							{selectedAgent?.AgentName}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div className="space-y-2">
							<h3 className="text-sm font-medium text-purple-300">Traits</h3>
							<div className="flex flex-wrap gap-2">
								{selectedAgent?.AgentTraits.map((trait, index) => (
									<Badge
										key={index}
										variant="secondary"
										className="bg-purple-900/50 text-purple-300"
									>
										{trait}
									</Badge>
								))}
							</div>
						</div>
						<div className="space-y-2">
							<h3 className="text-sm font-medium text-purple-300">About</h3>
							<p className="text-sm text-neutral-300">
								This agent is part of your chat group and can help with various
								tasks based on its specialized traits.
							</p>
						</div>
						<div className="flex items-center gap-2 text-xs text-neutral-500">
							<Clock className="w-3 h-3" />
							Created {moment(selectedAgent?.createdAt).fromNow()}
						</div>
					</div>
				</DialogContent>
			</Dialog>
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
