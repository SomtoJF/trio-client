import { BaseRoute, Route } from "./routes";

interface CreateBasicChatData {
	chatName: string;
	agents: {
		agentName: string;
		agentTraits: string[];
	}[];
}

interface BasicChat {
	id: string;
	chatName: string;
	agents: {
		agentName: string;
		agentTraits: string[];
	}[];
}

export async function createBasicChat(data: CreateBasicChatData) {
	const res = await fetch(`${BaseRoute}/${Route.BasicChats.Default}`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	const result = await res.json();
	if (res.status > 299)
		throw new Error(result.error ?? "Failed to create basic chat");
	return result;
}

export async function getBasicChats(): Promise<BasicChat[]> {
	const res = await fetch(`${BaseRoute}/${Route.BasicChats.Default}`, {
		method: "GET",
		credentials: "include",
	});
	const result = await res.json();
	if (res.status > 299)
		throw new Error(result.error ?? "Failed to get basic chats");
	return result.data ?? ([] as BasicChat[]);
}

export async function updateBasicChat(
	chatId: string,
	data: CreateBasicChatData
) {
	const res = await fetch(
		`${BaseRoute}/${Route.BasicChats.Default}/${chatId}`,
		{
			method: "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		}
	);
	const result = await res.json();
	if (res.status > 299)
		throw new Error(result.error ?? "Failed to update basic chat");
	return result;
}

export async function deleteBasicChat(chatId: string) {
	const res = await fetch(
		`${BaseRoute}/${Route.BasicChats.Default}/${chatId}`,
		{
			method: "DELETE",
			credentials: "include",
		}
	);
	const result = await res.json();
	if (res.status > 299)
		throw new Error(result.error ?? "Failed to delete basic chat");
	return result;
}
