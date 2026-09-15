"use client";
import { FiGithub } from "react-icons/fi";
import type { GithubData } from "@/app/lib/schemas";

import CardFooter from "./ui/CardFooter";
import CardHeader from "./ui/CardHeader";
import RetroCard from "./ui/RetroCard";

interface GithubStatsWidgetProps {
	githubData?: GithubData;
	className?: string;
	delay?: number;
	style?: React.CSSProperties;
}

const defaultLanguages = [
	{
		name: "Python",
		shortName: "PY",
		percentage: 65,
		color: "var(--color-accent-secondary)",
	},
	{
		name: "TypeScript",
		shortName: "TS",
		percentage: 25,
		color: "var(--color-accent-warning)",
	},
	{
		name: "C++",
		shortName: "C++",
		percentage: 10,
		color: "var(--color-accent)",
	},
];

export default function GithubStatsWidget({
	githubData,
	className = "",
	delay = 0.75,
	style,
}: GithubStatsWidgetProps) {

	const publicRepos = githubData?.stats?.publicRepos ?? 14;
	const totalStars = githubData?.stats?.totalStars ?? 24;
	const topLanguages =
		githubData?.stats?.topLanguages && githubData.stats.topLanguages.length > 0
			? githubData.stats.topLanguages
			: defaultLanguages;

	const currentYear = new Date().getFullYear().toString();
	const liveCommits = githubData?.total
		? Object.values(githubData.total).reduce(
			(acc: number, count: number) =>
				acc + (typeof count === "number" ? count : 0),
			0,
		)
		: 1248;

	return (
		<RetroCard
			accentColor="var(--color-accent-secondary)"
			paddingX="px-3.5 xl:px-desktop-sm"
			paddingTop="pt-3.5 xl:pt-desktop-sm"
			paddingBottom="pb-3.5 xl:pb-desktop-sm"
			delay={delay}
			className={className}
			style={style}
			header={
				<CardHeader
					icon={<FiGithub size={13} aria-hidden="true" />}
					accentColor="var(--color-accent-secondary)"
					title="GIT ARCHIVE"
					badge="SYNCED"
				/>
			}
			footer={
				<CardFooter
					left={`COMMITS: ${liveCommits.toLocaleString()}`}
					right={`ACTIVE_${currentYear}`}
				/>
			}
		>
			{/* Stats Content */}
			<div className="my-auto flex flex-col gap-2 font-mono">
				<div className="flex justify-between items-baseline">
					<span className="text-desktop-xs font-bold text-muted-foreground uppercase">
						PUBLIC REPOS:
					</span>
					<span className="text-desktop-sm font-black text-foreground">
						{publicRepos}
						<span className="text-desktop-xs text-muted-foreground font-normal">
							{" "}
							/ {totalStars}★
						</span>
					</span>
				</div>

				{/* Language Breakdown */}
				<div className="flex flex-col gap-1.5 text-desktop-2xs font-bold mt-1">
					<span className="text-[length:var(--text-desktop-2xs)] text-muted-foreground uppercase">
						LANGUAGES:
					</span>

					{/* Split stack bar */}
					<div className="w-full h-3 border border-border/20 flex overflow-hidden rounded-[1px] bg-muted">
						{topLanguages.map((lang, idx) => (
							<div
								key={idx}
								className="h-full transition-all duration-300"
								style={{
									width: `${lang.percentage}%`,
									backgroundColor: lang.color,
								}}
								title={`${lang.name}: ${lang.percentage}%`}
							/>
						))}
					</div>

					{/* Labels */}
					<div className="flex justify-between text-[length:var(--text-desktop-2xs)] font-black text-muted-foreground">
						{topLanguages.map((lang, idx) => (
							<span key={idx} className="flex items-center gap-1">
								<span
									className="w-1.5 h-1.5 rounded-full"
									style={{ backgroundColor: lang.color }}
								/>
								{lang.shortName} {lang.percentage}%
							</span>
						))}
					</div>
				</div>
			</div>
		</RetroCard>
	);
}

export function GitArchiveSkeleton({
	delay = 0.75,
	className = "",
	style,
}: GithubStatsWidgetProps) {
	return (
		<RetroCard
			accentColor="var(--color-accent-secondary)"
			paddingX="px-3.5 xl:px-[clamp(0.5rem,1.5vh,0.875rem)]"
			paddingTop="pt-3.5 xl:pt-[clamp(0.5rem,1.5vh,0.875rem)]"
			paddingBottom="pb-3.5 xl:pb-[clamp(0.5rem,1.5vh,0.875rem)]"
			delay={delay}
			className={className}
			style={style}
			header={
				<div>
					<div className="flex justify-between items-center pb-2 border-b border-border/10">
						<div className="w-20 h-3.5 bg-muted rounded" />
						<div className="w-12 h-4 bg-muted rounded" />
					</div>
				</div>
			}
			footer={
				<div className="border-t border-border/10 pt-2 flex justify-between">
					<div className="w-16 h-2.5 bg-muted rounded" />
					<div className="w-12 h-2.5 bg-muted rounded" />
				</div>
			}
		>
			<div className="animate-pulse h-full">
				<div>
					<div className="my-auto space-y-3">
						<div className="h-4 bg-muted rounded w-2/3" />
						<div className="h-3 bg-muted rounded w-full" />
						<div className="flex justify-between">
							<div className="w-10 h-2 bg-muted rounded" />
							<div className="w-10 h-2 bg-muted rounded" />
							<div className="w-10 h-2 bg-muted rounded" />
						</div>
					</div>
				</div>
			</div>
		</RetroCard>
	);
}
