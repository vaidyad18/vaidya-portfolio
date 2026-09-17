import { profile } from "@/app/data/profile";
import { skillIconMap } from "@/app/lib/skillIcons";

const allSkills = Object.values(profile.skills)
	.flat()
	.map((name) => ({
		name,
		icon: skillIconMap[name] ?? null,
	}));

export default function MobileSkillStrip() {
	const duplicated = [...allSkills, ...allSkills];

	return (
		<div className="flex marquee gap-3 items-center">
			{duplicated.map((skill, i) => (
				<div
					key={`${skill.name}-${i}`}
					role="img"
					className="flex items-center justify-center w-10 h-10 shrink-0 bg-background border-[2px] border-border shadow-sm text-foreground text-xl"
					aria-label={skill.name}
				>
					<span aria-hidden="true" className="flex items-center justify-center">
						{skill.icon}
					</span>
				</div>
			))}
		</div>
	);
}
