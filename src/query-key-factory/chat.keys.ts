export const chatKeys = {
	all: ["chat"],
	getOne: (id: string) => [...chatKeys.all, id] as const,
	getReflectionChats: () => [...chatKeys.all, "reflection"] as const,
	getBasicChats: () => [...chatKeys.all, "basic-chats"] as const,
	getMany: () => [...chatKeys.all, "many"] as const,
};
