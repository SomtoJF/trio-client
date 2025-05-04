import {
	Reflection,
	ReflectionMessage as ReflectionMessageType,
} from "@/types/types";
import { SparklesCore } from "@/components/ui/sparkles";
import React, { useEffect, useState } from "react";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { cn } from "@/lib/utils";
import { BrainCog, ChevronsRight, FlipHorizontal2 } from "lucide-react";

export default function ReflectionMessage({
	reflection,
	userName,
	setSelectedReflection,
	setOpenReflectionSequence,
}: {
	reflection: Reflection;
	userName: string;
	setSelectedReflection: (reflection: Reflection) => void;
	setOpenReflectionSequence: (open: boolean) => void;
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
		} else {
			setFeaturedMessage(reflectorMessages[0]);
		}
	}, [optimalMessage]);

	return (
		<div className="w-full h-fit flex flex-col text-sm items-center gap-8">
			{userMessage && (
				<div className="self-end px-3 py-2 bg-purple-100 text-black rounded-xl max-w-[70%]">
					{userMessage.content}
				</div>
			)}
			{featuredMessage && (
				<div className="self-start grid grid-cols-[25px,1fr] grid-rows-1 gap-3 text-base font-extralight">
					<BrainCog className="text-purple-800 border border-gray-700 bg-purple-100 rounded-full p-1" />
					<p>
						<Markdown
							components={{
								code(props) {
									const { children, className, ...rest } = props;
									const match = /language-(\w+)/.exec(className || "");

									return match ? (
										<SyntaxHighlighter
											style={vscDarkPlus}
											wrapLongLines
											language={match[1]}
											PreTag="div"
										>
											{String(children).replace(/\n$/, "")}
										</SyntaxHighlighter>
									) : (
										<code
											{...rest}
											className={cn(
												className,
												"w-full overflow-x-auto bg-neutral-900 rounded-lg p-2"
											)}
										>
											{children}
										</code>
									);
								},
							}}
							rehypePlugins={[rehypeRaw]}
							remarkPlugins={[remarkGfm]}
						>
							{featuredMessage.content}
						</Markdown>
					</p>
				</div>
			)}
			<div className="relative w-full">
				<div
					className="flex gap-2 justify-start w-full px-[25px] overflow-x-auto overflow-y-hidden 
					[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
				>
					{reflectorMessages.map((message, index) => (
						<div
							className={cn(
								"px-5 py-2 bg-neutral-900 rounded-xl flex flex-col gap-2 cursor-pointer hover:bg-neutral-800 transition-colors relative border border-gray-800",
								message.id === featuredMessage?.id && "bg-neutral-800"
							)}
							onClick={() => setFeaturedMessage(message)}
							key={message.id}
						>
							{message.isOptimal && (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="absolute inset-0">
												<SparklesCore
													id={`sparkles-${message.id}`}
													background="transparent"
													minSize={0.6}
													maxSize={1.4}
													particleDensity={100}
													className="w-full h-full"
													particleColor="#FFFFFF"
												/>
											</div>
										</TooltipTrigger>
										<TooltipContent className="text-xs" side="left">
											This is the optimal answer
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
							<p className="self-start text-xs text-white line-clamp-4 overflow-hidden text-ellipsis w-[200px] ">
								<span className="bg-purple-700 cursor-pointer text-white rounded-[1px] text-xs px-1 mr-2 inline">
									{index + 1}
								</span>
								{message.content}
							</p>
							<p className="text-xs text-neutral-400 flex items-center gap-1">
								<FlipHorizontal2 className="w-4 h-4 mr-1" />
								{message.senderName}
							</p>
						</div>
					))}
				</div>
			</div>
			<p
				className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer h-fit self-end px-3 py-2 text-nowrap flex"
				onClick={() => {
					setSelectedReflection(reflection);
					setOpenReflectionSequence(true);
				}}
			>
				View generation sequence <ChevronsRight className="w-4 h-4 ml-1" />
			</p>
		</div>
	);
}
