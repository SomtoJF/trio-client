import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import ProtectedSidebar from "@/components/custom/ProtectedSidebar";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<SidebarProvider>
			<ProtectedSidebar />

			<div
				className={cn(
					"flex flex-col md:flex-row bg-neutral-900 w-full flex-1 max-w-screen-2xl mx-auto overflow-hidden",
					"h-screen"
				)}
			>
				<section className="w-full h-full bg-black flex flex-col justify-center items-center pb-3">
					{children}
				</section>
			</div>
		</SidebarProvider>
	);
}
