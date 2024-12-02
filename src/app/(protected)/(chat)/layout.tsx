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
import { currentUserChats } from "@/services";
import { ChatType } from "@/types";
import { BiReflectVertical } from "react-icons/bi";
import { TfiLayoutWidthDefaultAlt } from "react-icons/tfi";

export default function Layout({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);
	const { user } = useAuthStore((state) => state);
	const [links, setLinks] = useState([
		{
			label: "New Chat",
			href: "/chat/new",
			icon: <PiNotePencilBold className=" h-5 w-5 flex-shrink-0" />,
		},
	]);
	const { data: chats } = useQuery({
		queryKey: queryKeys.chat.getMany(),
		queryFn: currentUserChats,
		enabled: !!user,
	});

	useEffect(() => {
		if (chats && chats.length > 0) {
			const chatnames = chats.map((chat) => {
				return {
					label: chat.chatName,
					href: `/chat/${chat.id}`,
					icon:
						chat.type === ChatType.REFLECTION ? (
							<BiReflectVertical className=" h-5 w-5 flex-shrink-0" />
						) : (
							<TfiLayoutWidthDefaultAlt className=" h-5 w-5 flex-shrink-0" />
						),
				};
			});
			setLinks([links[0], ...chatnames]);
		}
	}, [chats]);

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
							{links.map((link, idx) => (
								<SidebarLink key={idx} link={link} />
							))}
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
