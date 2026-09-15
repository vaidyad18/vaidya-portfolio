import Image from "next/image";

export default function MobileCardStackPlaceholder() {
	return (
		<div className="w-full flex flex-col items-center justify-center py-4">
			{/* Container matching aspect ratio of a mobile card to ensure proper scalable height */}
			<div className="relative w-11/12 max-w-sm aspect-[5/7] mx-auto">
				{/* 3rd Card (Deepest) */}
				<div
					className="absolute top-0 left-0 w-full h-full bg-muted border-[3px] border-border shadow-md rounded-[2px]"
					style={{
						transform: "translateY(1.5rem) scale(0.92)",
						zIndex: 10,
					}}
				/>

				{/* 2nd Card (Middle) */}
				<div
					className="absolute top-0 left-0 w-full h-full bg-card border-[3px] border-border shadow-md rounded-[2px]"
					style={{
						transform: "translateY(0.75rem) scale(0.96)",
						zIndex: 20,
					}}
				/>

				{/* Top Card (Active) */}
				<div
					className="absolute top-0 left-0 w-full h-full bg-background border-[3px] border-border shadow-[4px_4px_0_0_var(--color-accent-secondary)] rounded-[2px] z-30 flex flex-col overflow-hidden"
				>
					{/* Placeholder Image Area */}
					<div className="w-full h-1/2 bg-muted border-b-[3px] border-border relative flex items-center justify-center">
						<span className="font-mono text-sm font-bold text-muted-foreground uppercase tracking-widest">
							Project Preview
						</span>
					</div>

					{/* Placeholder Content Area */}
					<div className="flex-1 p-4 flex flex-col justify-between">
						<div className="flex flex-col gap-2">
							<h3 className="font-black text-xl uppercase tracking-tight">
								Portfolio V3
							</h3>
							<p className="text-sm font-medium text-muted-foreground line-clamp-2">
								A brutally minimalist, fully responsive personal portfolio built with Next.js, Tailwind, and Framer Motion.
							</p>
							
							<div className="flex flex-wrap gap-1 mt-1">
								{["Next.js", "Tailwind", "Motion"].map((tag) => (
									<span
										key={tag}
										className="px-2 py-0.5 border-2 border-border text-[0.625rem] font-bold uppercase tracking-wider"
									>
										{tag}
									</span>
								))}
							</div>
						</div>

						{/* Placeholder CTA */}
						<div className="w-full py-3 bg-foreground text-background border-2 border-border font-black text-center text-sm uppercase tracking-wider cursor-not-allowed">
							View Details
						</div>
					</div>
				</div>
			</div>
			
			{/* Placeholder gesture hint text */}
			<div className="mt-8 text-[0.6875rem] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
				<span>← Swipe →</span>
			</div>
		</div>
	);
}
