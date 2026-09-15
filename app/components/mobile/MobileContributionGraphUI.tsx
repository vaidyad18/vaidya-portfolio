"use client";

import { useState, useMemo } from "react";

// These types match the desktop version
interface ContributionDay {
	date: string;
	count: number;
	level: number;
}
interface ApiResponse {
	total: Record<string, number>;
	contributions: ContributionDay[];
}

interface MobileContributionGraphUIProps {
	githubData: ApiResponse;
	leetcodeData: Record<string, number>;
	codeforcesData: Record<string, number>;
}

// Group into weeks helper
const groupContributionsIntoWeeks = (days: ContributionDay[]) => {
	const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
	if (sorted.length === 0) return [];

	const weeks: (ContributionDay | null)[][] = [];
	let currentWeek: (ContributionDay | null)[] = [];

	const firstDate = new Date(sorted[0].date);
	const firstDayOfWeek = firstDate.getDay();

	for (let i = 0; i < firstDayOfWeek; i++) {
		currentWeek.push(null);
	}

	sorted.forEach((day) => {
		currentWeek.push(day);
		if (currentWeek.length === 7) {
			weeks.push(currentWeek);
			currentWeek = [];
		}
	});

	if (currentWeek.length > 0) {
		while (currentWeek.length < 7) {
			currentWeek.push(null);
		}
		weeks.push(currentWeek);
	}

	return weeks;
};

