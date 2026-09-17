import type { Viewport } from "next";
import { Inter, Pirata_One, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
import MobileHeader from "./components/mobile/MobileHeader";
import MobileBottomBar from "./components/mobile/MobileBottomBar";

import { profile } from "./data/profile";

export const viewport: Viewport = {
	themeColor: "#FFFFFF",
	colorScheme: "only light" as "light",
};

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

const playfair = Playfair_Display({
	subsets: ["latin"],
	variable: "--font-playfair",
});

const pirataOne = Pirata_One({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-pirata",
});

const dseg7 = localFont({
	src: [
		{ path: "../public/fonts/DSEG7Classic-Regular.woff2", weight: "400", style: "normal" },
		{ path: "../public/fonts/DSEG7Classic-Bold.woff2", weight: "700", style: "normal" },
	],
	variable: "--font-dseg7",
	display: "swap",
});

const dseg14 = localFont({
	src: [
		{ path: "../public/fonts/DSEG14Classic-Regular.woff2", weight: "400", style: "normal" },
		{ path: "../public/fonts/DSEG14Classic-Bold.woff2", weight: "700", style: "normal" },
	],
	variable: "--font-dseg14",
	display: "swap",
});

export default function RootLayout({
	children,
	modal,
}: Readonly<{
	children: React.ReactNode;
	modal: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta name="color-scheme" content="only light" />
				<meta name="theme-color" content="#FFFFFF" />
				<link rel="icon" href="/logo.png" type="image/png" />
				<link rel="apple-touch-icon" href="/logo.png" />
			</head>
			<body
				className={`${inter.variable} ${playfair.variable} ${pirataOne.variable} ${dseg7.variable} ${dseg14.variable} antialiased bg-background text-foreground font-sans`}
			>
				<div className="min-h-dvh flex flex-col">
					<Navbar />
					<MobileHeader />
					{children}
					{modal}
					<MobileBottomBar />
				</div>
			</body>
		</html>
	);
}

