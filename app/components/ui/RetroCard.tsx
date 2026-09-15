"use client";

import { motion } from "framer-motion";

interface RetroCardProps {
	accentColor: string;
	paddingX?: string;
	paddingTop?: string;
	paddingBottom?: string;
	delay?: number;
	className?: string;
	style?: React.CSSProperties;
	header?: React.ReactNode;
	footer?: React.ReactNode;
	children: React.ReactNode;
}

export default function RetroCard({
	accentColor,
	paddingX = "px-4",
	paddingTop = "pt-4",
	paddingBottom = "pb-4",
	delay = 0.5,
	className = "",
	style,
	header,
	footer,
	children,
}: RetroCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ type: "spring", stiffness: 120, damping: 14, delay }}
			style={
				{
					...style,
					"--card-accent": accentColor,
				} as React.CSSProperties & Record<"--card-accent", string>
			}
			className={`@container w-full h-full bg-card border-[3px] border-border shadow-md hover:shadow-[3px_3px_0_0_var(--card-accent)] flex flex-col justify-between clip-margin-5 transition-all duration-200 select-none relative ${className}`}
		>
			{header && <div className={`${paddingX} ${paddingTop} flex-shrink-0`}>{header}</div>}
			<div className={`flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col ${paddingX}`}>
				{children}
			</div>
			{footer && <div className={`${paddingX} ${paddingBottom} flex-shrink-0`}>{footer}</div>}
		</motion.div>
	);
}
