import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { profile } from "@/app/data/profile";
import MobileProjectModal from "@/app/components/mobile/MobileProjectModal";
import DesktopProjectDirectView from "@/app/components/DesktopProjectDirectView";
import { JsonLd, getSingleProjectSchema } from "@/app/lib/jsonld";

export async function generateStaticParams() {
	return profile.projects.map((project) => ({
		slug: project.title.toLowerCase().replace(/\s+/g, "-"),
	}));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const resolvedParams = await params;
	const project = profile.projects.find(
		(p) =>
			p.title.toLowerCase() === resolvedParams.slug.toLowerCase() ||
			p.title.toLowerCase().replace(/\s+/g, "-") === resolvedParams.slug.toLowerCase(),
	);

	if (!project) return { title: "Project Not Found" };

	const canonicalUrl = `https://medhanshk.me/projects/${resolvedParams.slug}`;

	const fullTitle = `${project.title} | Medhansh Kapoor`;
	const ogImageUrl = `https://medhanshk.me/og/${resolvedParams.slug}.png`;

	return {
		title: project.title,
		description: project.description,
		alternates: {
			canonical: canonicalUrl,
		},
		openGraph: {
			title: fullTitle,
			description: project.description,
			url: canonicalUrl,
			siteName: "Medhansh Kapoor",
			type: "article",
			images: [
				{
					url: ogImageUrl,
					width: 1200,
					height: 630,
					alt: `${project.title} Preview`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: fullTitle,
			description: project.description,
			creator: "@medhansh541",
			images: [ogImageUrl],
		},
	};
}

export default async function ProjectPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const resolvedParams = await params;
	const project = profile.projects.find(
		(p) =>
			p.title.toLowerCase() === resolvedParams.slug.toLowerCase() ||
			p.title.toLowerCase().replace(/\s+/g, "-") === resolvedParams.slug.toLowerCase(),
	);

	if (!project) {
		notFound();
	}

	const jsonLdData = getSingleProjectSchema(project, resolvedParams.slug);

	return (
		<main className="min-h-dvh flex flex-col items-center justify-center bg-background">
			{/* Schema.org ItemPage + SoftwareApplication Structured Data */}
			<JsonLd data={jsonLdData} />

			{/* Mobile Project Modal (Hidden on Desktop) */}
			<div className="xl:hidden w-full flex-1 flex flex-col">
				<MobileProjectModal project={project} allProjects={profile.projects} isDirect={true} />
			</div>

			{/* Desktop Window View (Hidden on Mobile) */}
			<div className="hidden xl:flex w-full flex-1 items-center justify-center">
				<DesktopProjectDirectView project={project} />
			</div>
		</main>
	);
}
