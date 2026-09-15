"use client";

import { FiTerminal } from "react-icons/fi";
import Link from "next/link";
import { profile } from "@/app/data/profile";
import CardFooter from "./ui/CardFooter";
import CardHeader from "./ui/CardHeader";
import RetroCard from "./ui/RetroCard";

interface ExperienceCardProps {
	className?: string;
	delay?: number;
	style?: React.CSSProperties;
}

export default function ExperienceCard({
	className = "",
	delay = 0.5,
	style,
}: ExperienceCardProps) {
	return (
		<RetroCard
			accentColor="var(--color-accent-warning)"
			paddingX="px-3 xl:px-desktop-sm"
			paddingTop="pt-3 xl:pt-desktop-sm"
			paddingBottom="pb-3 xl:pb-desktop-sm"
			delay={delay}
			className={className}
			style={style}
			header={
				<CardHeader
					icon={<FiTerminal size={14} aria-hidden="true" />}
					accentColor="var(--color-accent-warning)"
					title="EXPERIENCE"
					badge="ONLINE"
					pulse
				/>
			}
			footer={
				<CardFooter 
					left="sys_active: true" 
					right={
						<Link 
							href="/experience" 
							className="font-bold hover:text-[var(--color-accent-warning)] hover:underline underline-offset-2 transition-all"
						>
							VIEW DETAILS ?
						</Link>
					} 
				/>
			}
		>
			<div className="mt-2 pt-1 pl-1 flex flex-col gap-2 overflow-y-auto min-h-0 h-full pr-1.5 no-scrollbar">
				{profile.experience.map((exp, idx) => (
					<article 
						key={idx} 
						className="flex flex-col gap-1.5 border-[length:var(--border-fluid)] border-black p-2 bg-muted/20"
					>
						{/* Header */}
						<div className="flex flex-col">
							<h2 className="font-bold uppercase text-[length:var(--text-desktop-sm)] text-foreground leading-tight">
								{exp.company}
							</h2>
							<span className="text-[length:var(--text-desktop-xs)] text-muted-foreground uppercase font-medium mt-0.5">
								{exp.role}
							</span>
						</div>

						{/* Description */}
						<p className="text-[length:var(--text-desktop-xs)] text-foreground/80 leading-snug">
							{exp.description}
						</p>

						{/* Tech Stack */}
						<div className="flex flex-wrap gap-1 mt-1">
							{exp.tech.map((tech) => (
								<span
									key={tech}
									className="text-[length:var(--text-desktop-2xs)] font-mono uppercase font-bold border-[length:var(--border-fluid)] border-black px-1.5 py-0.5 bg-muted"
								>
									{tech}
								</span>
							))}
						</div>

						{/* Actions (Certificates) */}
						{(exp.offerLetter || exp.completionLetter) && (
							<div className="flex gap-1.5 mt-1.5">
								{exp.offerLetter && (
									<a
										href={exp.offerLetter}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-block text-[length:var(--text-desktop-2xs)] font-black uppercase border-[length:var(--border-fluid)] border-black bg-[var(--color-accent-warning)] text-black px-2 py-1 shadow-sm hover:-translate-x-[var(--border-fluid)] hover:-translate-y-[var(--border-fluid)] hover:shadow active:translate-x-[calc(var(--border-fluid)*2)] active:translate-y-[calc(var(--border-fluid)*2)] active:shadow-none transition-all cursor-pointer"
									>
										Offer Letter
									</a>
								)}
								{exp.completionLetter && (
									<a
										href={exp.completionLetter}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-block text-[length:var(--text-desktop-2xs)] font-black uppercase border-[length:var(--border-fluid)] border-black bg-[var(--color-accent-secondary)] text-white px-2 py-1 shadow-sm hover:-translate-x-[var(--border-fluid)] hover:-translate-y-[var(--border-fluid)] hover:shadow active:translate-x-[calc(var(--border-fluid)*2)] active:translate-y-[calc(var(--border-fluid)*2)] active:shadow-none transition-all cursor-pointer"
									>
										Completion
									</a>
								)}
							</div>
						)}
					</article>
				))}
			</div>
		</RetroCard>
	);
}
