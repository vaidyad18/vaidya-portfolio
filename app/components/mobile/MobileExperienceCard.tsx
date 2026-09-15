import { profile } from "@/app/data/profile";
import Link from "next/link";
import { FiTerminal, FiFileText, FiAward, FiArrowUpRight } from "react-icons/fi";

type Experience = typeof profile.experience[0];

interface MobileExperienceCardProps {
	experience: Experience;
}

export default function MobileExperienceCard({ experience }: MobileExperienceCardProps) {
	// Determine how many buttons exist to calculate grid columns
	const hasOffer = !!experience.offerLetter;
	const hasCompletion = !!experience.completionLetter;
	const buttonCount = 1 + (hasOffer ? 1 : 0) + (hasCompletion ? 1 : 0); // Always has "Details"

	return (
		<div className="w-full h-full flex flex-col justify-between bg-card border border-border/50 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] p-fluid-md gap-fluid-sm relative">
			{/* Card Header Equivalent */}
			<div className="flex items-center gap-fluid-xs border-b-2 border-border pb-fluid-xs shrink-0">
				<FiTerminal className="w-[1.5em] h-[1.5em] text-[var(--color-accent-warning)]" />
				<span className="font-sans text-caption font-bold uppercase tracking-widest text-[var(--color-accent-warning)]">
					EXPERIENCE
				</span>
			</div>

			{/* Title & Subtitle */}
			<div className="flex flex-col gap-fluid-xs shrink-0">
				<h2 className="font-sans font-bold uppercase text-foreground text-body leading-tight">
					{experience.company}
				</h2>
				<p className="text-muted-foreground font-semibold uppercase tracking-wider text-caption">
					{experience.role}
				</p>
			</div>

			{/* Description */}
			<p className="text-small text-foreground/80 leading-snug flex-1 min-h-0 overflow-y-auto overscroll-contain">
				{experience.description}
			</p>

			{/* Isolated Footer */}
			<div className="border-t-2 border-border mt-fluid-sm pt-fluid-md flex gap-fluid-sm shrink-0">
				{hasOffer && (
					<a
						href={experience.offerLetter}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="View Offer Letter"
						className="flex items-center justify-center w-12 h-12 bg-background border-2 border-border shadow-[2px_2px_0_0_var(--color-border)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150 text-foreground"
					>
						<FiFileText size="1.25rem" />
					</a>
				)}
				
				{hasCompletion && (
					<a
						href={experience.completionLetter}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="View Completion Letter"
						className="flex items-center justify-center w-12 h-12 bg-background border-2 border-border shadow-[2px_2px_0_0_var(--color-border)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150 text-[var(--color-accent-warning)]"
					>
						<FiAward size="1.25rem" />
					</a>
				)}

				<Link
					href="/experience"
					aria-label="View Experience Details"
					className="flex items-center justify-center w-12 h-12 ml-auto bg-background border-2 border-border shadow-[2px_2px_0_0_var(--color-border)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150 text-foreground"
				>
					<FiArrowUpRight size="1.25rem" />
				</Link>
			</div>
		</div>
	);
}
