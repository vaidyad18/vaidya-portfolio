import React from "react";

// LCDCell component to render a character precisely over its background shadow cell
export function LCDCell({
	char,
	shadowChar = "8",
	className = "",
	style,
	widthClass = "w-[9.5px]",
}: {
	char: string;
	shadowChar?: string;
	className?: string;
	style?: React.CSSProperties;
	widthClass?: string;
}) {
	return (
		<span
			className={`grid place-items-center select-none text-center ${widthClass}`}
			style={style}
		>
			{/* Ghost Background Segment */}
			<span
				className={`row-start-1 col-start-1 opacity-[0.04] text-[#1a251d] text-center select-none pointer-events-none z-0 ${className}`}
				style={style}
			>
				{shadowChar}
			</span>
			{/* Active Foreground Segment */}
			<span
				className={`row-start-1 col-start-1 text-center ${className}`}
				style={style}
			>
				{char}
			</span>
		</span>
	);
}

export default function LcdClockFace({
	hours,
	minutes,
	seconds,
	className = "flex items-center justify-center font-digital text-sm font-bold",
	cellWidthClass = "w-[9.5px]",
	colonWidthClass = "w-[7px]",
}: {
	hours: string;
	minutes: string;
	seconds?: string;
	className?: string;
	cellWidthClass?: string;
	colonWidthClass?: string;
}) {
	return (
		<div className={className}>
			{hours.split("").map((c, i) => (
				<LCDCell key={`h-${i}`} char={c} widthClass={cellWidthClass} />
			))}
			<LCDCell
				char=":"
				shadowChar=":"
				className="animate-pulse text-[#1a251d]/60"
				widthClass={colonWidthClass}
			/>
			{minutes.split("").map((c, i) => (
				<LCDCell key={`m-${i}`} char={c} widthClass={cellWidthClass} />
			))}
			{seconds && (
				<>
					<LCDCell
						char=":"
						shadowChar=":"
						className="animate-pulse text-[#1a251d]/60"
						widthClass={colonWidthClass}
					/>
					{seconds.split("").map((c, i) => (
						<LCDCell key={`s-${i}`} char={c} widthClass={cellWidthClass} />
					))}
				</>
			)}
		</div>
	);
}
