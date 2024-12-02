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
import { createChat } from "@/services";
import { queryKeys } from "@/query-key-factory";
import { useToast } from "@/hooks";
import { useRouter } from "next/navigation";
import { ChatType } from "@/types";

const agentSchema = z.object({
	name: z.string().min(2).max(20),
	lingo: z.string().min(2).max(20),
	traits: z.array(z.string().min(2).max(20)),
});

const formSchema = z.object({
	chatName: z
		.string()
		.min(2, {
			message: "Chat name must be at least 2 characters.",
		})
		.max(20),
	type: z.nativeEnum(ChatType),
	agents: z.array(agentSchema),
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

// Sort traits alphabetically by label
const sortedTraits = traits.sort((a, b) => a.label.localeCompare(b.label));

const chatTypes = Object.values(ChatType).map((type) => ({
	label: type,
	value: type,
}));

export default function Page() {
	const [agentCount, setAgentCount] = useState(1);
	const queryClient = useQueryClient();
	const toast = useToast();
	const { push } = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			chatName: "",
			type: ChatType.DEFAULT,
			agents: [{ name: "", lingo: "", traits: [] }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "agents",
	});

	const createChatMutation = useMutation({
		mutationFn: (data: z.infer<typeof formSchema>) => createChat(data),
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.chat.all });
			console.log(response);
			toast.success("Chat created");
			setTimeout(() => {
				push(`/chat/${response.data.id}`);
			}, 2000);
		},
		onError: (error) => {
			toast.error("We couldn't create the chat");
			throw error;
		},
	});

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		if (!values.agents || values.agents.length < 1) {
			toast.error("You must add at least one agent to the chat");
			return;
		} else if (values.agents.length > 2) {
			toast.error("Cannot have more than two agents in a chat");
			return;
		}
		createChatMutation.mutate(values);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="bg-white text-black p-4 rounded-sm w-11/12 max-w-screen-sm max-h-[65vh]"
			>
				<div className="w-full h-full space-y-5 overflow-y-scroll p-1">
					{" "}
					<FormField
						control={form.control}
						name="chatName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Chat Name<span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input placeholder="Enter chat name" {...field} />
								</FormControl>
								<FormDescription>
									This is the name of your chat.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Chat Type<span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Select
										placeholder="Select chat type"
										className="h-9 w-full"
										{...field}
										options={chatTypes}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="text-gray-400 text-xs font-extrabold uppercase">
						Members (Agents)
					</div>
					{agentCount < 1 && (
						<FormDescription>There are no agents in this chat</FormDescription>
					)}
					{fields.map((field, index) => (
						<div key={field.id} className="space-y-4">
							<FormField
								control={form.control}
								name={`agents.${index}.name`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Name<span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input placeholder="Claudia" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name={`agents.${index}.lingo`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Lingo<span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input placeholder="Patois" {...field} />
										</FormControl>
										<FormDescription>
											Lingo determines slangs and in general, the language with
											which the agent responds. e.g Pidgin, English.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name={`agents.${index}.traits`}
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
							append({ name: "", lingo: "", traits: [] });
							setAgentCount(agentCount + 1);
						}} // Append a new agent
					>
						<IoAddOutline className="mr-2" />
						Add Agent
					</Button>
					<Button
						type="submit"
						className="text-xs font-semibold"
						disabled={createChatMutation.isPending}
					>
						{createChatMutation.isPending ? (
							<AiOutlineLoading className="animate-spin" />
						) : (
							"Submit"
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
