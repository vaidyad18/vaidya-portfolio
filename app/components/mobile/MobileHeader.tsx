import Link from "next/link";
import MobileClock from "./MobileClock";
import { profile } from "@/app/data/profile";

export default function MobileHeader() {
	const nameParts = profile.name.toLowerCase().split(" ");
	const firstName = nameParts[0] || "";
	const lastName = nameParts.slice(1).join(".") || "";

	return (
		<div className="xl:hidden">
			<header className="@container mx-auto w-full max-w-2xl border-x-[3px] border-b-[3px] border-border px-fluid-sm py-4 flex flex-wrap items-center justify-between gap-x-fluid-sm gap-y-fluid-xs">
				<div className="flex items-center gap-fluid-sm min-w-0">
					<MobileClock />
					<Link
						href="/"
						className="brand-wordmark font-serif font-bold tracking-tight text-h3 text-foreground leading-none min-w-0 select-none active:translate-x-px active:opacity-70 transition-transform"
					>
						{firstName}<span className="text-accent">{lastName ? `.${lastName}` : ""}</span>
					</Link>
				</div>
			</header>
		</div>
	);
}

