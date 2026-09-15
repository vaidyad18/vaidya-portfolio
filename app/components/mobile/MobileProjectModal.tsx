"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/app/data/profile";
import { getYouTubeEmbedUrl } from "@/app/lib/youtube";
import SharedVideoPreview from "../ui/SharedVideoPreview";
import Logo from "../ui/Logo";
import ModalNavBar from "./ModalNavBar";
import MobileActionRow from "./MobileActionRow";

interface MobileProjectModalProps {
	project: Project;
	allProjects: Project[];
	onClose?: () => void;
	onSelectProject?: (project: Project) => void;
	isDirect?: boolean;
}

const MOBILE_VIDEO_MAP: Record<string, string> = {
	jansamadhan: "jansamadhan",
	nyayaai: "nyayaai",
};

export default function MobileProjectModal({
	project,
	allProjects,
	onClose,
	onSelectProject,
	isDirect,
}: MobileProjectModalProps) {
	const router = useRouter();
	const otherProjects = allProjects.filter((p) => p.title !== project.title);
	const youtubeEmbedUrl = getYouTubeEmbedUrl(project.links.demo);

	// Proactively prefetch destination routes into memory on mount for instant navigation
	useEffect(() => {
		router.prefetch("/");
		router.prefetch("/projects");
	}, [router]);

	return (
		<div className="xl:hidden">
			<div
				onClick={() => {
					if (onClose) {
						onClose();
					} else {
						router.push("/");
					}
				}}
				className="fixed inset-0 z-[9999] flex justify-center bg-background/95 backdrop-blur-sm cursor-zoom-out"
			>
				{/* Inner Modal Shell (Column Cap) */}
				<article
					onClick={(e) => e.stopPropagation()}
					className="@container w-full max-w-2xl h-full flex flex-col bg-background shadow-2xl relative cursor-default overflow-y-auto overscroll-contain border-x-2 border-border [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
				>
					{/* 1. Video Player */}
					<figure className="w-full aspect-video bg-muted border-b-2 border-border shrink-0">
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
								projectFileName={MOBILE_VIDEO_MAP[project.title.toLowerCase()] || project.title.toLowerCase()}
								className="w-full h-full object-cover"
							/>
						)}
					</figure>

					{/* 2. Dedicated Title Block */}
					<header className="px-fluid-sm pt-fluid-md pb-fluid-xs shrink-0 min-w-0">
						<h1
							className="font-sans font-bold uppercase text-body text-foreground break-words"
							style={{ overflowWrap: "anywhere" }}
						>
							{project.title}
						</h1>
						{project.subtitle && (
							<p className="font-sans text-caption text-muted-foreground mt-fluid-xs">
								{project.subtitle}
							</p>
						)}
					</header>

					{/* 3. Channel & Action Row */}
					<section className="flex items-end justify-between px-fluid-sm pt-fluid-md pb-fluid-xs border-b-2 border-border shrink-0">
						{/* Left: Profile & Name */}
						{onClose ? (
							<button
								type="button"
								onClick={onClose}
								className="flex items-center gap-fluid-sm min-w-0 group cursor-pointer"
							>
								<div className="w-[var(--spacing-fluid-xl-val)] h-[var(--spacing-fluid-xl-val)] rounded-full bg-foreground shrink-0 flex items-center justify-center p-[var(--spacing-fluid-xs-val)] overflow-hidden">
									<Logo className="w-full h-full text-background group-hover:scale-110 transition-transform duration-300" />
								</div>
								<span className="font-sans capitalize text-small text-foreground truncate min-w-0 group-hover:text-[var(--color-accent-warning)] transition-colors">
									Medhansh
								</span>
							</button>
						) : (
							<Link href="/" className="flex items-center gap-fluid-sm min-w-0 group">
								<div className="w-[var(--spacing-fluid-xl-val)] h-[var(--spacing-fluid-xl-val)] rounded-full bg-foreground shrink-0 flex items-center justify-center p-[var(--spacing-fluid-xs-val)] overflow-hidden">
									<Logo className="w-full h-full text-background group-hover:scale-110 transition-transform duration-300" />
								</div>
								<span className="font-sans capitalize text-small text-foreground truncate min-w-0 group-hover:text-[var(--color-accent-warning)] transition-colors">
									Medhansh
								</span>
							</Link>
						)}

						{/* Right: Actions */}
						<MobileActionRow
							url={project.links?.demo || ""}
							projectName={project.title}
							videoFileName={MOBILE_VIDEO_MAP[project.title.toLowerCase()] || project.title.toLowerCase()}
						/>
					</section>

					{/* 4. Other Projects List */}
					<aside className="flex flex-col gap-fluid-md pt-fluid-md pb-fluid-xl shrink-0">
						{otherProjects.map((p) =>
							onSelectProject ? (
								<button
									type="button"
									key={p.title}
									onClick={() => onSelectProject(p)}
									className="flex flex-col min-w-0 text-left cursor-pointer active:opacity-80 transition-opacity"
								>
									<article className="flex flex-col min-w-0 w-full">
										{/* Large Static Thumbnail */}
										<div className="w-full aspect-video bg-muted border-y-2 border-border overflow-hidden relative">
											<Image
												src={`/videos/${MOBILE_VIDEO_MAP[p.title.toLowerCase()] || p.title.toLowerCase()}.webp`}
												alt={`${p.title} — ${p.subtitle || "AI Project Architecture Preview"}`}
												fill
												sizes="(max-width: 768px) 100vw, 42rem"
												className="object-cover"
											/>
										</div>
										{/* Title & Desc Underneath */}
										<div className="flex gap-fluid-sm p-fluid-md pt-fluid-sm min-w-0">
											<div className="w-[var(--spacing-fluid-xl-val)] h-[var(--spacing-fluid-xl-val)] rounded-full bg-foreground shrink-0 flex items-center justify-center p-[var(--spacing-fluid-xs-val)] overflow-hidden">
												<Logo className="w-full h-full text-background group-hover:scale-110 transition-transform duration-300" />
											</div>
											<div className="flex flex-col min-w-0">
												<h5 className="font-sans font-bold uppercase text-small text-foreground truncate">
													{p.title}
												</h5>
												<p className="font-sans text-caption text-muted-foreground truncate">
													{p.subtitle}
												</p>
											</div>
										</div>
									</article>
								</button>
							) : (
								<Link
									key={p.title}
									href={`/projects/${p.title.toLowerCase()}`}
									scroll={false}
									className="flex flex-col min-w-0"
								>
									<article className="flex flex-col min-w-0">
										{/* Large Static Thumbnail */}
										<div className="w-full aspect-video bg-muted border-y-2 border-border overflow-hidden relative">
											<Image
												src={`/videos/${MOBILE_VIDEO_MAP[p.title.toLowerCase()] || p.title.toLowerCase()}.webp`}
												alt={`${p.title} — ${p.subtitle || "AI Project Architecture Preview"}`}
												fill
												sizes="(max-width: 768px) 100vw, 42rem"
												className="object-cover"
											/>
										</div>
										{/* Title & Desc Underneath */}
										<div className="flex gap-fluid-sm p-fluid-md pt-fluid-sm min-w-0">
											<div className="w-[var(--spacing-fluid-xl-val)] h-[var(--spacing-fluid-xl-val)] rounded-full bg-foreground shrink-0 flex items-center justify-center p-[var(--spacing-fluid-xs-val)] overflow-hidden">
												<Logo className="w-full h-full text-background group-hover:scale-110 transition-transform duration-300" />
											</div>
											<div className="flex flex-col min-w-0">
												<h5 className="font-sans font-bold uppercase text-small text-foreground truncate">
													{p.title}
												</h5>
												<p className="font-sans text-caption text-muted-foreground truncate">
													{p.subtitle}
												</p>
											</div>
										</div>
									</article>
								</Link>
							),
						)}
					</aside>

					{/* 5. Sticky Android Nav Bar */}
					<ModalNavBar onClose={onClose} isDirect={isDirect} />
				</article>
			</div>
		</div>
	);
}
