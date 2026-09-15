import MobileHeroSection from "./MobileHeroSection";
import MobileSkillStrip from "./MobileSkillStrip";
import MobileProjectCard from "./MobileProjectCard";
import MobileExperienceCard from "./MobileExperienceCard";
import MobileContributionGraph from "./MobileContributionGraph";
import { Suspense } from "react";
import { profile } from "@/app/data/profile";
import CardStackEngine from "./CardStackEngine";

export default function MobileHome() {
	return (
		<div className="xl:hidden flex-1 flex flex-col bg-background overflow-x-clip">
			{/* Main Content Column */}
			<div className="@container mx-auto w-full max-w-2xl grow border-x-[3px] border-border flex flex-col pb-[calc(var(--spacing-fluid-xl)+var(--spacing-fluid-md)+2.75rem)] xl:pb-0">
				
				{/* Hook: Hero Section */}
				<div className="px-fluid-sm py-fluid-sm">
					<MobileHeroSection />
				</div>

				{/* Separator: Skills Marquee */}
				<div className="py-fluid-lg w-full overflow-hidden">
					<MobileSkillStrip />
				</div>

				{/* Work: Playing-Card Stack (Engine Phase 2 UI) */}
				<div className="px-fluid-sm pt-fluid-lg pb-fluid-sm flex-1 flex flex-col">
					<CardStackEngine 
						projects={profile.projects}
						experienceCards={profile.experience.map((exp, idx) => (
							<MobileExperienceCard key={`exp-${idx}`} experience={exp} />
						))}
					/>
				</div>

				{/* Proof: Contribution Graph */}
				<div className="px-fluid-sm mt-auto">
					<Suspense
						fallback={
							<div className="w-full flex flex-col gap-3 min-w-0 animate-pulse">
								<div className="flex flex-col gap-2 w-full">
									<div className="flex justify-between items-center w-full">
										<div className="h-3 w-24 bg-muted-foreground/20 rounded" />
										<div className="h-7 w-20 bg-muted-foreground/20 rounded-[1px]" />
									</div>
								</div>
								<div className="w-full h-32 bg-muted/30 border-[3px] border-border shadow-md" />
							</div>
						}
					>
						<MobileContributionGraph />
					</Suspense>
				</div>

			</div>
		</div>
	);
}
