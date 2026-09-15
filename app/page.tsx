import { Suspense } from "react";
import ReactDOM from "react-dom";
import DesktopGrid from "./components/desktop/DesktopGrid";
import DesktopGridSkeleton from "./components/desktop/DesktopGridSkeleton";
import DesktopOnly from "./components/desktop/DesktopOnly";
import HeroSection from "./components/HeroSection";
import MobileHome from "./components/mobile/MobileHome";
import SkillStrip from "./components/SkillStrip";
import { JsonLd, getProfilePageSchema } from "./lib/jsonld";

export default function Home() {
	ReactDOM.preload("/videos/jansamadhan.webp", { as: "image", fetchPriority: "high", type: "image/webp" });
	ReactDOM.preload("/videos/nyayaai.webp", { as: "image", fetchPriority: "high", type: "image/webp" });

	return (
		<>
			<link rel="preload" as="image" href="/videos/jansamadhan.webp" type="image/webp" fetchPriority="high" />
			<link rel="preload" as="image" href="/videos/nyayaai.webp" type="image/webp" fetchPriority="high" />
			<JsonLd data={getProfilePageSchema("", "Medhansh Kapoor — AI/ML Engineer & Full-Stack Developer")} />
			<main id="main-content" className="flex-1 flex flex-col bg-background">
				<div className="hidden xl:flex flex-1 flex-col bg-background overflow-visible">
					<section className="w-full px-6 md:px-12 pt-3 md:pt-4 xl:pt-6 pb-6 min-h-0 flex-1 flex flex-col justify-center relative overflow-x-hidden">
						<div className="w-full max-w-[1824px] mx-auto h-auto min-h-0 flex flex-col">
							<div className="grid min-h-0 grid-cols-1 xl:grid-cols-[minmax(0,2.8fr)_repeat(3,minmax(0,1fr))] xl:grid-rows-[minmax(0,2fr)_minmax(0,1fr)] gap-4 aspect-[1824/732]">
								<div className="h-full min-h-0 flex flex-col justify-start clip-margin-5 [container-type:inline-size]">
									<HeroSection />
								</div>
								<DesktopOnly fallback={<DesktopGridSkeleton />}>
									<Suspense fallback={<DesktopGridSkeleton />}>
										<DesktopGrid />
									</Suspense>
								</DesktopOnly>
							</div>
						</div>
					</section>
				</div>
				<MobileHome />
			</main>
			<footer className="hidden xl:block">
				<SkillStrip />
			</footer>
		</>
	);
}
