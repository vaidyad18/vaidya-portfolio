import type { ElementType, ReactNode } from "react";

interface RetroButtonProps {
	accentColor: string;
	size?: "lg" | "sm";
	as?: "a" | "button";
	href?: string;
	target?: string;
	rel?: string;
	onClick?: () => void;
	className?: string;
	children: ReactNode;
}

export default function RetroButton({
	accentColor,
	size = "lg",
	as = "button",
	href,
	target,
	rel,
	onClick,
	className = "",
	children,
}: RetroButtonProps) {
	const borderWidth = size === "lg" ? "border-[3px]" : "border-[2px]";
	const shadowSize = size === "lg" ? "3px" : "2px";
	const translateActive =
		size === "lg"
			? "active:translate-x-[2px] active:translate-y-[2px]"
			: "active:translate-x-[1px] active:translate-y-[1px]";

	const Tag = as as ElementType;

	return (
		<Tag
			href={as === "a" ? href : undefined}
			target={as === "a" ? target : undefined}
			rel={as === "a" ? rel : undefined}
			onClick={onClick}
			style={
				{
					"--btn-accent": accentColor,
				} as React.CSSProperties
			}
			className={`${borderWidth} border-border bg-background text-foreground shadow-xs font-bold uppercase tracking-widest transition-all duration-200 select-none cursor-pointer hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[${shadowSize}_${shadowSize}_0_0_var(--btn-accent)] ${translateActive} active:shadow-none ${className}`}
		>
			{children}
		</Tag>
	);
}
