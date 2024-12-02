const isProduction = process.env.NODE_ENV === "production";

export const BaseRoute = isProduction ? "FILL_ME_IN" : "http://localhost:4000";

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

const Chats = createPrefixedRoutes("chats", chatRoutes);

const routeConfig = {
	Login: "login",
	SignOut: "logout",
	SignUp: "signup",
	Me: "me",
	Chats,
} as const;

export type Route = typeof routeConfig;
export const Route: Route = routeConfig;
