"use client";

import { Spotlight } from "@/components/ui/spotlight";
import { usePathname } from "next/navigation";

export default function SpotlightWrapper() {
	const pathname = usePathname();
	const isHomePage = pathname === "/";

	if (!isHomePage) return null;

	return (
		<Spotlight
			className="-top-40 left-0 md:left-60 md:-top-20 z-50"
			fill="white"
		/>
	);
}
