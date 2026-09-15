import type { Metadata } from "next";
import AboutView from "./AboutView";
import { JsonLd, getProfilePageSchema } from "@/app/lib/jsonld";
import { profile, staticRoutes } from "@/app/data/profile";

const aboutRoute = staticRoutes.find((r) => r.path === "/about");
const pageTitle = `About — ${profile.name}`;
const pageDescription =
	aboutRoute?.description ||
	`Engineering background, technical philosophy, and education of ${profile.name}.`;

export const metadata: Metadata = {
	title: "About",
	description: pageDescription,
	alternates: {
		canonical: "/about",
	},
	openGraph: {
		title: pageTitle,
		description: pageDescription,
		url: "/about",
		type: "website",
		images: [
			{
				url: "/og/about.png",
				width: 1200,
				height: 630,
				alt: pageTitle,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: pageTitle,
		description: pageDescription,
		images: ["/og/about.png"],
	},
};

export default function AboutPage() {
	return (
		<>
			<JsonLd
				data={getProfilePageSchema(
					"/about",
					"About — Medhansh Kapoor",
					"Medhansh Kapoor — AI/ML Engineer & Full-Stack Developer based in Jaipur, India. Engineering philosophy, achievements, and education."
				)}
			/>
			<AboutView />
		</>
	);
}