export default function MobileContributionGraphUI({
	githubData,
	leetcodeData,
	codeforcesData,
}: MobileContributionGraphUIProps) {
	const [platform, setPlatform] = useState<"github" | "leetcode" | "codeforces">("github");
	const years = useMemo(() => {
		return githubData?.total
			? Object.keys(githubData.total).sort((a, b) => b.localeCompare(a))
			: ["2026", "2025"];
	}, [githubData?.total]);
	const selectedYear = years[0] || "2026"; // Default to most recent year

	const rawContributions = githubData?.contributions || [];

	const getLevelForCount = (c: number) => {
		if (c === 0) return 0;
		if (c <= 2) return 1;
		if (c <= 5) return 2;
		if (c <= 8) return 3;
		return 4;
	};

	const yearContributions = useMemo(() => {
		return rawContributions
			.filter((c) => c.date.startsWith(selectedYear))
			.map((c) => {
				if (platform === "github") {
					return c;
				} else if (platform === "leetcode") {
					const count = leetcodeData[c.date] || 0;
					return {
						date: c.date,
						level: getLevelForCount(count),
						count,
					};
				} else {
					const count = codeforcesData[c.date] || 0;
					return {
						date: c.date,
						level: getLevelForCount(count),
						count,
					};
				}
			});
	}, [rawContributions, selectedYear, platform, leetcodeData, codeforcesData]);

	const platformTotal = useMemo(
		() => yearContributions.reduce((acc, curr) => acc + curr.count, 0),
		[yearContributions]
	);

	const weeks = useMemo(
		() => groupContributionsIntoWeeks(yearContributions),
		[yearContributions]
	);

	// Month labels
	const monthLabels = useMemo(() => {
		const labels: { label: string; colIndex: number }[] = [];
		let prevMonth = -1;

		weeks.forEach((week, colIdx) => {
			const firstNonNullDay = week.find((d) => d !== null);
			if (firstNonNullDay) {
				const date = new Date(firstNonNullDay.date);
				const month = date.getMonth();
				if (month !== prevMonth) {
					const label = date.toLocaleString("default", { month: "short" });
					if (
						labels.length === 0 ||
						colIdx - labels[labels.length - 1].colIndex > 2
					) {
						labels.push({ label, colIndex: colIdx });
						prevMonth = month;
					}
				}
			}
		});

		return labels;
	}, [weeks]);

	// Exact colors from desktop widget
	const getSquareStyle = (level: number) => {
		if (platform === "github") {
			switch (level) {
				case 0: return "#ebedf0";
				case 1: return "#9be9a8";
				case 2: return "#40c463";
				case 3: return "#30a14e";
				case 4: return "#216e39";
				default: return "#ebedf0";
			}
		} else if (platform === "leetcode") {
			switch (level) {
				case 0: return "#ebedf0";
				case 1: return "#ffe8cc";
				case 2: return "#ffa116";
				case 3: return "#e68a00";
				case 4: return "#b36b00";
				default: return "#ebedf0";
			}
		} else {
			switch (level) {
				case 0: return "#ebedf0";
				case 1: return "#d2e9ff";
				case 2: return "#63b3ed";
				case 3: return "#3182ce";
				case 4: return "#2b6cb0";
				default: return "#ebedf0";
			}
		}
	};

	const getMetricLabel = () => {
		if (platform === "github") return "contributions";
		if (platform === "leetcode") return "problems solved";
		return "submissions";
	};

	const getShadowHoverClass = () => {
		if (platform === "github") return "hover:shadow-[3px_3px_0_0_var(--color-accent-secondary)]";
		if (platform === "leetcode") return "hover:shadow-[3px_3px_0_0_#FFA116]";
		return "hover:shadow-[3px_3px_0_0_#3182CE]";
	};

	return (
		<div className="w-full flex flex-col gap-3 min-w-0">
			{/* Header with Title and Platform Toggle */}
			<div className="flex flex-col gap-2 w-full">
				<div className="flex justify-between items-center w-full">
					<h3 className="font-sans text-[0.6875rem] font-black uppercase tracking-wider text-foreground">
						{platformTotal.toLocaleString()} {getMetricLabel()}
					</h3>

					{/* Sleek platform indicator selector (minimum tap targets applied loosely here since it's an aesthetic replica, but padding ensures accessibility) */}
					<div className="flex items-center gap-1 bg-muted border-[1.5px] border-border p-[0.125rem] rounded-[1px] font-mono text-[0.5rem] font-bold h-7">
						<button
							onClick={() => setPlatform("github")}
							className={`h-full px-2 rounded-[1px] transition-colors uppercase flex items-center justify-center font-extrabold ${
								platform === "github"
									? "bg-[var(--color-accent-secondary)] text-black"
									: "text-foreground/80"
							}`}
						>
							GIT
						</button>
						<span className="text-border/40 select-none">|</span>
						<button
							onClick={() => setPlatform("leetcode")}
							className={`h-full px-2 rounded-[1px] transition-colors uppercase flex items-center justify-center font-extrabold ${
								platform === "leetcode"
									? "bg-[#FFA116] text-black"
									: "text-foreground/80"
							}`}
						>
							LC
						</button>
						<span className="text-border/40 select-none">|</span>
						<button
							onClick={() => setPlatform("codeforces")}
							className={`h-full px-2 rounded-[1px] transition-colors uppercase flex items-center justify-center font-extrabold ${
								platform === "codeforces"
									? "bg-[#3182CE] text-white"
									: "text-foreground/80"
							}`}
						>
							CF
						</button>
					</div>
				</div>
			</div>

			{/* Calendar Box */}
			<div
				className={`w-full bg-card border-[3px] border-border shadow-md p-3 flex flex-col gap-2 transition-all duration-200 relative ${getShadowHoverClass()}`}
			>
				{/* Scrollable Grid Container (Rule 10.5) */}
				<div className="overflow-x-auto overscroll-contain pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
					<div className="min-w-[40rem] w-max mx-auto flex flex-col">
						{/* Month Labels row */}
						<div className="flex text-[0.625rem] font-semibold text-muted-foreground mb-1 h-3 pl-[1.875rem] relative">
							{monthLabels.map((lbl, idx) => {
								// 1.875rem (30px) is the Y-axis label width.
								// Each column is 0.625rem (w-2.5) + 0.1875rem (gap) = 0.8125rem.
								const leftPosRem = 1.875 + lbl.colIndex * 0.8125;
								return (
									<span
										key={idx}
										className="absolute"
										style={{ left: `${leftPosRem}rem` }}
									>
										{lbl.label}
									</span>
								);
							})}
						</div>

						{/* Grid with Day of Week labels on left */}
						<div className="flex flex-row">
							{/* Y-axis Labels */}
							<div className="flex flex-col justify-between text-[0.625rem] font-semibold text-muted-foreground w-[1.875rem] pr-2 pb-[0.25rem] pt-[0.125rem] h-[5.5rem]">
								<span>Mon</span>
								<span>Wed</span>
								<span>Fri</span>
							</div>

							{/* Grid Columns */}
							<div className="flex flex-row gap-[0.1875rem]">
								{weeks.map((week, colIdx) => (
									<div key={colIdx} className="flex flex-col gap-[0.1875rem]">
										{week.map((day, rowIdx) => {
											if (!day) {
												return (
													<div
														key={rowIdx}
														className="w-[0.625rem] h-[0.625rem] rounded-[1.5px]"
														style={{ backgroundColor: "transparent" }}
													/>
												);
											}
											
											const todayStr = new Date().toISOString().split("T")[0];
											const isFuture = day.date > todayStr;
											const color = getSquareStyle(day.level);

											return (
												<div
													key={rowIdx}
													className={`w-[0.625rem] h-[0.625rem] rounded-[1.5px] border border-black ${
														isFuture ? "opacity-30" : ""
													}`}
													style={{ backgroundColor: color }}
												/>
											);
										})}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Footer of Calendar Box */}
				<div className="flex flex-row items-center justify-between text-[0.625rem] font-semibold text-muted-foreground border-t-[1.5px] border-border mt-1 pt-2">
					<span className="text-[0.5625rem] uppercase tracking-wider">
						Live activity sync: active
					</span>

					<div className="flex items-center gap-1.5">
						<span>Less</span>
						<div className="flex gap-[0.1875rem]">
							{[0, 1, 2, 3, 4].map((lvl) => (
								<div
									key={lvl}
									className="w-[0.625rem] h-[0.625rem] rounded-[1.5px] border border-black"
									style={{ backgroundColor: getSquareStyle(lvl) }}
								/>
							))}
						</div>
						<span>More</span>
					</div>
				</div>
			</div>
		</div>
	);
}
