export interface ReflectionChat {
	id: string;
	createdAt: string;
	updatedAt: string;
	chatName: string;
	reflections: Reflection[];
}

export interface Reflection {
	id: string;
	createdAt: string;
	updatedAt: string;
	chatId: string;
	messages: ReflectionMessage[];
}

export interface ReflectionMessage {
	id: string;
	content: string;
	isOptimal: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface User {
	id: string;
	fullName: string;
	userName: string;
}

export interface BasicChat {
	id: string;
	createdAt: string;
	updatedAt: string;
	chatName: string;
	chatAgents: BasicAgent[];
}

export interface BasicAgent {
	id: string;
	AgentName: string;
	AgentTraits: string[];
	createdAt: string;
	updatedAt: string;
}
