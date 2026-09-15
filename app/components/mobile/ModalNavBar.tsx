"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ModalNavBarProps {
	onClose?: () => void;
	isDirect?: boolean;
}

export default function ModalNavBar({ onClose, isDirect }: ModalNavBarProps) {
	const router = useRouter();

	useEffect(() => {
		router.prefetch("/");
		router.prefetch("/projects");
	}, [router]);

	const navBtnClass =
		"min-w-[var(--spacing-fluid-xl-val)] min-h-[var(--spacing-fluid-xl-val)] flex items-center justify-center cursor-pointer active:opacity-70";

	return (
		<nav className="sticky bottom-0 w-full py-[var(--spacing-fluid-xs-val)] bg-muted border-t-2 border-border flex items-center justify-around shrink-0 mt-auto z-10">
			{/* Recent Apps */}
			<Link
				href="/projects"
				prefetch={true}
				onTouchStart={() => router.prefetch("/projects")}
				aria-label="Recent apps"
				className={navBtnClass}
			>
				<span className="font-sans font-bold text-foreground">|||</span>
			</Link>

			{/* Home Button: Instant close when in client mode, or Link to / when in direct mode */}
			{onClose ? (
				<button
					type="button"
					onClick={onClose}
					aria-label="Home"
					className={navBtnClass}
				>
					<div className="w-[var(--spacing-fluid-md-val)] h-[var(--spacing-fluid-md-val)] rounded-full border-2 border-foreground" />
				</button>
			) : (
				<Link
					href="/"
					prefetch={true}
					onTouchStart={() => router.prefetch("/")}
					aria-label="Home"
					className={navBtnClass}
				>
					<div className="w-[var(--spacing-fluid-md-val)] h-[var(--spacing-fluid-md-val)] rounded-full border-2 border-foreground" />
				</Link>
			)}

			{/* Back Button: Instant close when in client mode, or Link to /projects when in direct mode */}
			{onClose ? (
				<button
					type="button"
					onClick={onClose}
					aria-label="Back"
					className={navBtnClass}
				>
					<span className="font-sans font-bold text-foreground text-h3 leading-none -mt-1">&lt;</span>
				</button>
			) : (
				<Link
					href="/projects"
					prefetch={true}
					onTouchStart={() => router.prefetch("/projects")}
					aria-label="Back"
					className={navBtnClass}
				>
					<span className="font-sans font-bold text-foreground text-h3 leading-none -mt-1">&lt;</span>
				</Link>
			)}
		</nav>
	);
}

