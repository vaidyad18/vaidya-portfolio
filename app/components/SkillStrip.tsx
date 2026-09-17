"use client";

import { profile } from "@/app/data/profile";
import { skillIconMap } from "@/app/lib/skillIcons";

const allSkills = Object.values(profile.skills)
	.flat()
	.map((name) => ({
		name,
		icon: skillIconMap[name] ?? null,
	}));

export default function SkillStrip() {
	const duplicated = [...allSkills, ...allSkills];

	return (
		<div className="w-full overflow-hidden border-y-[3px] border-border bg-muted py-3">
			<div className="flex marquee gap-6 items-center">
				{duplicated.map((skill, i) => (
					<div
						key={`${skill.name}-${i}`}
						className="flex items-center gap-2 px-4 py-2 bg-background border-[2px] border-border shadow-sm whitespace-nowrap"
					>
						<span className="text-foreground text-lg" aria-hidden="true">
							{skill.icon}
						</span>
						<span className="text-xs font-bold text-foreground uppercase tracking-wider">
							{skill.name}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
