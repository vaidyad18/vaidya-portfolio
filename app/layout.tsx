import GoogleAnalyticsDeferred from "./components/GoogleAnalyticsDeferred";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import { Inter, Pirata_One, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
import MobileHeader from "./components/mobile/MobileHeader";
import MobileBottomBar from "./components/mobile/MobileBottomBar";
import { JsonLd, getRootGraphSchema } from "./lib/jsonld";

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

export const metadata: Metadata = {
	metadataBase: new URL("https://medhanshk.me"),
	title: {
		default: profile.name,
		template: `%s | ${profile.name}`,
	},
	description:
		`Portfolio of ${profile.name} — AI/ML Engineer and Full-Stack Developer based in ${profile.location}. Specializing in AI agents, RAG pipelines, FastAPI, and Next.js.`,
	authors: [{ name: profile.name, url: "https://medhanshk.me" }],
	creator: profile.name,
	alternates: {
		canonical: "/",
	},
	openGraph: {
		title: `${profile.name} — AI/ML Engineer & Full-Stack Developer`,
		description:
			`Portfolio of ${profile.name} — AI/ML Engineer and Full-Stack Developer based in ${profile.location}. Specializing in AI agents, RAG pipelines, FastAPI, and Next.js.`,
		url: "https://medhanshk.me",
		siteName: profile.name,
		locale: "en_US",
		type: "website",
		images: [
			{
				url: "/og/og-image.png",
				width: 1200,
				height: 630,
				alt: `${profile.name} — AI/ML Engineer & Full-Stack Developer`,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		creator: "@medhansh541",
		title: `${profile.name} — AI/ML Engineer & Full-Stack Developer`,
		description:
			`Portfolio of ${profile.name} — AI/ML Engineer and Full-Stack Developer based in ${profile.location}. Specializing in AI agents, RAG pipelines, FastAPI, and Next.js.`,
		images: ["/og/og-image.png"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	icons: {
		icon: [
			{ url: "/icon.svg", type: "image/svg+xml" },
			{ url: "/favicon.ico", sizes: "32x32" },
		],
		apple: [
			{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
		],
	},
};

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
			</head>
			<body
				className={`${inter.variable} ${playfair.variable} ${pirataOne.variable} ${dseg7.variable} ${dseg14.variable} antialiased bg-background text-foreground font-sans`}
			>
				<JsonLd data={getRootGraphSchema()} />
				<div className="min-h-dvh flex flex-col">
					<Navbar />
					<MobileHeader />
					{children}
					{modal}
					<MobileBottomBar />
				</div>
				<Analytics />
				<GoogleAnalyticsDeferred gaId="G-D064XWFM94" />
			</body>
		</html>
	);
}
