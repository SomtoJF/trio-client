import { Reflection, ReflectionChat } from "@/types";
import { BaseRoute, Route } from "./routes";

interface CreateReflectionChatData {
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

export async function getReflectionChat(
	chatId: string
): Promise<ReflectionChat> {
	const res = await fetch(
		`${BaseRoute}/${Route.ReflectionChats.Default}${chatId}`,
		{
			method: "GET",
			credentials: "include",
		}
	);
	const result = await res.json();
	if (res.status > 299)
		throw new Error(result.error ?? "Failed to get reflection chat");

	return result.data as ReflectionChat;
}

export async function getChatReflections(
	chatId: string
): Promise<Reflection[]> {
	const res = await fetch(
		`${BaseRoute}/${Route.ReflectionChats.Default}${chatId}/reflections`,
		{
			method: "GET",
			credentials: "include",
		}
	);
	const result = await res.json();

	if (res.status > 299 && res.status !== 500)
		throw new Error(result.error ?? "Failed to get chat reflections");

	return result.data as Reflection[];
}

export async function getReflectionChats(): Promise<ReflectionChat[]> {
	const res = await fetch(`${BaseRoute}/${Route.ReflectionChats.Default}`, {
		method: "GET",
		credentials: "include",
	});
	const result = await res.json();

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

interface CreateReflectionMessageData {
	content: string;
}

interface SendReflectionMessageResponse {
	reflection: Reflection;
	status: string[];
	error?: string;
}

export async function sendReflectionMessage(
	chatId: string,
	data: CreateReflectionMessageData,
	onStatus: (status: string[]) => void,
	onReflection: (reflection: Reflection) => void,
	onError: (error: string) => void,
	onDone: () => void
): Promise<void> {
	const response = await fetch(
		`${BaseRoute}/${Route.ReflectionChats.Default}${chatId}/messages`,
		{
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ message: data.content }),
		}
	);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const responseBody = response.body;
	if (!responseBody) throw new Error("No response body");

	const reader = responseBody.getReader();
	const decoder = new TextDecoder();
	let buffer = ""; // Add buffer for incomplete chunks

	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) {
				onDone();
				break;
			}

			// Append new chunk to buffer and split by newlines
			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split("\n");

			// Keep the last incomplete line in buffer
			buffer = lines.pop() || "";

			for (const line of lines) {
				if (line.trim() === "") continue; // Skip empty lines

				if (line.startsWith("data:")) {
					const eventData = line.slice(5); // "data: " is 6 characters
					if (eventData === "<nil>" || eventData === "done") {
						onDone();
						return;
					}

					try {
						const data: SendReflectionMessageResponse = JSON.parse(eventData);
						console.log(data);

						if (data.error) {
							onError(data.error);
							return; // Exit on error
						}

						if (data.status) {
							onStatus(data.status);
						}

						if (data.reflection) {
							onReflection(data.reflection);
						}
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
