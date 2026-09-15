import Link from "next/link";
import MobileClock from "./MobileClock";

export default function MobileHeader() {
	return (
		<div className="xl:hidden">
			<header className="@container mx-auto w-full max-w-2xl border-x-[3px] border-b-[3px] border-border px-fluid-sm py-4 flex flex-wrap items-center justify-between gap-x-fluid-sm gap-y-fluid-xs">
				<div className="flex items-center gap-fluid-sm min-w-0">
					<MobileClock />
					<Link
						href="/"
						className="brand-wordmark font-serif font-bold tracking-tight text-h3 text-foreground leading-none min-w-0 select-none active:translate-x-px active:opacity-70 transition-transform"
					>
						medhansh<span className="text-accent">.kapoor</span>
					</Link>
				</div>
			</header>
		</div>
	);
}
