"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
	id: string;
	content: string;
	sender: "user" | "gpt" | "claude";
	timestamp: Date;
}

interface Agent {
	name: string;
	color: string;
	avatar: string;
	responses: string[];
}

const agents: Record<string, Agent> = {
	gpt: {
		name: "GPT",
		color: "from-green-500 to-emerald-600",
		avatar: "🤖",
		responses: [
			"That's a fascinating question! Let me break this down for you step by step...",
			"I can help you with that. Based on my training, here's what I think...",
			"Great point! Here's another perspective to consider...",
			"That's an interesting challenge. Let me suggest a few approaches...",
			"I love this topic! Here's a comprehensive overview...",
		],
	},
	claude: {
		name: "Claude",
		color: "from-orange-500 to-red-600",
		avatar: "🧠",
		responses: [
			"I appreciate you bringing this up. From my perspective...",
			"That's a thoughtful question. I'd like to add that...",
			"Building on what GPT mentioned, I think it's also worth considering...",
			"I have a slightly different take on this. Here's why...",
			"Excellent discussion! I'd like to explore this further...",
		],
	},
};

export function ChatDemo() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [activeAgent, setActiveAgent] = useState<"gpt" | "claude">("gpt");
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const getRandomResponse = (agentKey: "gpt" | "claude") => {
		const agent = agents[agentKey];
		return agent.responses[Math.floor(Math.random() * agent.responses.length)];
	};

	const simulateAgentResponse = (agentKey: "gpt" | "claude") => {
		return new Promise<void>((resolve) => {
			setTimeout(() => {
				const response = getRandomResponse(agentKey);
				const newMessage: Message = {
					id: `${agentKey}-${Date.now()}`,
					content: response,
					sender: agentKey,
					timestamp: new Date(),
				};

				setMessages((prev) => [...prev, newMessage]);
				resolve();
			}, 800 + Math.random() * 700); // 0.8-1.5 second delay
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputValue.trim() || isLoading) return;

		// Add user message
		const userMessage: Message = {
			id: `user-${Date.now()}`,
			content: inputValue,
			sender: "user",
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputValue("");
		setIsLoading(true);

		// Simulate loading for 1 second
		setTimeout(async () => {
			// Both agents respond
			await Promise.all([
				simulateAgentResponse("gpt"),
				simulateAgentResponse("claude"),
			]);

			setIsLoading(false);
			// Alternate which agent responds first next time
			setActiveAgent((prev) => (prev === "gpt" ? "claude" : "gpt"));
		}, 1000);
	};

	const MessageBubble = ({ message }: { message: Message }) => {
		const isUser = message.sender === "user";
		const agent =
			message.sender !== "user"
				? agents[message.sender as keyof typeof agents]
				: null;

		return (
			<div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
				<div
					className={`flex items-start gap-3 max-w-[80%] ${
						isUser ? "flex-row-reverse" : ""
					}`}
				>
					{!isUser && agent && (
						<div
							className={`w-8 h-8 rounded-full bg-gradient-to-br ${agent.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
						>
							{agent.avatar}
						</div>
					)}
					<div
						className={`px-4 py-3 rounded-2xl ${
							isUser
								? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
								: "bg-neutral-800 text-gray-200"
						} shadow-lg`}
					>
						{!isUser && agent && (
							<div
								className={`text-xs font-semibold mb-1 bg-gradient-to-r ${agent.color} bg-clip-text text-transparent`}
							>
								{agent.name}
							</div>
						)}
						<p className="text-sm leading-relaxed">{message.content}</p>
					</div>
					{isUser && (
						<div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
							👤
						</div>
					)}
				</div>
			</div>
		);
	};

	return (
		<div className="w-full max-w-4xl mx-auto bg-neutral-900 rounded-xl border border-neutral-700 shadow-2xl overflow-hidden">
			{/* Header */}
			<div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
				<h3 className="text-white font-semibold text-lg">Try Trio Chat Demo</h3>
				<p className="text-purple-100 text-sm">
					Ask anything and watch GPT and Claude respond!
				</p>
			</div>

			{/* Messages */}
			<div className="h-80 overflow-y-auto p-6 bg-neutral-900">
				{messages.length === 0 && (
					<div className="flex items-center justify-center h-full text-neutral-500">
						<div className="text-center">
							<div className="text-4xl mb-4">💬</div>
							<p className="text-lg font-medium mb-2">Start a conversation</p>
							<p className="text-sm">
								Type a message below to see how GPT and Claude would respond
							</p>
						</div>
					</div>
				)}

				{messages.map((message) => (
					<MessageBubble key={message.id} message={message} />
				))}

				{isLoading && (
					<div className="flex justify-start mb-4">
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-700 flex items-center justify-center">
								<Loader2 className="w-4 h-4 animate-spin text-white" />
							</div>
							<div className="px-4 py-3 rounded-2xl bg-neutral-800 text-gray-200 shadow-lg">
								<p className="text-sm">Agents are thinking...</p>
							</div>
						</div>
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>

			{/* Input */}
			<div className="border-t border-neutral-700 p-4 bg-neutral-800">
				<form onSubmit={handleSubmit} className="flex gap-3">
					<input
						type="text"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						placeholder="Ask something interesting..."
						className="flex-1 px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
						disabled={isLoading}
					/>
					<Button
						type="submit"
						disabled={!inputValue.trim() || isLoading}
						className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<Send className="w-4 h-4" />
						)}
					</Button>
				</form>
			</div>
		</div>
	);
}
