"use client";
import type {
	GithubData,
} from "@/app/lib/schemas";
import GithubCalendarUI from "./GithubCalendarUI";

interface GithubCalendarProps {
	githubData: GithubData;
	leetcodeData: Record<string, number>;
	codeforcesData: Record<string, number>;
}

export default function GithubCalendar({
	githubData,
	leetcodeData,
	codeforcesData,
}: GithubCalendarProps) {
	return (
		<GithubCalendarUI
			githubData={githubData}
			leetcodeData={leetcodeData}
			codeforcesData={codeforcesData}
		/>
	);
}

export function GithubCalendarSkeleton() {
	return (
		<div className="w-full h-full p-6 flex flex-col bg-background/50 border-2 border-muted/20 animate-pulse">
			<div className="flex items-center gap-2 mb-4">
				<div className="h-5 w-5 rounded bg-muted/50"></div>
				<div className="h-5 w-32 rounded bg-muted/50"></div>
			</div>
			<div className="flex-1 w-full grid grid-cols-[repeat(auto-fill,minmax(12px,1fr))] gap-1 content-start">
				{Array.from({ length: 60 }).map((_, i) => (
					<div
						key={i}
						className="aspect-square rounded-[2px] bg-muted/30"
					></div>
				))}
			</div>
		</div>
	);
}
