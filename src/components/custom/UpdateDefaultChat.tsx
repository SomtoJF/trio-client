// "use client";

// import { useToast } from "@/hooks";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { ReactNode, useState } from "react";
// import { BasicChat } from "@/types";
// import { z } from "zod";
// import { useFieldArray, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { deleteBasicChat, updateBasicChat } from "@/services";
// import {
// 	Form,
// 	FormControl,
// 	FormDescription,
// 	FormField,
// 	FormItem,
// 	FormLabel,
// 	FormMessage,
// } from "@/components/ui/form";
// import { IoAddOutline } from "react-icons/io5";
// import { Select } from "antd";
// import {
// 	Dialog,
// 	DialogContent,
// 	DialogDescription,
// 	DialogHeader,
// 	DialogTitle,
// 	DialogTrigger,
// } from "@/components/ui/dialog";
// import { queryKeys } from "@/query-key-factory";
// import { AiOutlineLoading, AiOutlineMinus } from "react-icons/ai";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useRouter } from "next/navigation";

// const traits: Array<{ label: string; value: string }> = [
// 	{
// 		label: "Funny",
// 		value: "funny",
// 	},
// 	{
// 		label: "Supportive",
// 		value: "supportive",
// 	},
// 	{
// 		label: "Curious",
// 		value: "curious",
// 	},
// 	{
// 		label: "Sarcastic",
// 		value: "sarcastic",
// 	},
// 	{
// 		label: "Optimistic",
// 		value: "optimistic",
// 	},
// 	{
// 		label: "Empathetic",
// 		value: "empathetic",
// 	},
// 	{
// 		label: "Analytical",
// 		value: "analytical",
// 	},
// 	{
// 		label: "Impulsive",
// 		value: "impulsive",
// 	},
// 	{
// 		label: "Playful",
// 		value: "playful",
// 	},
// 	{
// 		label: "Cynical",
// 		value: "cynical",
// 	},
// 	{
// 		label: "Inquisitive",
// 		value: "inquisitive",
// 	},
// 	{
// 		label: "Friendly",
// 		value: "friendly",
// 	},
// 	{
// 		label: "Pragmatic",
// 		value: "pragmatic",
// 	},
// 	{
// 		label: "Spontaneous",
// 		value: "spontaneous",
// 	},
// 	{
// 		label: "Pessimistic",
// 		value: "pessimistic",
// 	},
// 	{
// 		label: "Cheerful",
// 		value: "cheerful",
// 	},
// 	{
// 		label: "Thoughtful",
// 		value: "thoughtful",
// 	},
// 	{
// 		label: "Skeptical",
// 		value: "skeptical",
// 	},
// 	{
// 		label: "Creative",
// 		value: "creative",
// 	},
// 	{
// 		label: "Blunt",
// 		value: "blunt",
// 	},
// 	{ label: "Annoying", value: "annoying" },
// ];

// const sortedTraits = traits.sort((a, b) => a.label.localeCompare(b.label));

// export function UpdateDefaultChat({
// 	trigger,
// 	chat,
// }: {
// 	trigger: ReactNode;
// 	chat: BasicChat;
// }) {
// 	const defaultAgentSchema = z.object({
// 		agentName: z.string().min(2).max(20),
// 		agentTraits: z.array(z.string().min(2).max(20)),
// 	});

// 	const defaultFormSchema = z.object({
// 		chatName: z
// 			.string()
// 			.min(2, {
// 				message: "Chat name must be at least 2 characters.",
// 			})
// 			.max(20),
// 		chatAgents: z.array(defaultAgentSchema),
// 	});

// 	const { push } = useRouter();
// 	const [agentCount, setAgentCount] = useState(chat.chatAgents.length);
// 	const queryClient = useQueryClient();
// 	const toast = useToast();
// 	const form = useForm<z.infer<typeof defaultFormSchema>>({
// 		resolver: zodResolver(defaultFormSchema),
// 		defaultValues: {
// 			chatName: chat.chatName,
// 			chatAgents: chat.chatAgents.map((agent) => {
// 				const { agentName: name, agentTraits: traits } = agent;
// 				return {
// 					name,
// 					traits,
// 				};
// 			}),
// 		},
// 	});

// 	const { fields, append, remove } = useFieldArray({
// 		control: form.control,
// 		name: "agents",
// 	});

// 	const deleteChatMutation = useMutation({
// 		mutationFn: (chatID: string) => deleteBasicChat(chatID),
// 		onSuccess: () => {
// 			toast.success("Chat deleted");
// 			queryClient.invalidateQueries({
// 				queryKey: queryKeys.chat.all,
// 			});
// 			setTimeout(() => {
// 				push("/chat/new");
// 			}, 2000);
// 		},
// 		onError: (error) => {
// 			toast.error(error.message);
// 			throw error;
// 		},
// 	});

// 	const updateChatMutation = useMutation({
// 		mutationFn: (data: z.infer<typeof defaultFormSchema>) =>
// 			updateBasicChat(chat.id, data),
// 		onSuccess: () => {
// 			queryClient.invalidateQueries({
// 				queryKey: queryKeys.chat.getOneBasicChat(chat.id),
// 			});
// 			toast.success("Chat updated");
// 		},
// 		onError: (error) => {
// 			toast.error(error.message);
// 			throw error;
// 		},
// 	});

