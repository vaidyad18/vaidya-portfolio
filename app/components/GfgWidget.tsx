"use client";
import { FiCode } from "react-icons/fi";
import type { NormalizedGfgDto } from "@/app/lib/schemas";

import CardFooter from "./ui/CardFooter";
import CardHeader from "./ui/CardHeader";
import RetroCard from "./ui/RetroCard";

// GFG brand green
const GFG_COLOR = "#2f8d46";

interface GfgWidgetProps {
	gfgData?: NormalizedGfgDto;
	className?: string;
	delay?: number;
	style?: React.CSSProperties;
}

export default function GfgWidget({
	gfgData,
	className = "",
	delay = 0.65,
	style,
}: GfgWidgetProps) {
	const codingScore = gfgData?.codingScore ?? 0;
	const problemsSolved = gfgData?.problemsSolved ?? 0;
	const streak = gfgData?.streak ?? 0;
	const instituteRank = gfgData?.instituteRank ?? 0;

	return (
		<RetroCard
			accentColor={GFG_COLOR}
			paddingX="px-3.5 xl:px-desktop-sm"
			paddingTop="pt-3.5 xl:pt-desktop-sm"
			paddingBottom="pb-3.5 xl:pb-desktop-sm"
			delay={delay}
			className={className}
			style={style}
			header={
				<CardHeader
					icon={<FiCode size={13} aria-hidden="true" />}
					accentColor={GFG_COLOR}
					title="GEEKSFORGEEKS"
					badge={codingScore > 0 ? "ACTIVE" : "STANDBY"}
					badgeTextColor="text-white"
				/>
			}
			footer={
				<CardFooter
					left={`HANDLE: ${gfgData?.handle || "vaidyadantq0y"}`}
					right="SYS_SYNCED"
				/>
			}
		>
			{/* Stats Content */}
			<div className="my-auto flex flex-col gap-2 font-mono">
				<div className="flex justify-between items-baseline">
					<span className="text-desktop-xs font-bold text-muted-foreground uppercase">
						CODING SCORE:
					</span>
					<span
						className="text-desktop-sm font-black uppercase"
						style={{ color: GFG_COLOR }}
					>
						{codingScore > 0 ? codingScore.toLocaleString() : "—"}
					</span>
				</div>

				<div className="flex flex-col gap-1.5 text-[9px] font-bold text-foreground/80 mt-1">
					<div className="flex justify-between border-b border-border/5 pb-1">
						<span className="text-muted-foreground uppercase">
							PROBLEMS SOLVED:
						</span>
						<span className="font-black text-foreground">
							{problemsSolved > 0 ? problemsSolved : "—"}
						</span>
					</div>
					<div className="flex justify-between border-b border-border/5 pb-1">
						<span className="text-muted-foreground uppercase">
							CURRENT STREAK:
						</span>
						<span className="font-black text-foreground">
							{streak > 0 ? `${streak} days` : "—"}
						</span>
					</div>
					<div className="flex justify-between pb-0.5">
						<span className="text-muted-foreground uppercase">
							INSTITUTE RANK:
						</span>
						<span className="font-black text-foreground">
							{instituteRank > 0 ? `#${instituteRank}` : "—"}
						</span>
					</div>
				</div>
			</div>
		</RetroCard>
	);
}

export function GfgSkeleton({
	delay = 0.65,
	className = "",
	style,
}: GfgWidgetProps) {
	return (
		<RetroCard
			accentColor={GFG_COLOR}
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
