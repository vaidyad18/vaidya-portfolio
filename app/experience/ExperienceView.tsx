"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
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
			delay: i * 0.18,
		},
	}),
};

export default function ExperienceView() {
	useEffect(() => {
		const scrollToHash = () => {
			const rawHash = window.location.hash.replace("#", "").toLowerCase();
			if (!rawHash) return;

			// Direct ID match
			let el = document.getElementById(rawHash);

			// Dynamic fallback match (e.g. #drdo matching #issa-drdo or #meity matching #indiaai-mission-meity)
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
						Where I&apos;ve Worked
					</p>
					<h1 className="font-sans text-4xl xl:text-5xl font-black text-foreground uppercase tracking-tight">
						Experience
					</h1>
				</div>

				<div className="space-y-8">
					{profile.experience.map((exp, i) => {
						const slug = exp.company.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

						return (
							<motion.div
								key={exp.company}
								id={slug}
								variants={stagger}
								initial="hidden"
								animate="show"
								custom={i}
								whileHover={{ y: -3 }}
								className="bg-card text-card-foreground border-[3px] border-border shadow-md p-6 xl:p-8 cursor-default scroll-mt-24"
							>
								<div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-2 mb-4">
									<div>
										<h2 className="font-sans text-xl font-bold text-foreground uppercase">
											{exp.company}
										</h2>
									<p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
										{exp.role}
									</p>
								</div>
								<div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
									<span className="whitespace-nowrap">{exp.period}</span>
									{exp.offerLetter && (
										<MagneticWrap>
											<a
												href={exp.offerLetter}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center gap-1 text-accent-secondary hover:text-foreground transition-colors whitespace-nowrap"
											>
												Offer Letter <FiExternalLink size={12} />
											</a>
										</MagneticWrap>
									)}
									{exp.completionLetter && (
										<MagneticWrap>
											<a
												href={exp.completionLetter}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center gap-1 text-accent-secondary hover:text-foreground transition-colors whitespace-nowrap"
											>
												Completion Letter <FiExternalLink size={12} />
											</a>
										</MagneticWrap>
									)}
								</div>
							</div>

							<p className="text-sm text-muted-foreground mb-4 leading-relaxed italic">
								{exp.description}
							</p>

							<div className="flex flex-wrap gap-2 mb-4">
								{exp.tech.map((t) => (
									<span
										key={t}
										className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border-[2px] border-border"
									>
										{t}
									</span>
								))}
							</div>

							<ul className="space-y-2">
								{exp.highlights.map((h, j) => (
									<li
										key={j}
										className="text-sm text-muted-foreground leading-relaxed pl-4 border-l-[3px] border-border"
									>
										{h}
									</li>
								))}
							</ul>
						</motion.div>
					);
				})}
				</div>

				{/* Visible Date Modified for AI & Search Recency (Phase 5.6) */}
				<div className="mt-8 text-center text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
					<span>Last Updated: August 2026</span>
				</div>
			</div>
		</main>
	);
}
