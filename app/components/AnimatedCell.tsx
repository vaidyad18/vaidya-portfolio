"use client";

import { motion } from "framer-motion";

interface AnimatedCellProps {
	children: React.ReactNode;
	delay?: number;
	className?: string;
}

export default function AnimatedCell({
	children,
	delay = 0,
	className = "flex-1 flex flex-col min-h-0 min-w-0 w-full max-w-full",
}: AnimatedCellProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
