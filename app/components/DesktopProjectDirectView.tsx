"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import type { Project } from "@/app/data/profile";
import { getYouTubeEmbedUrl } from "@/app/lib/youtube";
import SharedVideoPreview from "./ui/SharedVideoPreview";

interface DesktopProjectDirectViewProps {
	project: Project;
}

export default function DesktopProjectDirectView({ project }: DesktopProjectDirectViewProps) {
	const router = useRouter();
	const [isMaximized, setIsMaximized] = useState(false);
	const youtubeEmbedUrl = getYouTubeEmbedUrl(project.links.demo);

	// Proactively prefetch destination routes into memory on mount for instant navigation
	useEffect(() => {
		router.prefetch("/");
		router.prefetch("/projects");
	}, [router]);

	return (
		<div
			onClick={() => router.push("/")}
			className="fixed inset-0 bg-background/60 backdrop-blur-md z-50 flex items-center justify-center p-0 cursor-zoom-out"
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.95, y: 10 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				transition={{ duration: 0.2, ease: "easeOut" }}
				onClick={(e) => e.stopPropagation()}
				style={{
					width: isMaximized ? "100vw" : "min(calc(100vw - 32px), 1024px)",
					height: isMaximized ? "100vh" : "min(80vh, 680px)",
				}}
				className={`bg-card text-card-foreground flex flex-col cursor-default relative overflow-hidden select-none transition-shadow duration-200 ${
					isMaximized
						? "border-0 shadow-none rounded-none"
						: "border-[3px] border-border shadow-md rounded-none"
				}`}
			>
				{/* Title Bar */}
				<div className="h-[38px] bg-muted border-b-[3px] border-border flex items-center justify-between px-3 select-none flex-shrink-0 relative z-30">
					<span className="font-mono text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
						📁 C:/PROJECTS/{project.title.toUpperCase()}.EXE
					</span>

					{/* Controls */}
					<div className="flex items-center gap-2">
						<Link
							href="/projects"
							prefetch={true}
							title="Minimize to Projects (/projects)"
							aria-label="Minimize to Projects"
							className="w-6 h-6 border-[2px] border-border bg-[var(--color-accent-secondary)] flex items-center justify-center font-black text-xs text-border hover:-translate-y-[1px] hover:shadow-[1px_1px_0_0_#000000] active:translate-y-0 active:shadow-none transition-all cursor-pointer"
						>
							-
						</Link>
						<button
							onClick={() => setIsMaximized(!isMaximized)}
							title={isMaximized ? "Restore Window" : "Maximize"}
							aria-label={isMaximized ? "Restore Window" : "Maximize"}
							className="w-6 h-6 border-[2px] border-border bg-[var(--color-accent-warning)] flex items-center justify-center font-black text-xs text-border hover:-translate-y-[1px] hover:shadow-[1px_1px_0_0_#000000] active:translate-y-0 active:shadow-none transition-all cursor-pointer"
						>
							▢
						</button>
						<Link
							href="/"
							prefetch={true}
							title="Close to Home (/)"
							aria-label="Close to Home"
							className="w-6 h-6 border-[2px] border-border bg-[var(--color-accent)] flex items-center justify-center font-black text-xs text-border hover:-translate-y-[1px] hover:shadow-[1px_1px_0_0_#000000] active:translate-y-0 active:shadow-none transition-all cursor-pointer"
						>
							✕
						</Link>
					</div>
				</div>

				{/* Theater Video Body */}
				<div className="p-4 bg-background flex flex-col gap-4 relative z-10 flex-grow h-[calc(100%-38px)] overflow-hidden">
					{project.links.demo && (
						<div className="w-full relative bg-black border-[3px] border-border overflow-hidden flex-grow">
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.2, duration: 0.2 }}
								className="absolute inset-0 w-full h-full flex items-center justify-center"
							>
								{youtubeEmbedUrl ? (
									<iframe
										src={youtubeEmbedUrl}
										title={`${project.title} Video Demonstration`}
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
										allowFullScreen
										className="w-full h-full border-0"
									/>
								) : (
									<SharedVideoPreview
										projectFileName={project.title.toLowerCase().replace(/\s+/g, "")}
										className="w-full h-full object-cover"
									/>
								)}
							</motion.div>
						</div>
					)}

					{/* Footer details */}
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 flex-shrink-0">
						<div>
							<h1 className="font-sans text-sm font-black uppercase text-foreground">
								{project.title}
							</h1>
							<p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">
								{project.subtitle}
							</p>
						</div>
						<Link
							href={`/projects#${project.title.toLowerCase().replace(/\s+/g, "-")}`}
							prefetch={true}
							className="inline-flex items-center gap-1.5 border-[2px] border-border bg-muted hover:bg-muted/70 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-foreground transition-all duration-200 cursor-pointer shadow-xs active:translate-x-0 active:translate-y-0 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-sm"
						>
							Read Documentation <FiExternalLink size={12} />
						</Link>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
