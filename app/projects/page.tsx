import type { Metadata } from "next";
import ProjectsView from "./ProjectsView";
import { JsonLd, getProjectsCollectionSchema } from "@/app/lib/jsonld";
import { profile, staticRoutes } from "@/app/data/profile";

const projectsRoute = staticRoutes.find((r) => r.path === "/projects");
const pageTitle = `Projects — ${profile.name}`;
const pageDescription =
	projectsRoute?.description ||
	`Explore production AI systems built by ${profile.name}, including JanSamadhan and NyayaAI.`;

export const metadata: Metadata = {
	title: "Projects",
	description: pageDescription,
	alternates: {
		canonical: "/projects",
	},
	openGraph: {
		title: pageTitle,
		description: pageDescription,
		url: "/projects",
		type: "website",
		images: [
			{
				url: "/og/projects.png",
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
		images: ["/og/projects.png"],
	},
};

export default function ProjectsPage() {
	return (
		<>
			<JsonLd data={getProjectsCollectionSchema()} />
			<ProjectsView />
		</>
	);
}
