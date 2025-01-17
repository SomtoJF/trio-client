// "use client";

// import { DefaultChatDisplay, ReflectionChatDisplay } from "@/components/custom";
// import { queryKeys } from "@/query-key-factory";
// import { getOneChat } from "@/services";
// import { useQuery } from "@tanstack/react-query";
// import { useParams } from "next/navigation";
// import React from "react";
// import { AiOutlineLoading } from "react-icons/ai";
// import { ChatType } from "@/types";

// export default function Page() {
// 	const params = useParams();
// 	const chatId = params.id;

// 	const { data: chat, isPending } = useQuery({
// 		queryKey: queryKeys.chat.getOne(chatId as string),
// 		queryFn: () => {
// 			return getOneChat(chatId as string);
// 		},
// 		enabled: !!chatId,
// 	});

// 	return (
// 		<>
// 			<div className=" w-full h-full max-w-screen-md px-8 lg:px-0 flex flex-col justify-between items-center pb-16 sm:pb-5 gap-2">
// 				{isPending && (
// 					<div className="w-full h-full flex justify-center items-center">
// 						<AiOutlineLoading className="animate-spin" />
// 					</div>
// 				)}
// 				{!isPending && chat && (
// 					<>
// 						{chat.type === ChatType.DEFAULT && (
// 							<DefaultChatDisplay chat={chat} />
// 						)}
// 						{chat.type === ChatType.REFLECTION && (
// 							<ReflectionChatDisplay chat={chat} />
// 						)}
// 					</>
// 				)}
// 			</div>
// 			<p className="text-center w-full text-xs text-neutral-400">
// 				People sometimes make mistakes, AI does too.
// 			</p>
// 		</>
// 	);
// }
