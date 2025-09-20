"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
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
	SidebarInput,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import {
	BrainCog,
	ChevronsUpDownIcon,
	Home,
	SquarePlus,
	MessageSquareQuote,
	Search,
	Bell,
	Settings,
	ChevronDown,
	Github,
	MessageCircleHeart,
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
import { BasicChat, ReflectionChat } from "@/types";

export default function ProtectedSidebar() {
	const { user } = useAuthStore((state) => state);
	const pathname = usePathname();
	const [searchQuery, setSearchQuery] = useState("");
	const searchInputRef = useRef<HTMLInputElement>(null);

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

	// Filter chats based on search query
	const filteredReflectionChats = useMemo(() => {
		if (!reflectionChats || !searchQuery) return reflectionChats;
		return reflectionChats.filter((chat: ReflectionChat) =>
			chat.chatName.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [reflectionChats, searchQuery]);

	const filteredBasicChats = useMemo(() => {
		if (!basicChats || !searchQuery) return basicChats;
		return basicChats.filter((chat: BasicChat) =>
			chat.chatName.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [basicChats, searchQuery]);

	// Keyboard shortcut for search (Cmd/Ctrl + F)
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key === "f") {
				event.preventDefault();
				searchInputRef.current?.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	const navigationItems = [
		{
			title: "Home",
			url: "/",
			icon: Home,
		},
		{
			title: "Notifications",
			url: "/notifications",
			icon: Bell,
		},
		{
			title: "Chats",
			url: "/chat",
			icon: MessageSquareQuote,
			isActive: pathname.includes("/chat"),
		},
		{
			title: "Settings",
			url: "/settings",
			icon: Settings,
		},
	];

	const otherItems = [
		{
			title: "GitHub",
			url: "https://github.com/somtojf/trio",
			icon: Github,
			external: true,
		},
		{
			title: "Feedback",
			url: "mailto:somtochukwujf@gmail.com",
			icon: MessageCircleHeart,
			external: true,
		},
	];

	return (
		<Sidebar className="border-r border-neutral-800">
			<SidebarHeader className="bg-neutral-900 text-white border-b border-neutral-800">
				<Link href={"/"}>
					<div className="flex items-center gap-3 p-3 hover:bg-neutral-800 rounded-lg transition-colors">
						<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 text-white font-bold text-sm flex justify-center items-center">
							<BrainCog className="w-5 h-5" />
						</div>
						<div className="flex-1">
							<p className="font-semibold text-base">Trio</p>
						</div>
						<div className="w-5 h-5 rounded bg-neutral-700 flex items-center justify-center text-xs font-semibold">
							⌘T
						</div>
					</div>
				</Link>

				{/* Search Bar */}
				<div className="px-3 pb-3">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
						<SidebarInput
							ref={searchInputRef}
							placeholder="Search..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 pr-12 bg-neutral-800 border-neutral-700 text-white placeholder-neutral-400 focus:border-neutral-600"
						/>
						<div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-neutral-500 font-medium">
							⌘ F
						</div>
					</div>
				</div>

				{/* New Chat Button */}
				<div className="px-3 pb-3">
					<SidebarMenuButton asChild className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
						<Link href="/chat/new" className="flex items-center justify-center gap-2 py-2">
							<SquarePlus className="w-4 h-4" />
							<span>New Chat</span>
						</Link>
					</SidebarMenuButton>
				</div>
			</SidebarHeader>
			<SidebarContent className="bg-neutral-900 text-white">
				{/* Main Navigation */}
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{navigationItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										className={cn(
											"hover:bg-neutral-800 transition-colors",
											item.isActive &&
												"bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium"
										)}
									>
										<Link href={item.url}>
											<item.icon className="w-4 h-4" />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Chat Sections */}
				{filteredReflectionChats?.length || filteredBasicChats?.length ? (
					<>
						<SidebarSeparator className="my-2" />

						{/* Reflection Chats */}
						{filteredReflectionChats?.length ? (
							<SidebarGroup>
								<SidebarMenu>
									<Collapsible defaultOpen className="group/collapsible">
										<SidebarMenuItem>
											<CollapsibleTrigger asChild>
												<SidebarMenuButton className="hover:bg-neutral-800 transition-colors group">
													<div className="w-2 h-2 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 mr-1" />
													<span className="text-sm font-medium">
														Reflection Chats
													</span>
													<ChevronDown className="w-4 h-4 ml-auto transition-transform group-data-[state=open]:rotate-180" />
												</SidebarMenuButton>
											</CollapsibleTrigger>
											<CollapsibleContent>
												<SidebarMenuSub>
													{filteredReflectionChats?.map((item) => (
														<SidebarMenuSubItem key={item.id}>
															<SidebarMenuButton asChild>
																<Link
																	href={`/chat/reflection/${item.id}`}
																	className={cn(
																		"text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors rounded-md",
																		pathname ===
																			`/chat/reflection/${item.id}` &&
																			"bg-neutral-800 text-white"
																	)}
																>
																	<span className="truncate">
																		{item.chatName}
																	</span>
																</Link>
															</SidebarMenuButton>
														</SidebarMenuSubItem>
													))}
												</SidebarMenuSub>
											</CollapsibleContent>
										</SidebarMenuItem>
									</Collapsible>
								</SidebarMenu>
							</SidebarGroup>
						) : null}

						{/* Basic Chats */}
						{filteredBasicChats?.length ? (
							<SidebarGroup>
								<SidebarMenu>
									<Collapsible defaultOpen className="group/collapsible">
										<SidebarMenuItem>
											<CollapsibleTrigger asChild>
												<SidebarMenuButton className="hover:bg-neutral-800 transition-colors group">
													<div className="w-2 h-2 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mr-1" />
													<span className="text-sm font-medium">
														Basic Chats
													</span>
													<ChevronDown className="w-4 h-4 ml-auto transition-transform group-data-[state=open]:rotate-180" />
												</SidebarMenuButton>
											</CollapsibleTrigger>
											<CollapsibleContent>
												<SidebarMenuSub>
													{filteredBasicChats?.map((item) => (
														<SidebarMenuSubItem key={item.id}>
															<SidebarMenuButton asChild>
																<Link
																	href={`/chat/basic/${item.id}`}
																	className={cn(
																		"text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors rounded-md",
																		pathname === `/chat/basic/${item.id}` &&
																			"bg-neutral-800 text-white"
																	)}
																>
																	<span className="truncate">
																		{item.chatName}
																	</span>
																</Link>
															</SidebarMenuButton>
														</SidebarMenuSubItem>
													))}
												</SidebarMenuSub>
											</CollapsibleContent>
										</SidebarMenuItem>
									</Collapsible>
								</SidebarMenu>
							</SidebarGroup>
						) : null}
					</>
				) : null}

				{/* Other Section */}
				<div className="mt-auto">
					<SidebarSeparator className="my-2" />
					<SidebarGroup>
						<SidebarGroupLabel className="text-xs font-medium text-neutral-400 uppercase tracking-wider px-2">
							OTHER
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{otherItems.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											className="hover:bg-neutral-800 transition-colors"
										>
											{item.external ? (
												<a href={item.url} target="_blank" rel="noopener noreferrer">
													<item.icon className="w-4 h-4" />
													<span>{item.title}</span>
												</a>
											) : (
												<Link href={item.url}>
													<item.icon className="w-4 h-4" />
													<span>{item.title}</span>
												</Link>
											)}
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</div>
			</SidebarContent>
			<SidebarFooter className="bg-neutral-900 text-white border-t border-neutral-800">
				{user && (
					<NavDropdown side="right">
						<div className="flex items-center gap-3 p-3 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer">
							<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 text-white font-bold text-sm flex justify-center items-center">
								{user.fullName.split(" ").map((name) => name.charAt(0))}
							</div>
							<div className="flex-1 min-w-0">
								<p className="font-semibold text-sm truncate">
									{user.fullName}
								</p>
								<p className="text-xs text-neutral-400 truncate">
									{user.userName}
								</p>
							</div>
							<ChevronsUpDownIcon className="w-4 h-4 text-neutral-400" />
						</div>
					</NavDropdown>
				)}
			</SidebarFooter>
		</Sidebar>
	);
}
