import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import ProtectedSidebar from "@/components/custom/ProtectedSidebar";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

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
				<nav className="bg-black flex items-center absolute h-10 w-full px-2">
					<SidebarTrigger className="hover:bg-neutral-700 hover:text-white" />
				</nav>
				<section className="w-full h-full bg-black flex flex-col justify-center items-center pt-14 pb-3">
					{children}
				</section>
			</div>
		</SidebarProvider>
	);
}
