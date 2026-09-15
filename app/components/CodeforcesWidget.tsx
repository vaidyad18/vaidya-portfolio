"use client";
import { FiTrendingUp } from "react-icons/fi";
import type { NormalizedCodeforcesDto } from "@/app/lib/schemas";

import CardFooter from "./ui/CardFooter";
import CardHeader from "./ui/CardHeader";
import RetroCard from "./ui/RetroCard";

interface CodeforcesWidgetProps {
	cfData?: NormalizedCodeforcesDto;
	className?: string;
	delay?: number;
	style?: React.CSSProperties;
}

const formatRank = (r: string) => {
	if (r === "unrated") return "UNRATED";
	return r.toUpperCase();
};

const getRankColorClass = (r: string) => {
	const norm = r.toLowerCase();
	if (norm === "unrated") return "text-muted-foreground";
	if (norm === "newbie") return "text-gray-600";
	if (norm === "pupil") return "text-emerald-700";
	if (norm === "specialist") return "text-[#02847a]";
	if (norm === "expert") return "text-blue-700";
	if (norm === "candidate master") return "text-violet-700";
	return "text-rose-700";
};

export default function CodeforcesWidget({
	cfData,
	className = "",
	delay = 0.65,
	style,
}: CodeforcesWidgetProps) {

	const rating = cfData?.rating ?? 0;
	const maxRating = cfData?.maxRating ?? 0;
	const rank = cfData?.rank ?? "unrated";
	const solvedCount = cfData?.solvedCount ?? 0;
	const contestCount = cfData?.contestCount ?? 0;

	return (
		<RetroCard
			accentColor="#3182CE"
			paddingX="px-3.5 xl:px-desktop-sm"
			paddingTop="pt-3.5 xl:pt-desktop-sm"
			paddingBottom="pb-3.5 xl:pb-desktop-sm"
			delay={delay}
			className={className}
			style={style}
			header={
				<CardHeader
					icon={<FiTrendingUp size={13} aria-hidden="true" />}
					accentColor="#3182CE"
					title="CODEFORCES CP"
					badge={rating > 0 ? "ACTIVE" : "STANDBY"}
					badgeTextColor="text-white"
				/>
			}
			footer={<CardFooter left="HANDLE: Medhansh_217" right="SYS_SYNCED" />}
		>
			{/* Stats Content */}
			<div className="my-auto flex flex-col gap-2 font-mono">
				<div className="flex justify-between items-baseline">
					<span className="text-desktop-xs font-bold text-muted-foreground uppercase">
						RATING:
					</span>
					<span
						className={`text-desktop-sm font-black uppercase ${getRankColorClass(rank)}`}
					>
						{rating > 0 ? (
							<>
								{rating}{" "}
								<span className="text-[9px] font-bold">
									({formatRank(rank)})
								</span>
							</>
						) : (
							"UNRATED"
						)}
					</span>
				</div>

				<div className="flex flex-col gap-1.5 text-[9px] font-bold text-foreground/80 mt-1">
					<div className="flex justify-between border-b border-border/5 pb-1">
						<span className="text-muted-foreground uppercase">MAX RATING:</span>
						<span className="font-black text-foreground">
							{maxRating > 0 ? maxRating : "—"}
						</span>
					</div>
					<div className="flex justify-between border-b border-border/5 pb-1">
						<span className="text-muted-foreground uppercase">
							PROBLEMS SOLVED:
						</span>
						<span className="font-black text-foreground">{solvedCount}</span>
					</div>
					<div className="flex justify-between pb-0.5">
						<span className="text-muted-foreground uppercase">
							CONTESTS PLAYED:
						</span>
						<span className="font-black text-foreground">{contestCount}</span>
					</div>
				</div>
			</div>
		</RetroCard>
	);
}

export function CodeforcesSkeleton({
	delay = 0.65,
	className = "",
	style,
}: CodeforcesWidgetProps) {
	return (
		<RetroCard
			accentColor="#3182CE"
			paddingX="px-3.5 xl:px-[clamp(0.5rem,1.5vh,0.875rem)]"
			paddingTop="pt-3.5 xl:pt-[clamp(0.5rem,1.5vh,0.875rem)]"
			paddingBottom="pb-3.5 xl:pb-[clamp(0.5rem,1.5vh,0.875rem)]"
			delay={delay}
			className={className}
			style={style}
			header={
				<div>
					<div className="flex justify-between items-center pb-2 border-b border-border/10">
						<div className="w-24 h-3.5 bg-muted rounded" />
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
					<div className="my-auto space-y-2.5">
						<div className="h-4 bg-muted rounded w-2/3" />
						<div className="h-3 bg-muted rounded w-full" />
						<div className="h-3 bg-muted rounded w-full" />
						<div className="h-3 bg-muted rounded w-full" />
					</div>
				</div>
			</div>
		</RetroCard>
	);
}
