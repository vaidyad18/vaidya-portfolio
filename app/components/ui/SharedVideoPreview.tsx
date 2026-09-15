"use client";

import { useEffect, useRef, useState } from "react";

interface SharedVideoPreviewProps {
	projectFileName: string;
	className?: string;
}

export default function SharedVideoPreview({
	projectFileName,
	className = "",
}: SharedVideoPreviewProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setIsVisible(true);
						video.play().catch(() => {});
					} else {
						video.pause();
					}
				}
			},
			{ threshold: 0.1, rootMargin: "50px" }
		);

		observer.observe(video);
		return () => observer.disconnect();
	}, []);

	return (
		<video
			ref={videoRef}
			className={`object-cover ${className}`}
			loop
			muted
			playsInline
			preload="none"
			poster={`/videos/${projectFileName}.webp`}
		>
			{isVisible && (
				<>
					<source src={`/videos/${projectFileName}.webm`} type="video/webm" />
					<source src={`/videos/${projectFileName}.mp4`} type="video/mp4" />
				</>
			)}
			Your browser does not support the video tag.
		</video>
	);
}
