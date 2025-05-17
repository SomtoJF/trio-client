import SpotlightWrapper from "@/components/custom/SpotlightWrapper";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
	title: "Trio - Chat with Multiple AI Agents",
	description:
		"Experience the power of conversing with multiple AI agents simultaneously. Trio lets you create custom AI personalities and add them to group chats.",
	keywords:
		"AI chat, GPT, Claude, Gemini, group chat, AI agents, artificial intelligence",
	openGraph: {
		title: "Trio - Chat with Multiple AI Agents",
		description:
			"Experience the power of conversing with multiple AI agents simultaneously.",
		type: "website",
		locale: "en_US",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={inter.className}>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="robots" content="index, follow" />
				<link rel="canonical" href="https://your-domain.com" />
			</head>
			<Providers>
				<body className="w-screen bg-black text-white flex justify-center min-h-screen">
					<SpotlightWrapper />
					<div className="max-w-screen-2xl w-full h-full">{children}</div>
				</body>
			</Providers>
		</html>
	);
}
