"use client";

import { motion } from "framer-motion";
import { FiAward, FiBookOpen, FiExternalLink } from "react-icons/fi";
import { profile } from "@/app/data/profile";

export default function AboutView() {
	return (
		<main className="flex-1 bg-background overflow-x-clip">
			<div className="w-full max-w-2xl xl:max-w-4xl mx-auto px-6 pt-16 pb-[calc(var(--spacing-fluid-xl)+var(--spacing-fluid-md)+2.75rem)] xl:pb-16 border-x-[3px] xl:border-x-0 border-border grow flex flex-col">
				<div className="text-center space-y-2 mb-fluid-md xl:mb-10">
					<p className="text-xs text-accent font-bold uppercase tracking-widest">
						How I Build
					</p>
					<h1 className="font-sans text-4xl xl:text-5xl font-black text-foreground uppercase tracking-tight">
						About
					</h1>
				</div>

				<div className="space-y-12 xl:space-y-16">
					<section>
						<motion.div
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							className="bg-card text-card-foreground border-[3px] border-border shadow-md p-6 xl:p-8"
						>
							<p className="text-sm xl:text-base text-muted-foreground leading-relaxed">
								{profile.about[0]}
							</p>
						</motion.div>
					</section>

					<section>
						<div className="text-center space-y-2 mb-8">
							<p className="text-xs text-accent font-bold uppercase tracking-widest">
								Recognition
							</p>
							<h2 className="font-sans text-4xl xl:text-5xl font-black text-foreground uppercase tracking-tight">
								Achievements
							</h2>
						</div>
						<div className="space-y-6">
							{profile.achievements.map((ach, i) => (
								<motion.div
									key={ach.title}
									initial={{ opacity: 0, x: -16 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: i * 0.2 }}
									className="flex items-start gap-4 bg-card text-card-foreground border-[3px] border-border shadow-md p-6"
								>
									<div className="w-10 h-10 bg-accent-warning text-black flex items-center justify-center flex-shrink-0 mt-0.5 border-[2px] border-border">
										<FiAward size={20} />
									</div>
									<div className="flex-1">
										<h3 className="font-sans text-base font-bold text-foreground uppercase">
											{ach.title}
										</h3>
										<p className="text-sm text-muted-foreground mt-1 leading-relaxed">
											{ach.detail}
										</p>
										<a
											href={ach.certificate}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-accent-secondary hover:text-foreground transition-colors mt-2"
										>
											View Certificate <FiExternalLink size={12} />
										</a>
									</div>
								</motion.div>
							))}
						</div>
					</section>

					<section>
						<div className="text-center space-y-2 mb-8">
							<p className="text-xs text-accent font-bold uppercase tracking-widest">
								Academic Background
							</p>
							<h2 className="font-sans text-4xl xl:text-5xl font-black text-foreground uppercase tracking-tight">
								Education
							</h2>
						</div>
						<div className="space-y-6">
							{profile.education.map((edu, i) => (
								<motion.div
									key={edu.institution}
									initial={{ opacity: 0, y: 16 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.2 }}
									className="flex items-start gap-4 bg-card text-card-foreground border-[3px] border-border shadow-md p-6"
								>
									<div className="w-10 h-10 bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0 mt-0.5 border-[2px] border-border">
										<FiBookOpen size={20} />
									</div>
									<div className="flex-1">
										<h3 className="font-sans text-base font-bold text-foreground uppercase">
											{edu.institution}
										</h3>
										<p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">
											{edu.degree}
										</p>
										<span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
											{edu.period}
										</span>
									</div>
								</motion.div>
							))}
						</div>
					</section>
				</div>
			</div>
		</main>
	);
}
