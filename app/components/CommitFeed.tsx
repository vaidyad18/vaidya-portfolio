"use client";
import { FiGitCommit, FiGithub } from "react-icons/fi";

import CardFooter from "./ui/CardFooter";
import CardHeader from "./ui/CardHeader";
import RetroCard from "./ui/RetroCard";

interface Commit {
	id: string;
	repo: string;
	message: string;
	date: string;
	link: string;
}

export interface CommitFeedProps {
	commits?: Commit[];
	className?: string;
	delay?: number;
	style?: React.CSSProperties;
}

const cleanRepoName = (name: string) => {
	const slash = name.lastIndexOf("/");
	return slash >= 0 ? name.slice(slash + 1) : name;
};

export default function CommitFeed({
	commits = [],
	className = "",
	delay = 0.7,
	style,
}: CommitFeedProps) {

	if (commits.length === 0)
		return (
			<RetroCard
				accentColor="var(--color-accent)"
				paddingX="px-4 xl:px-desktop-sm"
				paddingTop="pt-4 xl:pt-desktop-sm"
				paddingBottom="pb-4 xl:pb-desktop-sm"
				delay={delay}
				className={className}
				style={style}
				header={
					<CardHeader
						icon={<FiGitCommit size={14} />}
						accentColor="var(--color-accent)"
						title="LIVE ACTIVITY"
						badge={<FiGithub size={11} />}
						badgeHref="https://github.com/Medhansh-741"
						badgeAriaLabel="View Medhansh Kapoor's GitHub Profile"
						pulse
					/>
				}
				footer={<CardFooter left="@Medhansh-741" right="LIVE_FEED" />}
			>
				<p className="mt-3 min-h-[180px] flex items-center justify-center text-desktop-xs font-semibold text-muted-foreground">
					No recent commits
				</p>
			</RetroCard>
		);

	const displayCommits = [...commits];

	return (
		<RetroCard
			accentColor="var(--color-accent)"
			paddingX="px-4 xl:px-desktop-sm"
			paddingTop="pt-4 xl:pt-desktop-sm"
			paddingBottom="pb-4 xl:pb-desktop-sm"
			delay={delay}
			className={className}
			style={style}
			header={
				<CardHeader
					icon={<FiGitCommit size={14} aria-hidden="true" />}
					accentColor="var(--color-accent)"
					title="LIVE ACTIVITY"
					badge={<FiGithub size={11} aria-hidden="true" />}
					badgeHref="https://github.com/Medhansh-741"
					badgeAriaLabel="View Medhansh Kapoor's GitHub Profile"
					pulse
				/>
			}
			footer={<CardFooter left="@Medhansh-741" right="LIVE_FEED" />}
		>
			{/* Timeline Viewport Container */}
			<div
				className="mt-3 relative pr-1 w-full overflow-hidden flex-1 min-h-[180px]"
				style={{
					maskImage: "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)",
					WebkitMaskImage: "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)"
				}}
			>
				<div className="absolute left-[9px] top-1 bottom-1 w-0.5 border-l-[2px] border-dashed border-muted z-0" />

				<div className="marquee-vertical gap-4 py-1">
					{[...displayCommits, ...displayCommits].map((commit, idx) => (
						<a
							key={`c1-${commit.id}-${idx}`}
							href={commit.link}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-start relative group cursor-pointer text-left"
						>
							<div className="w-5 h-5 rounded-full border-[2px] border-border bg-card flex items-center justify-center z-10 flex-shrink-0">
								<div className="w-1.5 h-1.5 rounded-full bg-accent-secondary" />
							</div>
							<div className="flex-1 ml-3 min-w-0">
								<p className="text-desktop-2xs font-black uppercase tracking-wider text-muted-foreground truncate leading-none mb-1">
									{cleanRepoName(commit.repo)}
								</p>
								<p className="text-desktop-xs font-bold leading-tight text-foreground truncate group-hover:text-accent-secondary group-hover:underline">
									{commit.message}
								</p>
							</div>
						</a>
					))}
				</div>
			</div>
		</RetroCard>
	);
}

export function CommitFeedSkeleton({
	delay = 0.7,
	className = "",
	style,
}: CommitFeedProps) {
	return (
		<RetroCard
			accentColor="var(--color-accent)"
			paddingX="px-4 xl:px-desktop-sm"
			paddingTop="pt-4 xl:pt-desktop-sm"
			paddingBottom="pb-4 xl:pb-desktop-sm"
			delay={delay}
			className={className}
			style={style}
			header={
				<div>
					<div className="flex justify-between items-center pb-2 border-b border-border/10">
						<div className="w-24 h-3 bg-muted rounded" />
						<div className="w-8 h-4 bg-muted rounded" />
					</div>
				</div>
			}
			footer={
				<div className="border-t border-border/10 pt-2 flex justify-between items-center">
					<div className="w-20 h-2.5 bg-muted rounded" />
					<div className="w-16 h-2.5 bg-muted rounded" />
				</div>
			}
		>
			<div className="animate-pulse h-full">
				<div className="relative mt-3">
					<div className="absolute left-[9px] top-1.5 bottom-1.5 w-0.5 border-l-[2px] border-dashed border-muted" />
					<div className="flex flex-col gap-4">
						{[...Array(4)].map((_, i) => (
							<div key={i} className="flex items-start">
								<div className="w-5 h-5 rounded-full bg-muted border-[2px] border-border flex-shrink-0" />
								<div className="flex-1 ml-3 space-y-1.5">
									<div className="w-16 h-2 bg-muted rounded" />
									<div className="w-full h-3.5 bg-muted rounded" />
									<div className="w-12 h-2.5 bg-muted rounded" />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</RetroCard>
	);
}
