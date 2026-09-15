export default function DesktopGridSkeleton() {
	return (
		<>
			{/* Cell A (Experience) */}
			<div className="hidden xl:flex h-full min-h-0 flex-col clip-margin-5">
				<div className="w-full h-full p-4 flex flex-col bg-background/50 border-2 border-muted/20 animate-pulse">
					<div className="h-5 w-32 bg-muted/50 rounded mb-4"></div>
					<div className="h-4 w-2/3 bg-muted/30 rounded mb-2"></div>
					<div className="h-4 w-1/2 bg-muted/30 rounded"></div>
					<div className="mt-auto h-4 w-24 bg-muted/50 rounded"></div>
				</div>
			</div>
			{/* Cell B (Projects) */}
			<div className="hidden xl:flex h-full min-h-0 flex-col clip-margin-5">
				<div className="w-full h-full p-4 flex flex-col bg-background/50 border-2 border-muted/20 animate-pulse">
					<div className="h-5 w-32 bg-muted/50 rounded mb-4"></div>
					<div className="h-4 w-2/3 bg-muted/30 rounded mb-2"></div>
					<div className="h-4 w-1/2 bg-muted/30 rounded"></div>
					<div className="mt-auto h-4 w-24 bg-muted/50 rounded"></div>
				</div>
			</div>
			{/* Cell C (Commit feed) */}
			<div className="hidden xl:flex h-full min-h-0 flex-col clip-margin-5">
				<div className="w-full h-full p-4 flex flex-col bg-background/50 border-2 border-muted/20 animate-pulse">
					<div className="h-5 w-32 bg-muted/50 rounded mb-4"></div>
					<div className="flex flex-col gap-4 mt-2">
						<div className="flex items-start gap-3">
							<div className="h-3 w-3 rounded bg-muted/50 mt-1"></div>
							<div className="flex-1 space-y-2">
								<div className="h-3 w-full bg-muted/30 rounded"></div>
								<div className="h-3 w-4/5 bg-muted/30 rounded"></div>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="h-3 w-3 rounded bg-muted/50 mt-1"></div>
							<div className="flex-1 space-y-2">
								<div className="h-3 w-full bg-muted/30 rounded"></div>
								<div className="h-3 w-4/5 bg-muted/30 rounded"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Cell D (Calendar) */}
			<div className="hidden xl:flex h-full min-h-0 flex-col clip-margin-5">
				<div className="w-full h-full p-4 flex flex-col bg-background/50 border-2 border-muted/20 animate-pulse justify-end">
					<div className="h-5 w-32 bg-muted/50 rounded mb-4"></div>
					<div className="grid grid-cols-[repeat(auto-fill,minmax(12px,1fr))] gap-1 mt-auto">
						{Array.from({ length: 48 }).map((_, i) => (
							<div
								key={i}
								className="aspect-square rounded-[2px] bg-muted/30"
							></div>
						))}
					</div>
				</div>
			</div>
			{/* Cell E (LeetCode) */}
			<div className="hidden xl:flex h-full min-h-0 flex-col clip-margin-5">
				<div className="w-full h-full p-4 flex flex-col bg-background/50 border-2 border-muted/20 animate-pulse">
					<div className="h-5 w-32 bg-muted/50 rounded mb-4"></div>
					<div className="space-y-3 mt-4">
						<div className="h-2 w-full bg-muted/30 rounded"></div>
						<div className="h-2 w-full bg-muted/30 rounded"></div>
						<div className="h-2 w-full bg-muted/30 rounded"></div>
					</div>
				</div>
			</div>
			{/* Cell F (Codeforces) */}
			<div className="hidden xl:flex h-full min-h-0 flex-col clip-margin-5">
				<div className="w-full h-full p-4 flex flex-col bg-background/50 border-2 border-muted/20 animate-pulse">
					<div className="h-5 w-32 bg-muted/50 rounded mb-4"></div>
					<div className="space-y-3 mt-4">
						<div className="h-2 w-full bg-muted/30 rounded"></div>
						<div className="h-2 w-full bg-muted/30 rounded"></div>
						<div className="h-2 w-full bg-muted/30 rounded"></div>
					</div>
				</div>
			</div>
			{/* Cell G (Git archive) */}
			<div className="hidden xl:flex h-full min-h-0 flex-col clip-margin-5">
				<div className="w-full h-full p-4 flex flex-col bg-background/50 border-2 border-muted/20 animate-pulse">
					<div className="h-5 w-32 bg-muted/50 rounded mb-4"></div>
					<div className="space-y-3 mt-4">
						<div className="h-2 w-full bg-muted/30 rounded"></div>
						<div className="h-2 w-full bg-muted/30 rounded"></div>
						<div className="h-2 w-full bg-muted/30 rounded"></div>
					</div>
				</div>
			</div>
		</>
	);
}
