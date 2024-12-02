import { Agent, Chat, ChatType } from "@/types";
import { BaseRoute, Route } from "./routes";

interface Data {
	chatName: string;
	agents: Partial<Agent>[];
}

export async function createChat(data: Data) {
	const res = await fetch(`${BaseRoute}/chats`, {
		method: "POST",
		credentials: "include",
		body: JSON.stringify(data),
	});
	if (res.status > 299) throw new Error(res.statusText);
	const result = await res.json();
	return result;
}

export async function currentUserChats(): Promise<Chat[]> {
	const res = await fetch(`${BaseRoute}/chats`, {
		method: "GET",
		credentials: "include",
	});
	if (res.status > 299) throw new Error(res.statusText);
	const result = await res.json();
	return result.data as Chat[];
}

export async function getOneChat(id: string): Promise<Chat> {
	const res = await fetch(`${BaseRoute}/${Route.Chats.Default}${id}`, {
		method: "GET",
		credentials: "include",
	});
	if (res.status > 299) throw new Error(res.statusText);
	const result = await res.json();
	return result.data as Chat;
}

export async function addMessageToChat(chatId: string, message: string) {
	const data = { content: message };
	const res = await fetch(
		`${BaseRoute}/${Route.Chats.Default}${chatId}/messages`,
		{
			method: "POST",
			credentials: "include",
			body: JSON.stringify(data),
		}
	);
	const result = await res.json();
	if (res.status > 299) throw new Error(result.error ?? res.statusText);
	return result;
}

export async function updateChat(
	chatId: string,
	data: {
		chatName: string;
		type: ChatType;
		agents: {
			name: string;
			metadata?: { lingo: string; traits: string[] };
		}[];
	}
) {
	const res = await fetch(`${BaseRoute}/${Route.Chats.Default}${chatId}`, {
		method: "PUT",
		credentials: "include",
		body: JSON.stringify(data),
	});

	const result = await res.json();
	if (res.status > 299) throw new Error(result.error ?? res.statusText);
	return result.data;
}

export async function streamCompletions(
	chatId: string,
	content: string,
	onData: (data: string) => void,
	onError: (error: string) => void,
	onComplete: () => void
): Promise<any> {
	try {
		const response = await fetch(
			`${BaseRoute}/${Route.Chats.Default}${chatId}/messages`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ content }),
				credentials: "include",
			}
		);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const reader = response.body?.getReader();
		if (!reader) {
			throw new Error("Failed to get response reader");
		}

		const decoder = new TextDecoder();

		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) {
					onComplete();
					break;
				}

				const chunk = decoder.decode(value, { stream: true });
				const lines = chunk.split("\n");

				for (const line of lines) {
					if (line.startsWith("data:")) {
						const eventData = line.slice(5);
						if (eventData === "<nil>") {
							onComplete();
							return;
						}
						try {
							onData(eventData);
						} catch (e) {
							console.error("Failed to parse event data:", e);
						}
					}
				}
			}
		} finally {
			reader.releaseLock();
		}
	} catch (err: any) {
		onError(err.message);
	} finally {
		onComplete();
	}
}

export async function deleteChat(chatId: string): Promise<void> {
	const res = await fetch(`${BaseRoute}/${Route.Chats.Default}${chatId}`, {
		method: "DELETE",
		credentials: "include",
	});
	if (res.status > 299) throw new Error(res.statusText);

	return;
}
