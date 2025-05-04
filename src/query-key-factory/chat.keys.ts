export const chatKeys = {
	all: ["chat"],
	getReflectionChats: () => [...chatKeys.all, "reflection-chats"] as const,
	getBasicChats: () => [...chatKeys.all, "basic-chats"] as const,
	getOneBasicChat: (id: string) =>
		[...chatKeys.all, "basic-chats", id] as const,
	getBasicChatMessages: (id: string) =>
		[...chatKeys.all, "basic-chats", id, "messages"] as const,
	getOneReflectionChat: (id: string) =>
		[...chatKeys.all, "reflection-chats", id] as const,
	getChatReflections: (id: string) =>
		[...chatKeys.all, "reflection-chats", id, "reflections"] as const,
};
