import { Reflection } from "@/types/types";
import React, { useState } from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Divider } from "antd";
import {
	IterationCcw,
	TextQuote,
	MessageCircle,
	Award,
	ExternalLink,
	Maximize2,
	Minimize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export default function ReflectionSequence({
	reflection,
	open,
	setOpen,
	userName,
}: {
	reflection: Reflection | null;
	open: boolean;
	setOpen: (open: boolean) => void;
	userName: string;
}) {
	const [expandedValues, setExpandedValues] = useState<string[]>([]);
	const [selectedMessage, setSelectedMessage] = useState<{
		content: string;
		evaluatorNotes: string;
		title: string;
	} | null>(null);
	const reflectorMessages = reflection?.messages.filter(
		(message) => message.senderName !== userName
	);

	// Find the index of the optimal message
	const optimalIndex = reflectorMessages?.findIndex(
		(message) => message.isOptimal
	);

	const handleValueChange = (value: string[]) => {
		setExpandedValues(value);
	};

	const handleViewFullMessage = (message: any, evaluatorMessage: any) => {
		setSelectedMessage({
			content: message.content,
			evaluatorNotes: evaluatorMessage?.content || "",
			title: message.title || "",
		});
	};

	if (!reflection) return null;
	return (
		<>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetContent
					side="right"
					className="bg-neutral-900 text-white border-none p-0 overflow-hidden"
				>
					<div className="flex flex-col h-full">
						<SheetHeader className="p-6 pb-0">
							<SheetTitle className="flex items-center gap-2 text-white">
								<IterationCcw className="w-6 h-6" />
								Reflection Journey ({reflectorMessages?.length} iterations)
							</SheetTitle>
							<SheetDescription className="text-neutral-400">
								Follow the reasoning process that led to the optimal solution
							</SheetDescription>
							<Divider className="bg-neutral-800 mt-4" />
						</SheetHeader>

						{/* Timeline indicator on the left */}
						<div className="flex grow overflow-hidden">
							{/* <div className="w-12 flex-shrink-0 bg-neutral-800 flex flex-col items-center pt-8">
								{reflectorMessages?.map((_, index) => (
									<React.Fragment key={`timeline-${index}`}>
										<div
											className={cn(
												"w-4 h-4 rounded-full flex items-center justify-center z-10",
												optimalIndex === index
													? "bg-green-500 border-2 border-green-300"
													: "bg-purple-700"
											)}
										>
											{optimalIndex === index && (
												<Award className="w-2 h-2 text-white" />
											)}
										</div>
										{index < reflectorMessages.length - 1 && (
											<div className="w-0.5 h-16 bg-neutral-700" />
										)}
									</React.Fragment>
								))}
							</div> */}

							{/* Message content */}
							<div className="flex-grow overflow-y-auto py-6 px-4">
								<Accordion
									type="multiple"
									value={expandedValues}
									onValueChange={handleValueChange}
									className="space-y-6"
								>
									{reflectorMessages?.map((message, index) => {
										const isOptimal = message.isOptimal;
										const evaluatorMessage =
											reflection.evaluatorMessages[index];

										return (
											<AccordionItem
												key={message.id}
												value={message.id}
												className={cn(
													"rounded-lg bg-neutral-800 overflow-hidden border-none",
													isOptimal && "ring-2 ring-green-500"
												)}
											>
												{/* Message header with iteration number */}
												<AccordionTrigger className="flex items-center justify-between bg-neutral-700 px-4 py-2 [&[data-state=open]>svg]:rotate-180 hover:no-underline">
													<div className="flex flex-col items-start gap-1">
														<div className="flex items-center gap-2">
															<div
																className={cn(
																	"rounded-full px-2 py-0.5 text-white text-xs font-medium",
																	isOptimal ? "bg-green-600" : "bg-purple-700"
																)}
															>
																Iteration {index + 1}
															</div>
															{isOptimal && (
																<span className="bg-green-600 rounded-full px-2 py-0.5 text-white text-xs font-medium flex items-center gap-1">
																	<Award className="w-3 h-3" /> Optimal
																</span>
															)}
														</div>
														{message.title && (
															<div className="text-sm text-neutral-300 text-left max-w-[80%]">
																{message.title}
															</div>
														)}
													</div>
												</AccordionTrigger>

												{/* Message content */}
												<AccordionContent className="px-0 border-neutral-700">
													<div className="p-4">
														<div className="flex items-start gap-3">
															<MessageCircle className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
															<div className="w-full">
																<div className="flex justify-between items-center mb-1">
																	<div className="font-medium text-sm text-purple-300">
																		{message.senderName}
																	</div>
																	{/* <button
																		className="text-xs text-neutral-400 hover:text-white flex items-center gap-2"
																		onClick={() =>
																			handleViewFullMessage(
																				message,
																				evaluatorMessage
																			)
																		}
																	>
																		<Maximize2 className="w-3 h-3" />
																		View Full
																	</button> */}
																</div>
																<p className="text-sm text-neutral-200 line-clamp-3">
																	{message.content}
																</p>
															</div>
														</div>

														{/* Evaluator's notes */}
														<div className="mt-4 pt-4 border-t border-neutral-700">
															<div className="flex items-start gap-3">
																<TextQuote className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
																<div className="w-full">
																	<div className="flex justify-between items-center mb-1">
																		<div className="font-medium text-sm text-blue-300">
																			Evaluator's Notes
																		</div>
																	</div>
																	<p className="text-sm text-neutral-300 line-clamp-2">
																		{evaluatorMessage?.content}
																	</p>
																</div>
															</div>
														</div>
														{evaluatorMessage?.content && (
															<button
																className="text-xs text-neutral-400 hover:text-white flex items-center gap-2 mt-4 ml-auto"
																onClick={() =>
																	handleViewFullMessage(
																		message,
																		evaluatorMessage
																	)
																}
															>
																<Maximize2 className="w-3 h-3" />
																View Full
															</button>
														)}
													</div>
												</AccordionContent>
											</AccordionItem>
										);
									})}
								</Accordion>
							</div>
						</div>
					</div>
				</SheetContent>
			</Sheet>

			{/* Full Message Dialog */}
			<Dialog
				open={!!selectedMessage}
				onOpenChange={() => setSelectedMessage(null)}
			>
				<DialogContent className="bg-neutral-900 text-white border-none max-w-3xl">
					<DialogHeader>
						<DialogTitle className="text-lg font-medium">
							{selectedMessage?.title || "Full Message Details"}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-6">
						{selectedMessage?.content && (
							<div className="space-y-2">
								<h3 className="text-sm font-medium text-purple-300">
									Message Content
								</h3>
								<div className="bg-neutral-800 rounded-lg p-4 text-sm text-neutral-200">
									{selectedMessage.content}
								</div>
							</div>
						)}
						{selectedMessage?.evaluatorNotes && (
							<div className="space-y-2">
								<h3 className="text-sm font-medium text-blue-300">
									Evaluator's Notes
								</h3>
								<div className="bg-neutral-800 rounded-lg p-4 text-sm text-neutral-300">
									{selectedMessage.evaluatorNotes}
								</div>
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
