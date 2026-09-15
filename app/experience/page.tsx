import type { Metadata } from "next";
import ExperienceView from "./ExperienceView";
import { JsonLd, getExperiencePageSchema } from "@/app/lib/jsonld";
import { profile, staticRoutes } from "@/app/data/profile";

const experienceRoute = staticRoutes.find((r) => r.path === "/experience");
const pageTitle = `Experience — ${profile.name}`;
const pageDescription =
	experienceRoute?.description ||
	`Professional AI/ML engineering experience of ${profile.name} across IndiaAI Mission, ISSA-DRDO, and Geminid Systems.`;

export const metadata: Metadata = {
	title: "Experience",
	description: pageDescription,
	alternates: {
		canonical: "/experience",
	},
	openGraph: {
		title: pageTitle,
		description: pageDescription,
		url: "/experience",
		type: "website",
		images: [
			{
				url: "/og/experience.png",
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
		images: ["/og/experience.png"],
	},
};

export default function ExperiencePage() {
	return (
		<>
			<JsonLd data={getExperiencePageSchema()} />
			<ExperienceView />
		</>
	);
}
