"use client";

import Link from "next/link";
import { useEffect } from "react";
import { FiAlertOctagon, FiHome, FiRefreshCw } from "react-icons/fi";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("App Router exception caught:", error);
	}, [error]);

	return (
		<main className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
			<div className="max-w-xl w-full bg-card text-card-foreground border-[3px] border-border shadow-xl p-8 md:p-12 flex flex-col items-center text-center">
				{/* Crash Badge */}
				<div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-3 py-1.5 text-[length:var(--text-fluid-xs)] font-mono font-bold uppercase tracking-widest border-[length:var(--border-fluid-sm)] border-border shadow-xs mb-6">
					<FiAlertOctagon className="w-[1.2em] h-[1.2em]" />
					CRITICAL_SYSTEM_ERROR
				</div>

				<h1 className="font-sans text-[length:var(--text-fluid-2xl)] font-black text-foreground uppercase tracking-tight">
					RUNTIME_EXCEPTION
				</h1>

				<p className="text-sm text-muted-foreground leading-relaxed mt-3 max-w-md font-mono bg-muted p-3 border border-border/20 rounded-sm">
					{error.message ||
						"An unexpected system fault occurred during render evaluation."}
				</p>

				<div className="mt-8 flex flex-wrap justify-center gap-4">
					<button
						onClick={() => reset()}
						className="inline-flex items-center gap-2 px-6 py-3 text-[length:var(--text-fluid-sm)] font-mono font-bold uppercase tracking-widest bg-accent text-accent-foreground border-[length:var(--border-fluid)] border-border shadow-md hover:shadow-[3px_3px_0_0_var(--border)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-200 cursor-pointer"
					>
						<FiRefreshCw className="w-[1.2em] h-[1.2em]" />
						Retry Runtime
					</button>
					<Link
						href="/"
						className="inline-flex items-center gap-2 px-6 py-3 text-[length:var(--text-fluid-sm)] font-mono font-bold uppercase tracking-widest bg-background text-foreground border-[length:var(--border-fluid)] border-border shadow-md hover:shadow-[3px_3px_0_0_var(--accent-secondary)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-200 cursor-pointer"
					>
						<FiHome className="w-[1.2em] h-[1.2em]" />
						Return Home
					</Link>
				</div>
			</div>
		</main>
	);
}
