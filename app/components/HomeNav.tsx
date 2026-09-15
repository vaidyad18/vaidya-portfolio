"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import MagneticWrap from "./MagneticWrap";

const links = [
	{ href: "/projects", label: "View Projects" },
	{ href: "/experience", label: "View Experience" },
	{ href: "/about", label: "About Me" },
];

export default function HomeNav() {
	return (
		<div className="max-w-4xl mx-auto px-6 py-4 text-center space-y-3 flex-1 flex flex-col justify-center">
			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5 }}
				className="text-xs text-muted-foreground font-bold uppercase tracking-widest"
			>
				Explore the full story
			</motion.p>
			<div className="flex flex-wrap justify-center gap-4">
				{links.map((l, i) => (
					<motion.div
						key={l.href}
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							type: "spring",
							stiffness: 120,
							damping: 14,
							delay: 0.6 + i * 0.12,
						}}
					>
						<MagneticWrap>
							<Link
								href={l.href}
								className={`group inline-flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-widest border-[3px] border-border shadow-md hover:shadow-lg transition-shadow duration-200 ${
									i === 0
										? "bg-accent text-accent-foreground border-accent"
										: "bg-background text-foreground"
								}`}
							>
								{l.label}{" "}
								<FiArrowRight className="group-hover:translate-x-1 transition-transform" />
							</Link>
						</MagneticWrap>
					</motion.div>
				))}
			</div>
		</div>
	);
}
