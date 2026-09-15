"use client";

import Link from "next/link";
import MagneticWrap from "@/app/components/MagneticWrap";

const navLinks = [
	{ href: "/", label: "Home" },
	{ href: "/projects", label: "Projects" },
	{ href: "/experience", label: "Experience" },
	{ href: "/about", label: "About" },
];

export default function NotFound() {
	return (
		<main className="min-h-[calc(100svh-var(--spacing-fluid-xl)*2)] flex items-center justify-center px-4 py-fluid-xl bg-background">
			<div className="w-full max-w-lg bg-card text-card-foreground border-[3px] border-border shadow-md p-fluid-lg text-center flex flex-col items-center">
				{/* 404 Gothic Title */}
				<h1 className="font-gothic text-display text-accent leading-none select-none">
					404
				</h1>

				{/* Semantic Subtitle */}
				<h2 className="font-sans text-h2 font-bold uppercase tracking-tight text-foreground mt-fluid-xs">
					PAGE NOT FOUND
				</h2>

				{/* Clean Description */}
				<p className="font-sans text-small text-muted-foreground leading-relaxed mt-fluid-xs max-w-sm">
					The page you are looking for does not exist or has been moved.
				</p>

				{/* Exact Navbar-Styled Buttons */}
				<div className="mt-fluid-lg flex flex-wrap items-center justify-center gap-fluid-sm w-full">
					{navLinks.map((l) => (
						<MagneticWrap key={l.href}>
							<Link
								href={l.href}
								prefetch={true}
								className="min-h-11 px-4 py-2 text-caption font-bold uppercase tracking-widest border-[3px] border-border bg-background text-foreground shadow-xs hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0_0_var(--color-accent-secondary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-200 select-none cursor-pointer inline-flex items-center justify-center"
							>
								{l.label}
							</Link>
						</MagneticWrap>
					))}
				</div>
			</div>
		</main>
	);
}
