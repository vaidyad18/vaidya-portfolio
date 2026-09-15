"use client";

import { useState } from "react";
import { FiShare2, FiCheck } from "react-icons/fi";

interface ShareActionButtonProps {
	url: string;
}

export default function ShareActionButton({ url }: ShareActionButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleShare = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy link:", err);
		}
	};

	return (
		<button
			onClick={handleShare}
			aria-label="Share"
			className="flex items-center justify-center min-w-[var(--spacing-fluid-xl-val)] min-h-[var(--spacing-fluid-xl-val)] text-foreground transition-all"
			title="Share"
		>
			{copied ? <FiCheck size="1.25em" className="text-[var(--color-accent-success)]" /> : <FiShare2 size="1.25em" />}
		</button>
	);
}
