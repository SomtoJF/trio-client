"use client";

import { signout } from "@/services";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useAuthStore, useToast } from "@/hooks";

export default function Page() {
	const toast = useToast();
	const setUser = useAuthStore((state) => state.setUser);
	const { push } = useRouter();
	const signoutMutation = useMutation({
		mutationFn: signout,
		onSuccess: () => {
			setUser(null);
			toast.success("signout successful");
			setTimeout(() => {
				push("/");
			}, 2000);
		},
		onError: (error) => {
			toast.error("We couldn't log you out");
			throw error;
		},
	});

	useEffect(() => {
		signoutMutation.mutate();
	}, []);

	return (
		<div className="w-full h-full justify-center items-center">
			<div className="flex justify-center items-center flex-col gap-4">
				<p className="text-xl font-semibold">Logging you out</p>
				<AiOutlineLoading className="animate-spin" />
			</div>
		</div>
	);
}
