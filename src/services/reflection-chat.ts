import { BaseRoute, Route } from "./routes";

interface CreateReflectionChatData {
	chatName: string;
}

interface ReflectionChat {
	id: string;
	chatName: string;
}

export async function createReflectionChat(data: CreateReflectionChatData) {
	const res = await fetch(`${BaseRoute}/${Route.ReflectionChats.Default}`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	if (res.status > 299) throw new Error(res.statusText);
	return await res.json();
}

export async function getReflectionChats(): Promise<ReflectionChat[]> {
	const res = await fetch(`${BaseRoute}/${Route.ReflectionChats.Default}`, {
		method: "GET",
		credentials: "include",
	});
	const result = await res.json();
	console.log(result);
	if (res.status > 299)
		throw new Error(result.error ?? "Failed to get reflection chats");
	return result.data as ReflectionChat[];
}

export async function deleteReflectionChat(chatId: string) {
	const res = await fetch(
		`${BaseRoute}/${Route.ReflectionChats.Default}/${chatId}`,
		{
			method: "DELETE",
			credentials: "include",
		}
	);
	if (res.status > 299) throw new Error(res.statusText);
	return;
}
