"use client";

import Image from "next/image";
import { createContext, useContext, useEffect, useState } from "react";

export const CardDeckContext = createContext({ isTop: true });

interface CardDeckVideoProps {
	projectFileName: string;
	className?: string;
}

export default function CardDeckVideo({ projectFileName, className = "" }: CardDeckVideoProps) {
	const { isTop } = useContext(CardDeckContext);
	const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
	const [isVideoPlaying, setIsVideoPlaying] = useState(false);

	useEffect(() => {
		if (!isTop) {
			setShouldLoadVideo(false);
			setIsVideoPlaying(false);
			return;
		}

		const enableVideo = () => {
			setShouldLoadVideo(true);
		};

		// Enable video streaming on tutorial completion or any user interaction
		window.addEventListener("tutorial-complete", enableVideo, { once: true });
		window.addEventListener("touchstart", enableVideo, { once: true, passive: true });
		window.addEventListener("pointerdown", enableVideo, { once: true, passive: true });
		window.addEventListener("scroll", enableVideo, { once: true, passive: true });

		return () => {
			window.removeEventListener("tutorial-complete", enableVideo);
			window.removeEventListener("touchstart", enableVideo);
			window.removeEventListener("pointerdown", enableVideo);
			window.removeEventListener("scroll", enableVideo);
		};
	}, [isTop]);

	return (
		<div className="relative w-full h-full overflow-hidden bg-muted">
			{/* Permanent Image Base Layer - NEVER unmounted, holds LCP milestone */}
			<Image
				src={`/videos/${projectFileName}.webp`}
				alt={`${projectFileName.replace(/[-_]/g, " ")} — Production AI project video preview and poster`}
				fill
				sizes="(max-width: 640px) 100vw, 24rem"
				className={`object-cover ${className}`}
				priority={true}
				unoptimized={true}
				fetchPriority={isTop ? "high" : "auto"}
			/>

			{/* Video Preview Layer - Fades in seamlessly over the image once buffered */}
			{isTop && shouldLoadVideo && (
				<video
					className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${className} ${
						isVideoPlaying ? "opacity-100" : "opacity-0"
					}`}
					autoPlay
					loop
					muted
					playsInline
					preload="metadata"
					onPlaying={() => setIsVideoPlaying(true)}
				>
					<source src={`/videos/${projectFileName}.webm`} type="video/webm" />
					<source src={`/videos/${projectFileName}.mp4`} type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			)}
		</div>
	);
}
