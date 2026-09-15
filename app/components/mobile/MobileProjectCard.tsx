import { Project } from "@/app/data/profile";
import Link from "next/link";
import { FiFolder, FiArrowUpRight, FiGithub, FiYoutube } from "react-icons/fi";
import CardDeckVideo from "./CardDeckVideo";

interface MobileProjectCardProps {
	project: Project;
	onOpenDemo?: (project: Project) => void;
}

const MOBILE_VIDEO_MAP: Record<string, string> = {
	jansamadhan: "jansamadhan",
	nyayaai: "nyayaai",
};

export default function MobileProjectCard({ project, onOpenDemo }: MobileProjectCardProps) {
	return (
		<div className="w-full h-full flex flex-col justify-between bg-card border border-border/50 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] p-fluid-md gap-fluid-sm relative">
			{/* Card Header Equivalent */}
			<div className="flex items-center gap-fluid-xs border-b-2 border-border pb-fluid-xs">
				<FiFolder className="w-[1.5em] h-[1.5em] text-[var(--color-accent-secondary)]" />
				<span className="font-sans text-caption font-bold uppercase tracking-widest text-[var(--color-accent-secondary)]">
					PROJECT
				</span>
			</div>

			{/* Title & Subtitle */}
			<div className="flex flex-col gap-fluid-xs">
				<Link
					href={`/projects/${project.title.toLowerCase().replace(/\s+/g, "-")}`}
					className="focus-visible:outline-none"
					title={`View ${project.title}`}
				>
					<h3 className="font-sans font-bold uppercase text-foreground text-body leading-tight">
						{project.title}
					</h3>
				</Link>
				<p className="text-muted-foreground font-semibold uppercase tracking-wider text-caption">
					{project.subtitle}
				</p>
			</div>

			{/* Video Preview */}
			<div className="w-full flex-1 min-h-0 bg-muted border-2 border-border overflow-hidden relative mt-fluid-xs">
				<CardDeckVideo
					projectFileName={MOBILE_VIDEO_MAP[project.title.toLowerCase()] || project.title.toLowerCase()}
					className="w-full h-full object-cover"
				/>
			</div>

			{/* Isolated Footer */}
			<div className="border-t-2 border-border mt-auto pt-fluid-md flex gap-fluid-sm shrink-0">
				{project.links?.github && (
					<a
						href={project.links.github}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="View on GitHub"
						className="flex items-center justify-center w-12 h-12 bg-background border-2 border-border shadow-[2px_2px_0_0_var(--color-border)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150 text-foreground"
					>
						<FiGithub size="1.25rem" />
					</a>
				)}
				
				{project.links?.demo && (
					onOpenDemo ? (
						<button
							type="button"
							onClick={() => onOpenDemo(project)}
							aria-label="View Project Demo"
							className="flex items-center justify-center w-12 h-12 bg-background border-2 border-border shadow-[2px_2px_0_0_var(--color-border)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150 text-[var(--color-accent-warning)] cursor-pointer"
						>
							<FiYoutube size="1.25rem" />
						</button>
					) : (
						<Link
							href={`/projects/${project.title.toLowerCase().replace(/\s+/g, "-")}`}
							scroll={false}
							aria-label="View Project Demo"
							className="flex items-center justify-center w-12 h-12 bg-background border-2 border-border shadow-[2px_2px_0_0_var(--color-border)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150 text-[var(--color-accent-warning)]"
						>
							<FiYoutube size="1.25rem" />
						</Link>
					)
				)}

				<Link
					href={`/projects#${project.title.toLowerCase().replace(/\s+/g, "-")}`}
					aria-label={`View ${project.title} Details`}
					className="flex items-center justify-center w-12 h-12 ml-auto bg-background border-2 border-border shadow-[2px_2px_0_0_var(--color-border)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150 text-foreground"
				>
					<FiArrowUpRight size="1.25rem" />
				</Link>
			</div>

		</div>
	);
}
