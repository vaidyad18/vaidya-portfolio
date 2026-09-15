"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import HeaderClock from "./HeaderClock";
import MagneticWrap from "./MagneticWrap";

const links = [
	{ href: "/projects", label: "Projects" },
	{ href: "/experience", label: "Experience" },
	{ href: "/about", label: "About" },
	{ href: "/resume.pdf", label: "Resume", external: true },
];

export default function Navbar() {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();

	return (
		<nav className="hidden xl:block sticky top-0 z-50 w-full bg-background border-b-[3px] border-border px-6 md:px-12 py-4">
			<div className="w-full flex justify-between items-center">
				<div className="flex items-center gap-4">
					<HeaderClock />
					<Link
						href="/"
						className="font-serif text-2xl font-bold tracking-tight text-foreground"
					>
						medhansh<span className="text-accent">.kapoor</span>
					</Link>
				</div>

				<div className="hidden md:flex items-center gap-3">
					{links.map((l) => {
						const active = pathname === l.href;
						const LinkComponent = l.external ? "a" : Link;
						const externalProps = l.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
						return (
							<MagneticWrap key={l.href}>
								<LinkComponent
									href={l.href}
									title={l.label}
									{...externalProps}
									className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest border-[3px] transition-all duration-200 select-none cursor-pointer ${
										active
											? "bg-background text-foreground border-border shadow-[3px_3px_0_0_var(--accent)] translate-x-[1px] translate-y-[1px]"
											: "bg-background text-foreground border-border shadow-xs hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0_0_var(--color-accent-secondary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
									}`}
								>
									{l.label}
								</LinkComponent>
							</MagneticWrap>
						);
					})}
				</div>

				<div className="md:hidden flex items-center gap-3">
					<button
						onClick={() => setOpen(!open)}
						className="text-foreground focus:outline-none p-1"
						aria-label="Toggle menu"
					>
						{open ? (
							<FiX size={24} aria-hidden="true" />
						) : (
							<FiMenu size={24} aria-hidden="true" />
						)}
					</button>
				</div>
			</div>

			{open && (
				<div className="md:hidden w-full bg-background border-b-[3px] border-border px-6 py-4 flex flex-col space-y-4 mt-3">
					{links.map((l) => {
						const LinkComponent = l.external ? "a" : Link;
						const externalProps = l.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
						return (
							<LinkComponent
								key={l.href}
								href={l.href}
								title={l.label}
								onClick={() => setOpen(false)}
								{...externalProps}
								className={`block px-4 py-2 text-[11px] font-bold uppercase tracking-widest border-[3px] transition-all duration-200 ${
									pathname === l.href
										? "bg-background text-foreground border-border shadow-[3px_3px_0_0_var(--accent)] translate-x-[1px] translate-y-[1px]"
										: "bg-background text-foreground border-border shadow-xs"
								}`}
							>
								{l.label}
							</LinkComponent>
						);
					})}
				</div>
			)}
		</nav>
	);
}
