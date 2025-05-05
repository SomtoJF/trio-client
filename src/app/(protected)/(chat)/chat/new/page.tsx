"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { IoAddOutline } from "react-icons/io5";
import { useFieldArray } from "react-hook-form";
import { AiOutlineLoading, AiOutlineMinus } from "react-icons/ai";
import { Select } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBasicChat, createReflectionChat } from "@/services";
import { queryKeys } from "@/query-key-factory";
import { useToast } from "@/hooks";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

const agentSchema = z.object({
	agentName: z
		.string()
		.min(2, { message: "Agent name must be at least 2 characters." })
		.max(50, {
			message: "Agent name must be less than 50 characters.",
		}),
	agentTraits: z.array(z.string().min(2).max(20)),
});

const formSchema = z.object({
	chatName: z
		.string()
		.min(2, {
			message: "Chat name must be at least 2 characters.",
		})
		.max(100, {
			message: "Chat name must be less than 100 characters.",
		}),
	agents: z.array(agentSchema),
});

const reflectionFormSchema = z.object({
	chatName: z
		.string()
		.min(2, {
			message: "Chat name must be at least 2 characters.",
		})
		.max(100, {
			message: "Chat name must be less than 100 characters.",
		}),
});

const traits: Array<{ label: string; value: string }> = [
	{
		label: "Funny",
		value: "funny",
	},
	{
		label: "Supportive",
		value: "supportive",
	},
	{
		label: "Curious",
		value: "curious",
	},
	{
		label: "Sarcastic",
		value: "sarcastic",
	},
	{
		label: "Optimistic",
		value: "optimistic",
	},
	{
		label: "Empathetic",
		value: "empathetic",
	},
	{
		label: "Analytical",
		value: "analytical",
	},
	{
		label: "Impulsive",
		value: "impulsive",
	},
	{
		label: "Playful",
		value: "playful",
	},
	{
		label: "Cynical",
		value: "cynical",
	},
	{
		label: "Inquisitive",
		value: "inquisitive",
	},
	{
		label: "Friendly",
		value: "friendly",
	},
	{
		label: "Pragmatic",
		value: "pragmatic",
	},
	{
		label: "Spontaneous",
		value: "spontaneous",
	},
	{
		label: "Pessimistic",
		value: "pessimistic",
	},
	{
		label: "Cheerful",
		value: "cheerful",
	},
	{
		label: "Thoughtful",
		value: "thoughtful",
	},
	{
		label: "Skeptical",
		value: "skeptical",
	},
	{
		label: "Creative",
		value: "creative",
	},
	{
		label: "Blunt",
		value: "blunt",
	},
	{ label: "Annoying", value: "annoying" },
];

const sortedTraits = traits.sort((a, b) => a.label.localeCompare(b.label));

