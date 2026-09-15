"use client";

import { useMatchMedia } from "@/app/lib/use-match-media";
import DesktopGridSkeleton from "./DesktopGridSkeleton";

interface DesktopOnlyProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export default function DesktopOnly({
	children,
	fallback = <DesktopGridSkeleton />,
}: DesktopOnlyProps) {
	const isDesktop = useMatchMedia("(min-width: 1280px)");

	// On mobile (< 1280px) or pre-hydration, render the fallback to skip hydrating heavy desktop widgets
	if (isDesktop !== true) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}

