import SpotlightWrapper from "@/components/custom/SpotlightWrapper";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
	title: "Welcome to trio",
	description:
		"Trio is a multi-agent chat app which provides you with multiple AI friends to help you with your questions",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={inter.className}>
			<Providers>
				<body className="w-screen bg-black text-white flex justify-center min-h-screen">
					<SpotlightWrapper />
					<div className="max-w-screen-2xl w-full h-full">{children}</div>
				</body>
			</Providers>
		</html>
	);
}
