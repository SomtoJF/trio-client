export const BaseRoute = process.env.NEXT_PUBLIC_BACKEND_URL;

type RouteValues<T> = {
	[K in keyof T]: string;
};

function createPrefixedRoutes<T extends RouteValues<T>>(
	prefix: string,
	routes: T
): { [K in keyof T]: string } {
	return Object.entries(routes).reduce((acc, [key, value]) => {
		acc[key as keyof T] = `${prefix}/${value}`;
		return acc;
	}, {} as { [K in keyof T]: string });
}

const chatRoutes = {
	Default: "",
} as const;

const BasicChats = createPrefixedRoutes("basic-chats", chatRoutes);
const ReflectionChats = createPrefixedRoutes("reflection-chats", chatRoutes);

const routeConfig = {
	Login: "login",
	GuestLogin: "login/guest",
	SignOut: "logout",
	SignUp: "signup",
	Me: "me",
	BasicChats,
	ReflectionChats,
} as const;

export type Route = typeof routeConfig;
export const Route: Route = routeConfig;
