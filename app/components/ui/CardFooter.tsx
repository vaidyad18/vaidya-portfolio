interface CardFooterProps {
	left: string;
	right: React.ReactNode;
}

export default function CardFooter({ left, right }: CardFooterProps) {
	return (
		<div className="border-t border-border/10 pt-2 flex justify-between items-center text-desktop-2xs font-mono font-bold text-muted-foreground uppercase flex-shrink-0">
			<span>{left}</span>
			<span className="text-foreground font-black">{right}</span>
		</div>
	);
}
