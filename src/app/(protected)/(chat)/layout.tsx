"use client";

import { ReactNode, useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { PiNotePencilBold } from "react-icons/pi";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/hooks";
import { NavDropdown } from "@/components/custom";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/query-key-factory";
import { getBasicChats, getReflectionChats } from "@/services";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

interface SidebarLink {
	id: string;
	label: string;
	href: string;
	icon: React.ReactNode;
}

export default function Layout({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);
	const { user } = useAuthStore((state) => state);
	const [reflectionChatLinks, setReflectionChatLinks] = useState<SidebarLink[]>(
		[]
	);
	const [basicChatLinks, setBasicChatLinks] = useState<SidebarLink[]>([]);

	const { data: reflectionChats, isFetching: isFetchingReflectionChats } =
		useQuery({
			queryKey: queryKeys.chat.getReflectionChats(),
			queryFn: () => getReflectionChats(),
			enabled: !!user,
		});

	const { data: basicChats, isFetching: isFetchingBasicChats } = useQuery({
		queryKey: queryKeys.chat.getBasicChats(),
		queryFn: () => getBasicChats(),
		enabled: !!user,
	});

	useEffect(() => {
		if (basicChats && !isFetchingBasicChats) {
			setBasicChatLinks(
				basicChats.map((chat) => ({
					id: chat.id,
					label: chat.chatName,
					href: `/chat/basic/${chat.id}`,
					icon: <></>,
				}))
			);
		}
	}, [basicChats, isFetchingBasicChats]);

	useEffect(() => {
		if (reflectionChats && !isFetchingReflectionChats) {
			setReflectionChatLinks(
				reflectionChats.map((chat) => ({
					id: chat.id,
					label: chat.chatName,
					href: `/chat/reflection/${chat.id}`,
					icon: <></>,
				}))
			);
		}
	}, [reflectionChats, isFetchingReflectionChats]);

	const link = {
		label: "New Chat",
		href: "/chat/new",
		icon: <PiNotePencilBold className=" h-4 w-4 ml-2 flex-shrink-0" />,
	};

	return (
		<div
			className={cn(
				"flex flex-col md:flex-row bg-neutral-900 w-full flex-1 max-w-screen-2xl mx-auto overflow-hidden",
				"h-screen"
			)}
		>
			<Sidebar open={open} setOpen={setOpen}>
				<SidebarBody className="justify-between gap-10 bg-neutral-900 pt-10">
					<div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden gap-4">
						<Link href={"/"} className="font-extrabold text-sm">
							Trio
						</Link>
						<p className="text-gray-400 text-xs font-semibold uppercase mt-8 whitespace-nowrap text-ellipsis">
							My Chats
						</p>
						<div className="flex flex-col gap-2">
							<SidebarLink link={link} className="text-white" />

							<Accordion type="single" collapsible className="w-full">
								<AccordionItem value="item-1" className="border-none">
									<AccordionTrigger className="hover:no-underline text-sm border-none hover:bg-neutral-700 rounded-lg whitespace-nowrap text-ellipsis pl-2">
										Basic Chats
									</AccordionTrigger>
									<AccordionContent className="flex flex-col gap-2 pl-4">
										{basicChatLinks.map((link) => (
											<SidebarLink link={link} key={link.id} />
										))}
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="item-2" className="border-none">
									<AccordionTrigger className="hover:no-underline text-sm border-none hover:bg-neutral-700 rounded-lg whitespace-nowrap text-ellipsis pl-2">
										Reflection Chats
									</AccordionTrigger>
									<AccordionContent className="flex flex-col gap-2 pl-4">
										{reflectionChatLinks.map((link) => (
											<SidebarLink link={link} key={link.id} />
										))}
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</div>
					</div>
					<div>
						{user && (
							<NavDropdown>
								<div className="w-10 h-10 rounded-full bg-neutral-800 text-white text-sm cursor-pointer md:flex hidden justify-center items-center">
									{user.fullName.split(" ").map((name) => name.charAt(0))}
								</div>
							</NavDropdown>
						)}
					</div>
				</SidebarBody>
			</Sidebar>
			<section className="w-full h-full bg-black flex flex-col justify-center items-center rounded-l-3xl pt-5 pb-3">
				{children}
			</section>
		</div>
	);
}
