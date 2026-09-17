import {
	getGfgData,
	getCommitFeed,
	getGithubData,
	getLeetcodeData,
} from "@/app/lib/api-fetchers";
import AnimatedCell from "../AnimatedCell";
import GfgWidget from "../GfgWidget";
import CommitFeed from "../CommitFeed";
import ExperienceCard from "../ExperienceCard";
import GithubCalendar from "../GithubCalendar";
import GithubStatsWidget from "../GithubStatsWidget";
import LeetCodeWidget from "../LeetCodeWidget";
import ProjectsDrawer from "../ProjectsDrawer";

export default async function DesktopGrid() {
	const [githubData, leetcodeData, gfgData, commits] = await Promise.all([
		getGithubData(),
		getLeetcodeData(),
		getGfgData(),
		getCommitFeed(),
	]);

	return (
		<>
			<div className="hidden xl:flex h-full min-h-0 flex-col clip-margin-5">
				<ExperienceCard delay={0.5} />
			</div>
			<div className="hidden xl:flex h-full min-h-0 flex-col clip-margin-5">
				<ProjectsDrawer delay={0.6} />
			</div>
			<div className="hidden xl:flex h-full min-h-0 flex-col clip-margin-5">
				<CommitFeed delay={0.7} commits={commits} />
			</div>
			<div className="hidden xl:flex h-full min-h-0 flex-col clip-margin-5">
				<AnimatedCell
					delay={0.5}
					className="h-full w-full flex flex-col justify-end"
				>
					<GithubCalendar
						githubData={githubData}
						leetcodeData={leetcodeData?.calendar || {}}
						gfgData={gfgData?.calendar || {}}
					/>
				</AnimatedCell>
			</div>
			<div className="hidden xl:flex h-full min-h-0 flex-col clip-margin-5">
				<LeetCodeWidget delay={0.55} lcData={leetcodeData} />
			</div>
			<div className="hidden xl:flex h-full min-h-0 flex-col clip-margin-5">
				<GfgWidget delay={0.65} gfgData={gfgData} />
			</div>
			<div className="hidden xl:flex h-full min-h-0 flex-col clip-margin-5">
				<GithubStatsWidget delay={0.75} githubData={githubData} />
			</div>
		</>
	);
}