// 	const onSubmit = (values: z.infer<typeof defaultFormSchema>) => {
// 		console.log(values);
// 		if (values.agents.length > 2) {
// 			toast.error("Cannot have more than two agents in a chat");
// 			return;
// 		}
// 		updateChatMutation.mutate(values);
// 	};

// 	return (
// 		<Dialog>
// 			<DialogTrigger asChild>{trigger}</DialogTrigger>
// 			<DialogContent className=" bg-white w-11/12 max-w-screen-sm  text-black ">
// 				<DialogHeader>
// 					<DialogTitle>Edit Chat</DialogTitle>
// 					<DialogDescription>
// 						Make changes to this chat here. Click save when you're done.
// 					</DialogDescription>
// 				</DialogHeader>
// 				<Form {...form}>
// 					<form
// 						onSubmit={form.handleSubmit(onSubmit)}
// 						className="bg-white text-black p-4 rounded-sm w-full max-w-screen-sm max-h-[50vh] relative z-50"
// 					>
// 						<div className="w-full h-full space-y-5 overflow-y-scroll p-1">
// 							<FormField
// 								control={form.control}
// 								name="chatName"
// 								render={({ field }) => (
// 									<FormItem>
// 										<FormLabel>
// 											Chat Name<span className="text-red-500">*</span>
// 										</FormLabel>
// 										<FormControl>
// 											<Input placeholder="Enter chat name" {...field} />
// 										</FormControl>
// 										<FormDescription>
// 											This is the name of your chat.
// 										</FormDescription>
// 										<FormMessage />
// 									</FormItem>
// 								)}
// 							/>
// 							<div className="text-gray-400 text-xs font-extrabold uppercase">
// 								Members (Agents)
// 							</div>
// 							{agentCount < 1 && (
// 								<FormDescription>
// 									There are no agents in this chat
// 								</FormDescription>
// 							)}
// 							{fields.map((field, index) => (
// 								<div key={field.id} className="space-y-4">
// 									<FormField
// 										control={form.control}
// 										name={`agents.${index}.name`}
// 										render={({ field }) => (
// 											<FormItem>
// 												<FormLabel>
// 													Name<span className="text-red-500">*</span>
// 												</FormLabel>
// 												<FormControl>
// 													<Input placeholder="Claudia" {...field} />
// 												</FormControl>
// 												<FormMessage />
// 											</FormItem>
// 										)}
// 									/>
// 									<>
// 										<FormField
// 											control={form.control}
// 											name={`agents.${index}.metadata.lingo`}
// 											render={({ field }) => (
// 												<FormItem>
// 													<FormLabel>
// 														Lingo<span className="text-red-500">*</span>
// 													</FormLabel>
// 													<FormControl>
// 														<Input placeholder="Patois" {...field} />
// 													</FormControl>
// 													<FormDescription>
// 														Lingo determines slangs and in general, the language
// 														with which the agent responds. e.g Pidgin, English.
// 													</FormDescription>
// 													<FormMessage />
// 												</FormItem>
// 											)}
// 										/>
// 										<FormField
// 											control={form.control}
// 											name={`agents.${index}.metadata.traits`}
// 											render={({ field }) => (
// 												<FormItem>
// 													<FormLabel>
// 														Traits<span className="text-red-500">*</span>
// 													</FormLabel>
// 													<FormControl>
// 														<Select
// 															mode="multiple"
// 															placeholder="Select one or more traits"
// 															className="h-9 w-full z-50 relative"
// 															{...field}
// 															options={[sortedTraits]}
// 														/>
// 													</FormControl>
// 													<FormMessage />
// 												</FormItem>
// 											)}
// 										/>
// 									</>

// 									<Button
// 										type="button"
// 										variant={"outline"}
// 										className="text-xs"
// 										onClick={() => {
// 											remove(index);
// 											setAgentCount(agentCount - 1);
// 										}}
// 									>
// 										<AiOutlineMinus className="mr-2" />
// 										Remove Agent
// 									</Button>
// 								</div>
// 							))}
// 							<Button
// 								type="button"
// 								variant="outline"
// 								className="mr-4 text-xs"
// 								onClick={() => {
// 									if (agentCount >= 2)
// 										toast.warning("Cannot have more than two agents in a chat");
// 									append({ name: "", metadata: { lingo: "", traits: [] } });
// 									setAgentCount(agentCount + 1);
// 								}}
// 							>
// 								<IoAddOutline className="mr-2" />
// 								Add Agent
// 							</Button>
// 							<div className="w-full flex gap-2 flex-1">
// 								<Button
// 									type="submit"
// 									className="text-xs font-semibold w-full"
// 									disabled={updateChatMutation.isPending}
// 								>
// 									{updateChatMutation.isPending ? (
// 										<AiOutlineLoading className="animate-spin" />
// 									) : (
// 										"Save"
// 									)}
// 								</Button>
// 								<Button
// 									className="text-xs font-semibold bg-white text-red-500 w-full hover:bg-red-500 hover:text-white"
// 									disabled={deleteChatMutation.isPending}
// 									onClick={() => deleteChatMutation.mutate(chat.id)}
// 								>
// 									{deleteChatMutation.isPending ? (
// 										<AiOutlineLoading className="animate-spin" />
// 									) : (
// 										"Delete Chat"
// 									)}
// 								</Button>
// 							</div>
// 						</div>
// 					</form>
// 				</Form>
// 			</DialogContent>
// 		</Dialog>
// 	);
// }

function UpdateDefaultChat() {
	return <div>UpdateDefaultChat</div>;
}

export default UpdateDefaultChat;
