"use client";
import { useEffect, useState } from "react";

export function useMatchMedia(query: string): boolean | null {
	const [matches, setMatches] = useState<boolean | null>(null);
	useEffect(() => {
		const mq = window.matchMedia(query);
		// eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from browser, idempotent
		setMatches(mq.matches);
		const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, [query]);
	return matches;
}