export default function Page() {
	const [agentCount, setAgentCount] = useState(1);
	const queryClient = useQueryClient();
	const toast = useToast();
	const { push } = useRouter();
	const basicChatForm = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			chatName: "",
			agents: [{ agentName: "", agentTraits: [] }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: basicChatForm.control,
		name: "agents",
	});

	const reflectionChatForm = useForm<z.infer<typeof reflectionFormSchema>>({
		resolver: zodResolver(reflectionFormSchema),
		defaultValues: {
			chatName: "",
		},
	});

	const createBasicChatMutation = useMutation({
		mutationFn: (data: z.infer<typeof formSchema>) => createBasicChat(data),
		onSuccess: (response) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.chat.getBasicChats(),
			});
			toast.success("Chat created");
			setTimeout(() => {
				push(`/chat/basic/${response.data.id}`);
			}, 2000);
		},
		onError: (error) => {
			toast.error("We couldn't create the chat");
			throw error;
		},
	});

	const createReflectionChatMutation = useMutation({
		mutationFn: (data: z.infer<typeof reflectionFormSchema>) =>
			createReflectionChat(data),
		onSuccess: (response) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.chat.getReflectionChats(),
			});
			toast.success("Chat created");
			setTimeout(() => {
				push(`/chat/reflection/${response.data.id}`);
			}, 2000);
		},
		onError: (error) => {
			toast.error("We couldn't create the chat");
			throw error;
		},
	});

	function onSubmitBasicChat(values: z.infer<typeof formSchema>) {
		if (!values.agents || values.agents.length < 1) {
			toast.error("You must add at least one agent to the chat");
			return;
		} else if (values.agents.length > 2) {
			toast.error("Cannot have more than two agents in a chat");
			return;
		}
		createBasicChatMutation.mutate(values);
	}

	function onSubmitReflectionChat(
		values: z.infer<typeof reflectionFormSchema>
	) {
		createReflectionChatMutation.mutate(values);
	}

	return (
		<div className="bg-white text-black p-4 rounded-sm w-11/12 max-w-screen-sm h-[500px]">
			<Tabs defaultValue="basic" className="w-full">
				<TabsList className="w-full bg-inherit">
					<TabsTrigger
						value="basic"
						className="w-full data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-black rounded-none"
					>
						Create a Basic Chat{" "}
					</TabsTrigger>
					<TabsTrigger
						value="reflection"
						className="w-full data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-black rounded-none"
					>
						Create a Reflection Chat{" "}
					</TabsTrigger>
				</TabsList>
				<TabsContent value="basic">
					<Form {...basicChatForm}>
						<form
							onSubmit={basicChatForm.handleSubmit(onSubmitBasicChat)}
							className="w-full h-[400px] space-y-5 overflow-y-scroll p-1"
						>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger className="w-full">
										<p className="text-xs cursor-pointer w-full p-2 text-center rounded-lg bg-fuchsia-100 text-fuchsia-800 flex items-center justify-center">
											<Info className="mr-2 w-4 h-4" /> What is a basic chat?
										</p>
									</TooltipTrigger>
									<TooltipContent side="bottom">
										<p className="text-xs max-w-[200px] text-wrap text-gray-500">
											Basic chats are conversations between two or more agents.
											Agents can be of the same or different species.
											<b className="block">
												Best used for group chat experiences.
											</b>
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<FormField
								control={basicChatForm.control}
								name="chatName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Chat Name<span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input placeholder="i.e 'The Office'" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="text-gray-400 text-xs font-extrabold uppercase">
								Members (Agents)
							</div>
							{agentCount < 1 && (
								<FormDescription>
									There are no agents in this chat
								</FormDescription>
							)}
							{fields.map((field, index) => (
								<div key={field.id} className="space-y-4">
									<FormField
										control={basicChatForm.control}
										name={`agents.${index}.agentName`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Name<span className="text-red-500">*</span>
												</FormLabel>
												<FormControl>
													<Input placeholder="i.e 'Claudia'" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={basicChatForm.control}
										name={`agents.${index}.agentTraits`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Traits<span className="text-red-500">*</span>
												</FormLabel>
												<FormControl>
													<Select
														mode="multiple"
														placeholder="Select one or more traits"
														defaultValue={[]}
														className="h-9 w-full"
														{...field}
														options={sortedTraits} // Use sorted traits here
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button
										type="button"
										variant={"outline"}
										className="text-xs"
										onClick={() => {
											remove(index);
											setAgentCount(agentCount - 1);
										}}
									>
										<AiOutlineMinus className="mr-2" />
										Remove Agent
									</Button>
								</div>
							))}
							<Button
								type="button"
								variant="outline"
								className="mr-4 text-xs"
								onClick={() => {
									if (agentCount >= 2)
										toast.warning("Cannot have more than two agents in a chat");
									append({ agentName: "", agentTraits: [] });
									setAgentCount(agentCount + 1);
								}} // Append a new agent
							>
								<IoAddOutline className="mr-2" />
								Add Agent
							</Button>
							<Button
								type="submit"
								className="text-xs font-semibold w-full"
								disabled={createBasicChatMutation.isPending}
							>
								{createBasicChatMutation.isPending ? (
									<AiOutlineLoading className="animate-spin" />
								) : (
									"Create Basic Chat"
								)}
							</Button>
						</form>
					</Form>
				</TabsContent>
				<TabsContent value="reflection">
					<Form {...reflectionChatForm}>
						<form
							onSubmit={reflectionChatForm.handleSubmit(onSubmitReflectionChat)}
							className="w-full h-[400px] flex flex-col p-1"
						>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger className="w-full">
										<p className="text-xs cursor-pointer w-full p-2 text-center rounded-lg bg-fuchsia-100 text-fuchsia-800 flex items-center justify-center">
											<Info className="mr-2 w-4 h-4" /> What is a reflection
											chat?
										</p>
									</TooltipTrigger>
									<TooltipContent side="bottom">
										<p className="text-xs max-w-[200px] text-wrap text-gray-500">
											Reflection chats are conversations between a human and a
											single agent. The agent provides a response to a prompt,
											evaluates its response and iteratively improves on it
											(evaluation based reflection).
											<b className="block">
												Best used to provide more accurate responses to one-shot
												prompts/requests/questions.
											</b>
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<div className="flex-1 space-y-5 overflow-y-auto">
								<FormField
									control={reflectionChatForm.control}
									name="chatName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Chat Name<span className="text-red-500">*</span>
											</FormLabel>
											<FormControl>
												<Input placeholder="i.e 'The Office'" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<Button
								type="submit"
								className="text-xs font-semibold w-full mt-4"
								disabled={createReflectionChatMutation.isPending}
							>
								{createReflectionChatMutation.isPending ? (
									<AiOutlineLoading className="animate-spin" />
								) : (
									"Create Reflection Chat"
								)}
							</Button>
						</form>
					</Form>
				</TabsContent>
			</Tabs>
		</div>
	);
}
