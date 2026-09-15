import { notFound } from "next/navigation";
import { profile } from "@/app/data/profile";
import MobileProjectModal from "@/app/components/mobile/MobileProjectModal";
import DesktopProjectDirectView from "@/app/components/DesktopProjectDirectView";

export default async function ProjectModalIntercept({
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
		<>
			{/* Mobile Modal Intercept */}
			<div className="xl:hidden">
				<MobileProjectModal project={project} allProjects={profile.projects} isDirect={true} />
			</div>

			{/* Desktop Modal Intercept */}
			<div className="hidden xl:flex">
				<DesktopProjectDirectView project={project} />
			</div>
		</>
	);
}
