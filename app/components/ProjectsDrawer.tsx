"use client";

import { arc, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FiFolder } from "react-icons/fi";
import { type Project, profile } from "@/app/data/profile";
import GenieModal from "./GenieModal";
import CardFooter from "./ui/CardFooter";
import CardHeader from "./ui/CardHeader";
import RetroCard from "./ui/RetroCard";
import SharedVideoPreview from "./ui/SharedVideoPreview";

interface ProjectsDrawerProps {
	className?: string;
	delay?: number;
	style?: React.CSSProperties;
}

export default function ProjectsDrawer({
	className = "",
	delay = 0.6,
	style,
}: ProjectsDrawerProps) {
	const router = useRouter();
	const [activeProject, setActiveProject] = useState<Project | null>(null);
	const [isMaximized, setIsMaximized] = useState(false);
	const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
	const prevProjectRef = useRef<Project | null>(null);
	const isInitialMount = useRef(true);
	const isNavigatingAway = useRef(false);

	// Proactively prefetch destination routes into memory on mount for instant navigation
	useEffect(() => {
		router.prefetch("/");
		router.prefetch("/projects");
	}, [router]);

	// Helper to extract YouTube ID from standard URL
	const getYoutubeId = (url: string) => {
		if (url.includes("youtu.be/")) {
			return url.split("youtu.be/")[1];
		}
		return "";
	};

	// Safely sync desktop activeProject state with browser URL History API
	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			prevProjectRef.current = activeProject;
			return;
		}

		if (activeProject) {
			isNavigatingAway.current = false;
			const targetUrl = `/projects/${activeProject.title.toLowerCase().replace(/\s+/g, "-")}`;
			if (window.location.pathname !== targetUrl) {
				window.history.pushState({ modal: activeProject.title }, "", targetUrl);
			}
		} else if (prevProjectRef.current && !isNavigatingAway.current) {
			// Only push "/" if a previously open modal in this session was just closed
			if (window.location.pathname.startsWith("/projects/")) {
				window.history.pushState({}, "", "/");
			}
		}

		prevProjectRef.current = activeProject;
	}, [activeProject]);

	// Listen to browser back/forward buttons once on mount
	useEffect(() => {
		const handlePopState = () => {
			setActiveProject(null);
			setTriggerRect(null);
		};

		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, []);


	return (
		<>
			<RetroCard
				accentColor="var(--color-accent-secondary)"
				paddingX="px-4 xl:px-desktop-sm"
				paddingTop="pt-4 xl:pt-desktop-sm"
				paddingBottom="pb-4 xl:pb-desktop-sm"
				delay={delay}
				className={className}
				style={style}
				header={
					<CardHeader
						icon={<FiFolder size={14} aria-hidden="true" />}
						accentColor="var(--color-accent-secondary)"
						title="PROJECTS CABINET"
						badge="v2.0"
						badgeTextColor="text-white"
						pulse
					/>
				}
				footer={
					<CardFooter
						left={`items: ${profile.projects.length}`}
						right="SYS_READY"
					/>
				}
			>
				{/* Scrollable list inside */}
				<div className="mt-3 flex flex-col gap-4 relative z-10 w-full">
					{profile.projects.map((proj) => {
						const videoId = getYoutubeId(proj.links.demo || "");
						const slug = proj.title.toLowerCase().replace(/\s+/g, "-");
						const projectPath = `/projects/${slug}`;

						return (
							<div
								key={proj.title}
								className="flex flex-col gap-1.5 pb-3 border-b border-border/10 last:border-b-0 last:pb-0"
							>
								{/* Title + Subtitle */}
								<div>
									<Link
										href={projectPath}
										onClick={(e) => {
											e.preventDefault();
											setActiveProject(proj);
											setIsMaximized(false);
										}}
										className="group inline-block"
										title={`Open ${proj.title}`}
									>
										<h2 className="font-sans text-desktop-sm font-bold uppercase text-foreground text-left group-hover:text-[var(--color-accent-secondary)] transition-colors">
											{proj.title}
										</h2>
									</Link>
									<p className="text-desktop-2xs text-muted-foreground font-semibold uppercase tracking-wider text-left">
										{proj.subtitle}
									</p>
								</div>

								{/* Clean Video Preview Frame */}
								{videoId && (
									<motion.button
										layoutId={`project-window-${proj.title}`}
										transition={{ layout: { path: arc({ direction: "cw" }) } }}
										onClick={() => {
											setActiveProject(proj);
											setIsMaximized(false);
										}}
										className="w-full aspect-video relative overflow-hidden bg-border border-[3px] border-border cursor-pointer transition-all duration-200 group"
									>
										<SharedVideoPreview
											projectFileName={proj.title.toLowerCase() === "jansamadhan" ? "jansamadhan" : "nyayaai"}
											className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
										/>

										{/* Invisible pointer interceptor overlay */}
										<div className="absolute inset-0 z-10 bg-transparent" />

										{/* Hover expand indicator */}
										<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 z-20">
											<span className="bg-background text-foreground border-[2px] border-border px-2 py-0.5 text-desktop-2xs font-black uppercase tracking-widest">
												EXPAND MONITOR
											</span>
										</div>
									</motion.button>
								)}

								{/* View Details link — bottom right */}
								<div className="flex justify-end">
									<Link
										href={`/projects#${slug}`}
										className="inline-flex items-center gap-0.5 text-desktop-2xs font-bold uppercase tracking-widest text-muted-foreground hover:text-[var(--color-accent-secondary)] transition-colors"
										title={`View ${proj.title} project details`}
									>
										View Details ↗
									</Link>
								</div>
							</div>
						);
					})}
				</div>
			</RetroCard>

			{/* Retro OS Lightbox Modal with Genie Warp */}
			<GenieModal
				isOpen={!!activeProject}
				triggerRect={triggerRect}
				onClose={(navigating?: boolean) => {
					if (navigating) isNavigatingAway.current = true;
					setActiveProject(null);
					setTriggerRect(null);
				}}
				isMaximized={isMaximized}
				setIsMaximized={setIsMaximized}
				project={activeProject}
			/>
		</>
	);
}
