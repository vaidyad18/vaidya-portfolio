import type { ReactNode } from "react";
import StatusBadge from "./StatusBadge";

interface CardHeaderProps {
	icon: ReactNode;
	accentColor: string;
	title: string;
	badge?: ReactNode;
	badgeTextColor?: string;
	badgeHref?: string;
	badgeAriaLabel?: string;
	pulse?: boolean;
}

export default function CardHeader({
	icon,
	accentColor,
	title,
	badge,
	badgeTextColor = "text-black",
	badgeHref,
	badgeAriaLabel,
	pulse = false,
}: CardHeaderProps) {
	const iconWrapper = (
		<span
			className={pulse ? "animate-pulse" : ""}
			style={{ color: accentColor }}
		>
			{icon}
		</span>
	);

	const badgeElement = badge ? (
		badgeHref ? (
			<a
				href={badgeHref}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={badgeAriaLabel || (typeof badge === "string" ? badge : title)}
				className="cursor-pointer leading-none"
			>
				<StatusBadge color={accentColor} textColor={badgeTextColor}>
					{badge}
				</StatusBadge>
			</a>
		) : (
			<StatusBadge color={accentColor} textColor={badgeTextColor}>
				{badge}
			</StatusBadge>
		)
	) : null;

	return (
		<div className="flex-shrink-0">
			<div className="flex justify-between items-center pb-2 border-b border-border/10">
				<span className="font-sans text-desktop-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
					{iconWrapper}
					{title}
				</span>
				{badgeElement}
			</div>
		</div>
	);
}
