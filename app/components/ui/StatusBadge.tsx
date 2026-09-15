import type { ReactNode } from "react";

interface StatusBadgeProps {
	color: string;
	textColor?: string;
	children: ReactNode;
}

export default function StatusBadge({
	color,
	textColor = "text-black",
	children,
}: StatusBadgeProps) {
	return (
		<span
			className={`inline-flex items-center font-mono text-[9px] font-black px-1.5 py-0.5 uppercase ${textColor}`}
			style={{ backgroundColor: color }}
		>
			{children}
		</span>
	);
}
