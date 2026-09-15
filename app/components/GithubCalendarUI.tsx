"use client";

import { useState } from "react";

interface ContributionDay {
	date: string;
	count: number;
	level: number;
}

interface ApiResponse {
	total: Record<string, number>;
	contributions: ContributionDay[];
}

interface GithubCalendarUIProps {
	githubData: ApiResponse;
	leetcodeData: Record<string, number>;
	codeforcesData: Record<string, number>;
}

export default function GithubCalendarUI({
	githubData,
	leetcodeData,
	codeforcesData,
}: GithubCalendarUIProps) {
	const [platform, setPlatform] = useState<
		"github" | "leetcode" | "codeforces"
	>("github");
	const years = githubData?.total
		? Object.keys(githubData.total).sort((a, b) => b.localeCompare(a))
		: ["2026", "2025"];
	const [selectedYear, setSelectedYear] = useState<string>(years[0] || "2026");

	const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
	const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

	const rawContributions = githubData?.contributions || [];

	const getLevelForCount = (c: number) => {
		if (c === 0) return 0;
		if (c <= 2) return 1;
		if (c <= 5) return 2;
		if (c <= 8) return 3;
		return 4;
	};

	const yearContributions = rawContributions
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

	const platformTotal = yearContributions.reduce(
		(acc, curr) => acc + curr.count,
		0,
	);

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

	const weeks = groupContributionsIntoWeeks(yearContributions);

	const monthLabels: { label: string; colIndex: number }[] = [];
	let prevMonth = -1;

	weeks.forEach((week, colIdx) => {
		const firstNonNullDay = week.find((d) => d !== null);
		if (firstNonNullDay) {
			const date = new Date(firstNonNullDay.date);
			const month = date.getMonth();
			if (month !== prevMonth) {
				const label = date.toLocaleString("default", { month: "short" });
				if (
					monthLabels.length === 0 ||
					colIdx - monthLabels[monthLabels.length - 1].colIndex > 2
				) {
					monthLabels.push({ label, colIndex: colIdx });
					prevMonth = month;
				}
			}
		}
	});

	const getSquareStyle = (level: number) => {
		if (platform === "github") {
			switch (level) {
				case 0:
					return "#ebedf0";
				case 1:
					return "#9be9a8";
				case 2:
					return "#40c463";
				case 3:
					return "#30a14e";
				case 4:
					return "#216e39";
				default:
					return "#ebedf0";
			}
		} else if (platform === "leetcode") {
			switch (level) {
				case 0:
					return "#ebedf0";
				case 1:
					return "#ffe8cc";
				case 2:
					return "#ffa116";
				case 3:
					return "#e68a00";
				case 4:
					return "#b36b00";
				default:
					return "#ebedf0";
			}
		} else {
			switch (level) {
				case 0:
					return "#ebedf0";
				case 1:
					return "#d2e9ff";
				case 2:
					return "#63b3ed";
				case 3:
					return "#3182ce";
				case 4:
					return "#2b6cb0";
				default:
					return "#ebedf0";
			}
		}
	};

	const getMetricLabel = () => {
		if (platform === "github") return "contributions";
		if (platform === "leetcode") return "problems solved";
		return "submissions";
	};

	const getShadowHoverClass = () => {
		if (platform === "github")
			return "hover:shadow-[3px_3px_0_0_var(--color-accent-secondary)]";
		if (platform === "leetcode") return "hover:shadow-[3px_3px_0_0_#FFA116]";
		return "hover:shadow-[3px_3px_0_0_#3182CE]";
	};

	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		setTooltipPos({ x: e.clientX, y: e.clientY - 40 });
	};

	return (
		<div
			className="mt-2 xl:mt-[clamp(0.125rem,0.75vh,0.375rem)] select-none w-full max-w-full h-full flex flex-col min-h-0"
			onClick={() => setHoveredDay(null)}
		>
			{/* Header with Title and Platform Toggle */}
			<div className="flex flex-col sm:flex-row justify-between items-center mb-2 xl:mb-[clamp(0.125rem,0.75vh,0.375rem)] gap-2 w-full">
				<h3 className="font-sans text-desktop-xs font-black uppercase tracking-wider text-foreground">
					{platformTotal.toLocaleString()} {getMetricLabel()} in {selectedYear}
				</h3>

				{/* Sleek, super-compact platform indicator selector */}
				<div className="flex items-center gap-1 bg-muted border border-border p-0.5 rounded-[1px] font-mono text-[length:var(--text-desktop-2xs)] font-bold">
					<button
						onClick={() => setPlatform("github")}
						className={`px-1.5 py-0.5 rounded-[1px] cursor-pointer transition-colors uppercase font-extrabold ${platform === "github"
								? "bg-[var(--color-accent-secondary)] text-black"
								: "text-foreground/80 hover:text-foreground"
							}`}
					>
						GIT
					</button>
					<span className="text-border/40 select-none">|</span>
					<button
						onClick={() => setPlatform("leetcode")}
						className={`px-1.5 py-0.5 rounded-[1px] cursor-pointer transition-colors uppercase font-extrabold ${platform === "leetcode"
								? "bg-[#FFA116] text-black"
								: "text-foreground/80 hover:text-foreground"
							}`}
					>
						LC
					</button>
					<span className="text-border/40 select-none">|</span>
					<button
						onClick={() => setPlatform("codeforces")}
						className={`px-1.5 py-0.5 rounded-[1px] cursor-pointer transition-colors uppercase font-extrabold ${platform === "codeforces"
								? "bg-[#3182CE] text-white"
								: "text-foreground/80 hover:text-foreground"
							}`}
					>
						CF
					</button>
				</div>
			</div>

			{/* Main Grid Viewport and Year Selector Row */}
			<div className="flex flex-col md:flex-row gap-4 xl:gap-[clamp(0.5rem,2vh,1rem)] items-stretch w-full flex-1 min-h-0">
				{/* Calendar Box */}
				<div
					className={`flex-1 min-w-0 bg-card border-[3px] border-border shadow-md p-2 xl:p-[clamp(0.25rem,0.75vh,0.5rem)] flex flex-col justify-between clip-margin-5 transition-all duration-200 relative ${getShadowHoverClass()}`}
				>
					{/* Scrollable Grid Container */}
					<div className="flex-1 flex flex-col justify-center min-h-0">
						<div
							className="overflow-x-auto overflow-y-hidden pb-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
							onMouseMove={handleMouseMove}
						>
							<div className="min-w-[640px] w-max mx-auto flex flex-col">
								{/* Month Labels row */}
								<div className="flex text-desktop-2xs font-semibold text-muted-foreground mb-1 h-3 pl-[30px] relative">
									{monthLabels.map((lbl, idx) => {
										const leftPos = 30 + lbl.colIndex * 13;
										return (
											<span
												key={idx}
												className="absolute"
												style={{ left: `${leftPos}px` }}
											>
												{lbl.label}
											</span>
										);
									})}
								</div>

								{/* Grid with Day of Week labels on left */}
								<div className="flex flex-row">
									{/* Y-axis Labels */}
									<div className="flex flex-col justify-between text-desktop-2xs font-semibold text-muted-foreground w-[30px] pr-2 pb-[4px] pt-[2px] h-[88px]">
										<span>Mon</span>
										<span>Wed</span>
										<span>Fri</span>
									</div>

									{/* Grid Columns */}
									<div className="flex flex-row gap-[3px]">
										{weeks.map((week, colIdx) => (
											<div key={colIdx} className="flex flex-col gap-[3px]">
												{week.map((day, rowIdx) => {
													if (!day) {
														return (
															<div
																key={rowIdx}
																className="w-[10px] h-[10px] rounded-[1.5px]"
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
															className={`w-[10px] h-[10px] rounded-[1.5px] border border-black ${isFuture
																	? "cursor-default opacity-30"
																	: "cursor-pointer transition-transform hover:scale-[1.3] hover:z-10"
																}`}
															style={{ backgroundColor: color }}
															onMouseEnter={() => !isFuture && setHoveredDay(day)}
															onMouseLeave={() =>
																!isFuture && setHoveredDay(null)
															}
															onClick={(e) => {
																if (!isFuture) {
																	e.stopPropagation();
																	setHoveredDay(day);
																	setTooltipPos({ x: e.clientX, y: e.clientY - 40 });
																}
															}}
														/>
													);
												})}
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Footer of Calendar Box */}
					<div className="flex flex-col sm:flex-row items-center justify-between text-desktop-2xs font-semibold text-muted-foreground border-t border-muted mt-1 pt-1 gap-2">
						<span className="text-[length:var(--text-desktop-2xs)] uppercase tracking-wider text-center sm:text-left">
							Live activity sync: active
						</span>

						<div className="flex items-center gap-1.5">
							<span>Less</span>
							<div className="flex gap-[3px]">
								{[0, 1, 2, 3, 4].map((lvl) => (
									<div
										key={lvl}
										className="w-[10px] h-[10px] rounded-[1.5px] border border-black"
										style={{ backgroundColor: getSquareStyle(lvl) }}
									/>
								))}
							</div>
							<span>More</span>
						</div>
					</div>
				</div>

				{/* Years Selector Column */}
				<div className="flex flex-row md:flex-col gap-2 flex-shrink-0 justify-center md:justify-start">
					{years.map((yr) => {
						const isSelected = selectedYear === yr;
						return (
							<button
								key={yr}
								onClick={() => setSelectedYear(yr)}
								className={`px-2 py-1 xl:px-desktop-sm xl:py-desktop-xs text-xs xl:text-[length:var(--text-desktop-xs)] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer border select-none ${isSelected
										? "bg-background text-foreground border-border shadow-[2px_2px_0_0_var(--accent)] translate-x-[1px] translate-y-[1px]"
										: "bg-background text-foreground border-border shadow-[2px_2px_0_0_var(--border)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[2px_2px_0_0_var(--color-accent-secondary)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
									}`}
							>
								{yr}
							</button>
						);
					})}
				</div>
			</div>

			{/* Floating Tooltip Component */}
			{hoveredDay && (
				<div
					className="fixed pointer-events-none z-50 bg-accent-warning text-black text-[length:var(--text-desktop-2xs)] font-black py-1.5 px-2.5 border-[2px] border-border shadow-sm -translate-x-1/2 select-none uppercase tracking-wider"
					style={{
						left: `${tooltipPos.x}px`,
						top: `${tooltipPos.y}px`,
					}}
				>
					{hoveredDay.count === 0
						? "No activity"
						: `${hoveredDay.count} ${getMetricLabel()}`}{" "}
					on {formatDate(hoveredDay.date)}
				</div>
			)}
		</div>
	);
}

export function CalendarSkeleton() {
	const getSkeletonColor = () => "#ebedf0";

	return (
		<div className="mt-2 xl:mt-[clamp(0.125rem,0.75vh,0.375rem)] select-none w-full max-w-full h-full flex flex-col min-h-0 animate-pulse">
			<div className="w-48 h-5 bg-muted border border-border mb-2 xl:mb-[clamp(0.125rem,0.75vh,0.375rem)] rounded-[2px]" />

			<div className="flex flex-col md:flex-row gap-4 xl:gap-[clamp(0.5rem,2vh,1rem)] items-stretch w-full flex-1 min-h-0">
				<div className="flex-1 bg-card border-[3px] border-border shadow-md p-2 xl:p-[clamp(0.25rem,0.75vh,0.5rem)] flex flex-col justify-between clip-margin-5">
					{/* Scrollable Skeleton Grid */}
					<div className="flex-1 flex flex-col justify-center min-h-0">
						<div className="overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
							<div className="min-w-[640px] w-max mx-auto flex flex-col">
								{/* Skeleton Month Labels row */}
								<div className="flex h-3 pl-[30px] mb-1">
									{[...Array(12)].map((_, i) => (
										<div
											key={i}
											className="w-8 h-full bg-muted rounded-[2px]"
											style={{ marginLeft: i === 0 ? "0px" : "36px" }}
										/>
									))}
								</div>

								{/* Grid with Day of Week labels on left */}
								<div className="flex flex-row">
									<div className="flex flex-col justify-between w-[30px] pr-2 pb-[4px] pt-[2px] h-[88px]">
										<div className="w-4 h-2.5 bg-muted rounded-[2px]" />
										<div className="w-4 h-2.5 bg-muted rounded-[2px]" />
										<div className="w-4 h-2.5 bg-muted rounded-[2px]" />
									</div>

									<div className="flex flex-row gap-[3px]">
										{[...Array(53)].map((_, colIdx) => (
											<div key={colIdx} className="flex flex-col gap-[3px]">
												{[...Array(7)].map((_, rowIdx) => (
													<div
														key={rowIdx}
														className="w-[10px] h-[10px] rounded-[1.5px]"
														style={{ backgroundColor: getSkeletonColor() }}
													/>
												))}
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="flex items-center justify-between border-t border-muted mt-1 pt-1">
						<div className="w-36 h-3 bg-muted rounded-[2px]" />
						<div className="w-24 h-3 bg-muted rounded-[2px]" />
					</div>
				</div>

				<div className="flex flex-row md:flex-col gap-2 flex-shrink-0">
					<div className="w-12 h-6 bg-muted border border-border rounded-[2px]" />
					<div className="w-12 h-6 bg-muted border border-border rounded-[2px]" />
				</div>
			</div>
		</div>
	);
}
