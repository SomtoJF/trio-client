"use client";

import React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSubItem,
	SidebarMenuSub,
} from "@/components/ui/sidebar";
import {
	BrainCog,
	ChevronsUpDownIcon,
	Home,
	SquarePlus,
	Link as LinkIcon,
	Cpu,
	MessageSquareQuote,
} from "lucide-react";
import Link from "next/link";
import { NavDropdown } from "@/components/custom";
import { useAuthStore } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/query-key-factory";
import { getBasicChats, getReflectionChats } from "@/services";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ProtectedSidebar() {
	const { user } = useAuthStore((state) => state);
	const pathname = usePathname();

	const { data: reflectionChats } = useQuery({
		queryKey: queryKeys.chat.getReflectionChats(),
		queryFn: () => getReflectionChats(),
		enabled: !!user,
	});

	const { data: basicChats } = useQuery({
		queryKey: queryKeys.chat.getBasicChats(),
		queryFn: () => getBasicChats(),
		enabled: !!user,
	});

	const applicationItems = [
		{
			title: "Home",
			url: "/",
			icon: Home,
		},
	];

	const chatItems = [
		{
			title: "New Chat",
			url: "/chat/new",
			icon: SquarePlus,
		},
	];

	return (
		<Sidebar className="border-r border-neutral-800">
			<SidebarHeader className="bg-neutral-900 text-white">
				<Link href={"/"}>
					<div className="grid grid-cols-[40px,1fr,15px] grid-rows-[20px,20px] gap-x-2 cursor-pointer hover:bg-neutral-800 rounded-lg px-3 py-2">
						<div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 font-bold text-sm flex justify-center items-center row-span-2">
							<BrainCog />
						</div>
						<p className="font-semibold text-xs whitespace-nowrap overflow-ellipsis">
							Trio
						</p>
						<div className="row-span-2 col-start-3 col-end-4 self-center">
							<LinkIcon className="w-4 h-4" />
						</div>
						<p className="text-xs font-light">&copy; 2025</p>
					</div>
				</Link>
			</SidebarHeader>
			<SidebarContent className="bg-neutral-900 text-white">
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{applicationItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{chatItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Chats</SidebarGroupLabel>
					<SidebarMenu>
						<Collapsible defaultOpen className="group/collapsible">
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton>
										<Cpu />
										<span>Reflection Chats</span>
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{reflectionChats?.map((item) => (
											<SidebarMenuSubItem key={item.id}>
												<SidebarMenuButton asChild>
													<a
														href={`/chat/reflection/${item.id}`}
														className={cn(
															"whitespace-nowrap overflow-ellipsis",
															pathname === `/chat/reflection/${item.id}` &&
																"bg-neutral-800"
														)}
													>
														<span>{item.chatName}</span>
													</a>
												</SidebarMenuButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					</SidebarMenu>
					<SidebarMenu>
						<Collapsible defaultOpen className="group/collapsible">
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton>
										<MessageSquareQuote />
										<span>Basic Chats</span>
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{basicChats?.map((item) => (
											<SidebarMenuSubItem key={item.id}>
												<SidebarMenuButton asChild>
													<a
														href={`/chat/basic/${item.id}`}
														className={cn(
															"whitespace-nowrap overflow-ellipsis",
															pathname === `/chat/basic/${item.id}` &&
																"bg-neutral-800"
														)}
													>
														<span>{item.chatName}</span>
													</a>
												</SidebarMenuButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="bg-neutral-900 text-white">
				{user && (
					<NavDropdown side="right">
						<div className="grid grid-cols-[40px,1fr,15px] grid-rows-[20px,20px] gap-x-2 gap-y-1 cursor-pointer hover:bg-neutral-800 rounded-lg px-3 py-2">
							<div className="w-10 h-10 rounded-lg bg-purple-100 text-neutral-800 font-bold text-sm flex justify-center items-center row-span-2">
								{user.fullName.split(" ").map((name) => name.charAt(0))}
							</div>
							<p className="font-semibold text-xs whitespace-nowrap overflow-ellipsis">
								{user.fullName}
							</p>
							<div className="row-span-2 col-start-3 col-end-4 self-center">
								<ChevronsUpDownIcon className="w-4 h-4" />
							</div>
							<p className="text-xs">{user.userName}</p>
						</div>
					</NavDropdown>
				)}
			</SidebarFooter>
		</Sidebar>
	);
}
