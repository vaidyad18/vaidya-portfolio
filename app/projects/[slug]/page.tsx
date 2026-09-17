import { notFound } from "next/navigation";
import { profile } from "@/app/data/profile";
import MobileProjectModal from "@/app/components/mobile/MobileProjectModal";
import DesktopProjectDirectView from "@/app/components/DesktopProjectDirectView";

export async function generateStaticParams() {
	return profile.projects.map((project) => ({
		slug: project.title.toLowerCase().replace(/\s+/g, "-"),
	}));
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

	return (
		<main className="min-h-dvh flex flex-col items-center justify-center bg-background">
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

