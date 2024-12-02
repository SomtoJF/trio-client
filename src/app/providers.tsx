"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Toaster } from "sonner";

interface Props {
	children: ReactNode;
}
/**
 *
 * @param children ReactNode
 * @returns All required contexts to run/develop a webapp
 */

const queryClient = new QueryClient();

const Providers = ({ children }: Props) => {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<Toaster />
		</QueryClientProvider>
	);
};

export default Providers;
