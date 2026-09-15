"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiExternalLink, FiGithub, FiYoutube, FiArrowUpRight } from "react-icons/fi";
import MagneticWrap from "@/app/components/MagneticWrap";
import { profile } from "@/app/data/profile";

const stagger = {
	hidden: { opacity: 0, y: 24 },
	show: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			type: "spring" as const,
			stiffness: 120,
			damping: 14,
			delay: i * 0.15,
		},
	}),
};

export default function ProjectsView() {
	useEffect(() => {
		const scrollToHash = () => {
			const rawHash = window.location.hash.replace("#", "").toLowerCase();
			if (!rawHash) return;

			// Direct ID match
			let el = document.getElementById(rawHash);

			// Dynamic fallback match (e.g. #jansamadhan, #nyaya)
			if (!el) {
				const elements = document.querySelectorAll<HTMLElement>("[id]");
				for (const element of elements) {
					if (element.id && (element.id.includes(rawHash) || rawHash.includes(element.id))) {
						el = element;
						break;
					}
				}
			}

			if (el) {
				el.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		};

		// Scroll immediately if present, and retry slightly after framer-motion staggered mount
		scrollToHash();
		const t1 = setTimeout(scrollToHash, 100);
		const t2 = setTimeout(scrollToHash, 350);

		window.addEventListener("hashchange", scrollToHash);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
			window.removeEventListener("hashchange", scrollToHash);
		};
	}, []);
	return (
		<main className="flex-1 bg-background overflow-x-clip">
			<div className="w-full max-w-2xl xl:max-w-4xl mx-auto px-6 pt-16 pb-[calc(var(--spacing-fluid-xl)+var(--spacing-fluid-md)+2.75rem)] xl:pb-16 border-x-[3px] xl:border-x-0 border-border grow flex flex-col">
				<div className="text-center space-y-2 mb-12">
					<p className="text-xs text-accent font-bold uppercase tracking-widest">
						What I&apos;ve Built
					</p>
					<h1 className="font-sans text-4xl xl:text-5xl font-black text-foreground uppercase tracking-tight">
						Projects
					</h1>
				</div>

				<div className="space-y-8">
					{profile.projects.map((proj, i) => {
						const slug = proj.title.toLowerCase().replace(/\s+/g, "-");
						const projectPath = `/projects/${slug}`;

						return (
							<motion.div
								key={proj.title}
								id={slug}
								variants={stagger}
								initial="hidden"
								animate="show"
								custom={i}
								whileHover={{ y: -5 }}
								className="bg-card text-card-foreground border-[3px] border-border shadow-md p-6 xl:p-8 flex flex-col cursor-default scroll-mt-24"
							>
								<div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-2 mb-4">
									<div>
										<Link
											href={projectPath}
											className="group inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
											title={`View ${proj.title} dedicated project page`}
										>
											<h2 className="font-sans text-xl font-bold text-foreground uppercase group-hover:text-accent-secondary transition-colors">
												{proj.title}
											</h2>
											<FiArrowUpRight
												size={18}
												className="text-muted-foreground group-hover:text-accent-secondary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
												aria-hidden="true"
											/>
										</Link>
										<p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
											{proj.subtitle}
										</p>
									</div>
									<div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
										<span>{proj.period}</span>
									</div>
								</div>

								<p className="text-sm text-muted-foreground mb-4 leading-relaxed italic">
									{proj.description}
								</p>

								<div className="flex flex-wrap gap-2 mb-4">
									{proj.tech.map((t) => (
										<span
											key={t}
											className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border-[2px] border-border"
										>
											{t}
										</span>
									))}
								</div>

								<ul className="space-y-2 mb-6 flex-1">
									{proj.highlights.map((h, j) => (
										<li
											key={j}
											className="text-sm text-muted-foreground leading-relaxed pl-4 border-l-[3px] border-border"
										>
											{h}
										</li>
									))}
								</ul>

								<div className="flex flex-wrap items-center gap-4 pt-4 border-t-[3px] border-border">
									{proj.links.live && (
										<MagneticWrap>
											<a
												href={proj.links.live}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-foreground hover:text-accent-secondary transition-colors"
											>
												<FiExternalLink size={14} /> Live
											</a>
										</MagneticWrap>
									)}
									{proj.links.github && (
										<MagneticWrap>
											<a
												href={proj.links.github}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-foreground hover:text-accent-secondary transition-colors"
											>
												<FiGithub size={14} /> GitHub
											</a>
										</MagneticWrap>
									)}
									{proj.links.demo && (
										<MagneticWrap>
											<a
												href={proj.links.demo}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-foreground hover:text-accent-secondary transition-colors"
											>
												<FiYoutube size={14} /> Demo
											</a>
										</MagneticWrap>
									)}
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>
		</main>
	);
}
