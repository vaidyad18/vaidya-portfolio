"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	FiGithub,
	FiLinkedin,
	FiMail,
	FiInstagram,
	FiVideo,
	FiFileText,
	FiCheck,
} from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { profile } from "@/app/data/profile";
import MagneticWrap from "./MagneticWrap";

export default function HeroSection() {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(profile.email);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="flex flex-col items-center lg:items-start w-full">
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				className="inline-flex items-center gap-2 bg-accent-warning text-black px-3 py-1.5 xl:px-[clamp(0.5rem,1.5cqi,0.75rem)] xl:py-[clamp(0.25rem,1cqi,0.375rem)] text-[10px] xl:text-[clamp(0.5rem,1.2cqi,0.625rem)] font-bold uppercase tracking-widest border-[2px] border-border shadow-sm mb-4 xl:mb-[clamp(0.5rem,2cqi,1rem)]"
			>
				<span className="w-1.5 h-1.5 bg-black animate-pulse" />
				Open to Internships & Full-Time Roles
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				role="presentation"
				aria-hidden="true"
				className="font-gothic text-5xl md:text-7xl xl:text-[clamp(3.25rem,9.5cqi,5.25rem)] font-normal tracking-wide text-black leading-[0.9] cursor-default select-none"
			>
				{"Medhansh".split("").map((char, index) => (
					<span
						key={index}
						className="transition-all duration-300 hover:[text-shadow:0_0_15px_rgba(220,38,38,0.55)]"
					>
						{char}
					</span>
				))}
			</motion.div>

			<motion.p
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="text-base xl:text-[clamp(0.8rem,2cqi,1.1rem)] font-bold tracking-widest text-muted-foreground uppercase mt-3 xl:mt-[clamp(0.4rem,1.8cqi,0.85rem)]"
			>
				{profile.tagline}
			</motion.p>

			<motion.p
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="text-sm xl:text-[clamp(0.85rem,2.1cqi,1.05rem)] text-muted-foreground leading-relaxed mt-3 xl:mt-[clamp(0.4rem,1.8cqi,0.85rem)] text-justify w-full max-w-prose"
			>
				{profile.intro}
			</motion.p>

			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="flex flex-row flex-nowrap gap-2 xl:gap-3 mt-4 xl:mt-[clamp(0.5rem,2cqi,1rem)] w-fit"
			>
				<MagneticWrap>
					<a
						href="https://x.com/medhansh541"
						target="_blank"
						rel="me noopener noreferrer"
						title="X (Twitter)"
						aria-label="X (Twitter)"
						className="group flex items-center justify-center h-[clamp(2.5rem,4cqi,3.5rem)] min-w-[clamp(2.5rem,4cqi,3.5rem)] px-0 hover:px-3 xl:hover:px-4 bg-background text-foreground border-[3px] border-border shadow-sm hover:shadow-[3px_3px_0_0_var(--color-accent-secondary)] hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-300 select-none cursor-pointer overflow-hidden"
					>
						<FaXTwitter size={20} className="shrink-0" aria-hidden="true" />
						<span className="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 font-bold uppercase tracking-widest text-[10px] xl:text-xs">
							Twitter
						</span>
					</a>
				</MagneticWrap>
				<MagneticWrap>
					<a
						href="https://www.instagram.com/medhansh341/"
						target="_blank"
						rel="me noopener noreferrer"
						title="Instagram"
						aria-label="Instagram"
						className="group flex items-center justify-center h-[clamp(2.5rem,4cqi,3.5rem)] min-w-[clamp(2.5rem,4cqi,3.5rem)] px-0 hover:px-3 xl:hover:px-4 bg-background text-foreground border-[3px] border-border shadow-sm hover:shadow-[3px_3px_0_0_var(--color-accent-secondary)] hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-300 select-none cursor-pointer overflow-hidden"
					>
						<FiInstagram size={20} className="shrink-0" aria-hidden="true" />
						<span className="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 font-bold uppercase tracking-widest text-[10px] xl:text-xs">
							Instagram
						</span>
					</a>
				</MagneticWrap>
				<MagneticWrap>
					<a
						href={profile.github}
						target="_blank"
						rel="me noopener noreferrer"
						title="GitHub"
						aria-label="GitHub"
						className="group flex items-center justify-center h-[clamp(2.5rem,4cqi,3.5rem)] min-w-[clamp(2.5rem,4cqi,3.5rem)] px-0 hover:px-3 xl:hover:px-4 bg-background text-foreground border-[3px] border-border shadow-sm hover:shadow-[3px_3px_0_0_var(--color-accent-secondary)] hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-300 select-none cursor-pointer overflow-hidden"
					>
						<FiGithub size={20} className="shrink-0" aria-hidden="true" />
						<span className="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 font-bold uppercase tracking-widest text-[10px] xl:text-xs">
							GitHub
						</span>
					</a>
				</MagneticWrap>
				<MagneticWrap>
					<a
						href={profile.linkedin}
						target="_blank"
						rel="me noopener noreferrer"
						title="LinkedIn"
						aria-label="LinkedIn"
						className="group flex items-center justify-center h-[clamp(2.5rem,4cqi,3.5rem)] min-w-[clamp(2.5rem,4cqi,3.5rem)] px-0 hover:px-3 xl:hover:px-4 bg-background text-foreground border-[3px] border-border shadow-sm hover:shadow-[3px_3px_0_0_var(--color-accent-secondary)] hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-300 select-none cursor-pointer overflow-hidden"
					>
						<FiLinkedin size={20} className="shrink-0" aria-hidden="true" />
						<span className="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 font-bold uppercase tracking-widest text-[10px] xl:text-xs">
							LinkedIn
						</span>
					</a>
				</MagneticWrap>
				<MagneticWrap>
					<button
						onClick={handleCopy}
						title={copied ? "Copied!" : "Copy Email"}
						aria-label={copied ? "Email address copied" : "Copy email address"}
						className={`group flex items-center justify-center h-[clamp(2.5rem,4cqi,3.5rem)] min-w-[clamp(2.5rem,4cqi,3.5rem)] px-0 hover:px-3 xl:hover:px-4 bg-background ${
							copied ? "text-green-500" : "text-foreground"
						} border-[3px] border-border shadow-sm hover:shadow-[3px_3px_0_0_var(--accent)] hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-300 select-none cursor-pointer overflow-hidden`}
					>
						{copied ? (
							<FiCheck size={20} className="shrink-0" aria-hidden="true" />
						) : (
							<FiMail size={20} className="shrink-0" aria-hidden="true" />
						)}
						<span className="max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100 group-hover:ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 font-bold uppercase tracking-widest text-[10px] xl:text-xs">
							{copied ? "Copied" : "Email"}
						</span>
					</button>
				</MagneticWrap>
				<MagneticWrap>
					<a
						href="https://cal.com/medhansh541"
						target="_blank"
						rel="me noopener noreferrer"
						title="Meet"
						aria-label="Schedule a meeting"
						className="group flex items-center justify-center h-[clamp(2.5rem,4cqi,3.5rem)] min-w-[clamp(2.5rem,4cqi,3.5rem)] px-0 hover:px-3 xl:hover:px-4 bg-background text-foreground border-[3px] border-border shadow-sm hover:shadow-[3px_3px_0_0_var(--color-accent-secondary)] hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-300 select-none cursor-pointer overflow-hidden"
					>
						<FiVideo size={20} className="shrink-0" aria-hidden="true" />
						<span className="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 font-bold uppercase tracking-widest text-[10px] xl:text-xs">
							Meet
						</span>
					</a>
				</MagneticWrap>
				<MagneticWrap>
					<a
						href="/resume.pdf"
						target="_blank"
						rel="noopener noreferrer"
						title="Resume"
						aria-label="Download resume PDF"
						className="group flex items-center justify-center h-[clamp(2.5rem,4cqi,3.5rem)] min-w-[clamp(2.5rem,4cqi,3.5rem)] px-0 hover:px-3 xl:hover:px-4 bg-background text-foreground border-[3px] border-border shadow-sm hover:shadow-[3px_3px_0_0_var(--color-accent-secondary)] hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-300 select-none cursor-pointer overflow-hidden"
					>
						<FiFileText size={20} className="shrink-0" aria-hidden="true" />
						<span className="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 font-bold uppercase tracking-widest text-[10px] xl:text-xs">
							Resume
						</span>
					</a>
				</MagneticWrap>
			</motion.div>
		</div>
	);
}
