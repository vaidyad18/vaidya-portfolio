"use client";

import { useEffect, useState } from "react";
import { useMatchMedia } from "@/app/lib/use-match-media";
import LcdClockFace, { LCDCell } from "./mobile/LcdClockFace";

export default function HeaderClock() {
	const isDesktop = useMatchMedia("(min-width: 1280px)");
	const [time, setTime] = useState<Date | null>(null);

	useEffect(() => {
		if (isDesktop !== true) return;

		// eslint-disable-next-line react-hooks/set-state-in-effect -- initial time must be set client-side to avoid hydration mismatch
		setTime(new Date());
		const interval = setInterval(() => {
			setTime(new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, [isDesktop]);

	if (isDesktop !== true || !time) {
		return <HeaderClockSkeleton />;
	}

	const hours = time.getHours().toString().padStart(2, "0");
	const minutes = time.getMinutes().toString().padStart(2, "0");
	const seconds = time.getSeconds().toString().padStart(2, "0");

	const day = time.getDate().toString().padStart(2, "0");
	const month = (time.getMonth() + 1).toString().padStart(2, "0");
	const shortYear = time.getFullYear().toString().slice(-2); // e.g. "26"

	return (
		<div className="filter drop-shadow-[2px_2px_0px_#000000] hidden sm:inline-flex select-none">
			{/* Octagonal Bezel Border Container */}
			<div className="bg-border p-[1.5px] [clip-path:polygon(6px_0%,calc(100%-6px)_0%,100%_6px,100%_calc(100%-6px),calc(100%-6px)_100%,6px_100%,0%_calc(100%-6px),0%_6px)] flex items-center justify-center">
				{/* LCD Screen Display */}
				<div className="bg-[#cad3c8] text-[#1a251d] px-2.5 py-0.5 flex flex-col items-center justify-center [clip-path:polygon(6px_0%,calc(100%-6px)_0%,100%_6px,100%_calc(100%-6px),calc(100%-6px)_100%,6px_100%,0%_calc(100%-6px),0%_6px)] w-[88px] h-[38px] transition-all duration-300">
					{/* Top Row: Large Time (7-segment) */}
					<LcdClockFace
						hours={hours}
						minutes={minutes}
						seconds={seconds}
						className="flex items-center justify-center w-full font-digital leading-none text-sm font-bold border-b border-[#1a251d]/10 pb-[1.5px] mb-[1.5px]"
					/>

					{/* Bottom Row: Date digits (7-segment) */}
					<div className="flex items-center justify-center w-full font-digital text-[9px] font-bold">
						{day.split("").map((c, i) => (
							<LCDCell key={`d-${i}`} char={c} widthClass="w-[6.5px]" />
						))}
						<LCDCell char="-" shadowChar="-" widthClass="w-[6.5px]" />
						{month.split("").map((c, i) => (
							<LCDCell key={`mo-${i}`} char={c} widthClass="w-[6.5px]" />
						))}
						<LCDCell char="-" shadowChar="-" widthClass="w-[6.5px]" />
						{shortYear.split("").map((c, i) => (
							<LCDCell key={`y-${i}`} char={c} widthClass="w-[6.5px]" />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function HeaderClockSkeleton() {
	return (
		<div className="filter drop-shadow-[2px_2px_0px_#000000] hidden sm:inline-flex select-none">
			<div className="bg-border p-[1.5px] [clip-path:polygon(6px_0%,calc(100%-6px)_0%,100%_6px,100%_calc(100%-6px),calc(100%-6px)_100%,6px_100%,0%_calc(100%-6px),0%_6px)] flex items-center justify-center">
				<div className="bg-[#cad3c8] [clip-path:polygon(6px_0%,calc(100%-6px)_0%,100%_6px,100%_calc(100%-6px),calc(100%-6px)_100%,6px_100%,0%_calc(100%-6px),0%_6px)] w-[88px] h-[38px] animate-pulse relative">
					<span className="font-digital opacity-0 text-[0px] absolute inset-0 pointer-events-none">88:88</span>
				</div>
			</div>
		</div>
	);
}
