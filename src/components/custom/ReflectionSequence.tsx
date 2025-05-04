import { Reflection } from "@/types/types";
import React from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Divider } from "antd";
import { IterationCcw, TextQuote } from "lucide-react";

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
	const reflectorMessages = reflection?.messages.filter(
		(message) => message.senderName !== userName
	);

	if (!reflection) return null;
	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetContent
				side="right"
				className="bg-neutral-900 text-white border-none"
			>
				<SheetHeader>
					<SheetTitle className="flex items-center gap-2 text-white">
						<IterationCcw className="w-6 h-6" />
						{reflectorMessages?.length} iterations
					</SheetTitle>
					<SheetDescription className="text-neutral-400">
						View the sequence of iterations and the reasoning that led to the
						optimal answer.
					</SheetDescription>
					<Divider className="bg-neutral-800" />
				</SheetHeader>
				<div className="space-y-4 h-[calc(100vh-100px)] overflow-y-auto pt-6 pb-10 font-light">
					<div className="flex flex-col gap-4 ">
						{reflectorMessages?.map((message, index) => (
							<div
								key={message.id}
								className="rounded-lg bg-neutral-800 p-2 space-y-2 hover:bg-neutral-700 transition-colors cursor-pointer"
								onClick={() => {}}
							>
								<p
									className="line-clamp-4 overflow-hidden text-ellipsis"
									title={message.content}
								>
									<span className="bg-purple-700 cursor-pointer text-white rounded-[1px] text-xs px-1 mr-2">
										{index + 1}
									</span>
									{message.content}
								</p>
								<p className="text-sm">
									<h3 className="font-semibold flex items-center gap-2 mb-2">
										<TextQuote className="w-5 h-5" /> Evaluator's Notes:
									</h3>{" "}
									{reflection.evaluatorMessages[index]?.content}
								</p>
							</div>
						))}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
