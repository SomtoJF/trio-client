"use client";

import React, { useState, useMemo, useEffect, useRef, ReactNode } from "react";
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
	SidebarInput,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import {
	BrainCog,
	ChevronsUpDownIcon,
	SquarePlus,
	Search,
	Github,
	MessageCircleHeart,
	Sparkles,
	MessageSquare,
	type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { NavDropdown } from "@/components/custom";
import { useAuthStore } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/query-key-factory";
import { getBasicChats, getReflectionChats } from "@/services";
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

	// Combine and sort all chats by updated date
	const allChats = useMemo(() => {
		const combined: Array<
			| (ReflectionChat & { type: "reflection" })
			| (BasicChat & { type: "basic" })
		> = [];

		if (reflectionChats) {
			combined.push(
				...reflectionChats.map((chat) => ({ ...chat, type: "reflection" as const }))
			);
		}

		if (basicChats) {
			combined.push(
				...basicChats.map((chat) => ({ ...chat, type: "basic" as const }))
			);
		}

		// Sort by updatedAt descending (most recent first)
		return combined.sort(
			(a, b) =>
				new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
		);
	}, [reflectionChats, basicChats]);

	// Filter chats based on search query
	const filteredChats = useMemo(() => {
		if (!searchQuery) return allChats;
		return allChats.filter((chat) =>
			chat.chatName.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [allChats, searchQuery]);

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

	const navigationItems: {title: string, url: string, icon: LucideIcon, isActive: boolean}[] = [];

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
		{navigationItems.length > 0 &&	<SidebarGroup>
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
				</SidebarGroup>}

				{/* All Chats */}
				{filteredChats?.length ? (
					<>
						<SidebarSeparator className="my-2" />
						<SidebarGroup>
							<SidebarGroupContent>
								<SidebarMenu>
									{filteredChats.map((chat) => {
										const isReflection = chat.type === "reflection";
										const href = isReflection
											? `/chat/reflection/${chat.id}`
											: `/chat/basic/${chat.id}`;
										const isActive = pathname === href;
										const Icon = isReflection ? Sparkles : MessageSquare;

										return (
											<SidebarMenuItem key={`${chat.type}-${chat.id}`}>
												<SidebarMenuButton
													asChild
													className={cn(
														"hover:bg-neutral-800 transition-colors",
														isActive && "bg-neutral-800 text-white"
													)}
												>
													<Link href={href} className="flex items-center gap-2">
														<Icon
															className={cn(
																"w-4 h-4 flex-shrink-0",
																isReflection
																	? "text-purple-400"
																	: "text-green-400"
															)}
														/>
														<span className="truncate text-sm">
															{chat.chatName}
														</span>
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										);
									})}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
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
