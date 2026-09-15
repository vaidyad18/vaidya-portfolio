import { profile } from "@/app/data/profile";
import MobileHeroCTA from "./MobileHeroCTA";

export default function MobileHeroSection() {
	return (
		<section className="w-full flex flex-col items-start">
			{/* Open To Banner */}
			<div className="reveal inline-flex items-center gap-2 bg-accent-warning text-black px-3 py-1.5 text-caption font-bold uppercase tracking-widest border-[2px] border-border shadow-[2px_2px_0_0_#000] mb-fluid-sm">
				<span className="w-1.5 h-1.5 bg-black animate-pulse" />
				Open to Internships & Full-Time Roles
			</div>

			{/* Huge Name with Character Map */}
			<h1
				aria-label={profile.name}
				className="reveal font-gothic text-hero font-normal tracking-wide text-black leading-[0.8] cursor-default select-none -ml-1"
				style={{ animationDelay: "0.1s" }}
			>
				<span className="sr-only">{profile.name}</span>
				<span aria-hidden="true">
					{"Medhansh".split("").map((char, index) => (
						<span key={index} className="transition-all duration-300 active:[text-shadow:0_0_15px_rgba(220,38,38,0.55)]">
							{char}
						</span>
					))}
				</span>
			</h1>

			{/* Tagline */}
			<p className="reveal text-small font-bold tracking-widest text-muted-foreground uppercase mt-3 max-w-prose leading-relaxed" style={{ animationDelay: "0.2s" }}>
				{profile.tagline}
			</p>

			{/* CTA Icons */}
			<div className="reveal mt-fluid-sm w-full" style={{ animationDelay: "0.3s" }}>
				<MobileHeroCTA />
			</div>
		</section>
	);
}
