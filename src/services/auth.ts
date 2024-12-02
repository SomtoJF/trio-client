import { BaseRoute, Route } from "./routes";
import { User } from "@/types";

type SignUpType = {
	userName: string;
	password: string;
	fullName: string;
};

export const getCurrentUser = async (): Promise<User> => {
	const res = await fetch(`${BaseRoute}/${Route.Me}`, {
		method: "GET",
		credentials: "include",
	});
	if (!res.ok) throw new Error(res.statusText);
	const user = await res.json();
	return user.data as User;
};

export async function login(data: {
	userName: string;
	password: string;
}): Promise<void> {
	const response = await fetch(`${BaseRoute}/${Route.Login}`, {
		method: "POST",
		credentials: "include",
		body: JSON.stringify(data),
	});
	if (response.status > 299) throw new Error(response.statusText);
}

export const signout = async () => {
	const res = await fetch(`${BaseRoute}/${Route.SignOut}`, {
		method: "POST",
		credentials: "include",
	});
	if (res.status > 299) throw new Error(res.statusText);
};

export async function signUp(data: SignUpType): Promise<void> {
	const response = await fetch(`${BaseRoute}/${Route.SignUp}`, {
		method: "POST",
		credentials: "include",
		body: JSON.stringify(data),
	});
	if (response.status > 299) throw new Error(response.statusText);
}
