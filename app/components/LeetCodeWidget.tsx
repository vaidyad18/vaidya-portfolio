"use client";
import { FiCode } from "react-icons/fi";
import type { LeetCodeApiResponse } from "@/app/lib/schemas";

import CardFooter from "./ui/CardFooter";
import CardHeader from "./ui/CardHeader";
import RetroCard from "./ui/RetroCard";

interface LeetCodeWidgetProps {
	lcData?: LeetCodeApiResponse;
	className?: string;
	delay?: number;
	style?: React.CSSProperties;
}

interface StatsDifficulty {
	solved: number;
	total: number;
}

export default function LeetCodeWidget({
	lcData,
	className = "",
	delay = 0.55,
	style,
}: LeetCodeWidgetProps) {

	let solved = 0;
	let totalQuestions = 3999;
	const easy: StatsDifficulty = { solved: 0, total: 950 };
	const medium: StatsDifficulty = { solved: 0, total: 2000 };
	const hard: StatsDifficulty = { solved: 0, total: 950 };
	let rating: number | null = null;
	let topPercentage: number | null = null;

	if (lcData?.data) {
		const { allQuestionsCount, matchedUser, userContestRanking } = lcData.data;

		if (Array.isArray(allQuestionsCount)) {
			const all = allQuestionsCount.find((q) => q?.difficulty === "All");
			const e = allQuestionsCount.find((q) => q?.difficulty === "Easy");
			const m = allQuestionsCount.find((q) => q?.difficulty === "Medium");
			const h = allQuestionsCount.find((q) => q?.difficulty === "Hard");

			if (all?.count) totalQuestions = all.count;
			if (e?.count) easy.total = e.count;
			if (m?.count) medium.total = m.count;
			if (h?.count) hard.total = h.count;
		}

		const acStats = matchedUser?.submitStats?.acSubmissionNum;
		if (Array.isArray(acStats)) {
			const allSolved = acStats.find((q) => q?.difficulty === "All");
			const eSolved = acStats.find((q) => q?.difficulty === "Easy");
			const mSolved = acStats.find((q) => q?.difficulty === "Medium");
			const hSolved = acStats.find((q) => q?.difficulty === "Hard");

			if (allSolved?.count) solved = allSolved.count;
			if (eSolved?.count) easy.solved = eSolved.count;
			if (mSolved?.count) medium.solved = mSolved.count;
			if (hSolved?.count) hard.solved = hSolved.count;
		}

		if (userContestRanking && typeof userContestRanking.rating === "number") {
			rating = Math.round(userContestRanking.rating);
			if (typeof userContestRanking.topPercentage === "number") {
				topPercentage = userContestRanking.topPercentage;
			}
		}
	}

	const getWidthPercent = (diff: StatsDifficulty) => {
		if (diff.solved === 0) return "0%";
		const pct = (diff.solved / diff.total) * 100;
		return `${Math.max(pct, 2)}%`;
	};

	return (
		<RetroCard
			accentColor="#FFA116"
			paddingX="px-3.5 xl:px-desktop-sm"
			paddingTop="pt-3.5 xl:pt-desktop-sm"
			paddingBottom="pb-3.5 xl:pb-desktop-sm"
			delay={delay}
			className={className}
			style={style}
			header={
				<CardHeader
					icon={<FiCode size={13} aria-hidden="true" />}
					accentColor="#FFA116"
					title="LEETCODE DSA"
					badge={rating ? "ACTIVE" : "STANDBY"}
				/>
			}
			footer={
				<CardFooter
					left={rating ? `RATING: ${rating}` : "RANK: UNRATED"}
					right={topPercentage ? `TOP ${topPercentage}%` : "LIVE_SYNCED"}
				/>
			}
		>
			{/* Stats Content */}
			<div className="my-auto flex flex-col gap-2 font-mono">
				<div className="flex justify-between items-baseline">
					<span className="text-desktop-xs font-bold text-muted-foreground uppercase">
						SOLVED:
					</span>
					<span className="text-desktop-sm font-black text-foreground">
						{solved}
						<span className="text-desktop-xs text-muted-foreground font-normal">
							/{totalQuestions}
						</span>
					</span>
				</div>

				{/* Progress split bars */}
				<div className="flex flex-col gap-1.5 text-desktop-2xs font-bold">
					{/* Easy */}
					<div className="flex items-center gap-2">
						<span className="w-8 text-emerald-700 uppercase">EASY</span>
						<div className="flex-grow h-2 bg-muted border border-border/20 relative overflow-hidden">
							<div
								className="absolute top-0 left-0 bottom-0 bg-emerald-600"
								style={{ width: getWidthPercent(easy) }}
							/>
						</div>
						<span className="w-6 text-right">{easy.solved}</span>
					</div>
					{/* Medium */}
					<div className="flex items-center gap-2">
						<span className="w-8 text-amber-700 uppercase">MED</span>
						<div className="flex-grow h-2 bg-muted border border-border/20 relative overflow-hidden">
							<div
								className="absolute top-0 left-0 bottom-0 bg-amber-600"
								style={{ width: getWidthPercent(medium) }}
							/>
						</div>
						<span className="w-6 text-right">{medium.solved}</span>
					</div>
					{/* Hard */}
					<div className="flex items-center gap-2">
						<span className="w-8 text-rose-700 uppercase">HARD</span>
						<div className="flex-grow h-2 bg-muted border border-border/20 relative overflow-hidden">
							<div
								className="absolute top-0 left-0 bottom-0 bg-rose-600"
								style={{ width: getWidthPercent(hard) }}
							/>
						</div>
						<span className="w-6 text-right">{hard.solved}</span>
					</div>
				</div>
			</div>
		</RetroCard>
	);
}

export function LeetCodeSkeleton({
	delay = 0.55,
	className = "",
	style,
}: LeetCodeWidgetProps) {
	return (
		<RetroCard
			accentColor="#FFA116"
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
						<div className="h-2 bg-muted rounded w-full" />
						<div className="h-2 bg-muted rounded w-full" />
						<div className="h-2 bg-muted rounded w-full" />
					</div>
				</div>
			</div>
		</RetroCard>
	);
}
