import { BaseRoute, Route } from "./routes";
import { BasicChat, BasicChatMessage } from "@/types";
interface CreateBasicChatData {
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
	const res = await fetch(`${BaseRoute}/${Route.BasicChats.Default}${chatId}`, {
		method: "PUT",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	const result = await res.json();
	if (res.status > 299)
		throw new Error(result.error ?? "Failed to update basic chat");
	return result;
}

export async function deleteBasicChat(chatId: string) {
	const res = await fetch(`${BaseRoute}/${Route.BasicChats.Default}${chatId}`, {
		method: "DELETE",
		credentials: "include",
	});
	const result = await res.json();
	if (res.status > 299)
		throw new Error(result.error ?? "Failed to delete basic chat");
	return result;
}

export async function getBasicChat(chatId: string): Promise<BasicChat> {
	const res = await fetch(`${BaseRoute}/${Route.BasicChats.Default}${chatId}`, {
		method: "GET",
		credentials: "include",
	});
	const result = await res.json();
	if (res.status > 299)
		throw new Error(result.error ?? "Failed to get basic chat");
	return result.data ?? ({} as BasicChat);
}

export async function getBasicChatMessages(
	chatId: string
): Promise<BasicChatMessage[]> {
	const res = await fetch(
		`${BaseRoute}/${Route.BasicChats.Default}${chatId}/messages`,
		{
			method: "GET",
			credentials: "include",
		}
	);
	const result = await res.json();
	if (res.status > 299)
		throw new Error(result.error ?? "Failed to get basic chat messages");
	return result.data ?? ([] as BasicChatMessage[]);
}

export async function sendBasicMessage(
	chatId: string,
	message: string,
	onResponse: (response: {
		agentResponses: { agentName: string; content: string; createdAt: string }[];
		status: { status: string; agentName: string }[];
		error?: string;
	}) => void,
	onDone: () => void,
	onError: (error: string) => void
): Promise<void> {
	const response = await fetch(
		`${BaseRoute}/${Route.BasicChats.Default}${chatId}/messages`,
		{
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ message }),
		}
	);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const responseBody = response.body;
	if (!responseBody) throw new Error("No response body");

	const reader = responseBody.getReader();
	const decoder = new TextDecoder();
	let buffer = "";

	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) {
				onDone();
				break;
			}

			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split("\n");

			buffer = lines.pop() || "";

			for (const line of lines) {
				if (line.trim() === "") continue;

				if (line.startsWith("data:")) {
					const eventData = line.slice(5);
					if (eventData === "<nil>" || eventData === "done") {
						onDone();
						return;
					}

					try {
						console.log(eventData);
						const data = JSON.parse(eventData);
						onResponse(data);
					} catch (e) {
						console.error("Failed to parse event data:", e);
						onError("Failed to parse server response");
						return;
					}
				}
			}
		}
	} catch (e) {
		console.error("Stream reading error:", e);
		onError("Stream reading error occurred");
		throw e;
	} finally {
		reader.releaseLock();
	}
}
