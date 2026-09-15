"use client";

import { useState } from "react";
import { FiThumbsUp, FiThumbsDown, FiDownload } from "react-icons/fi";
import ShareActionButton from "./ShareActionButton";

interface MobileActionRowProps {
	url: string;
	projectName: string;
	videoFileName: string;
}

export default function MobileActionRow({ url, projectName, videoFileName }: MobileActionRowProps) {
	const [interaction, setInteraction] = useState<"NONE" | "LIKED" | "DISLIKED">("NONE");

	// Generate a stable pseudo-random initial like count based on project name
	const initialLikes = (projectName.length * 7) + 42;
	const likesCount = interaction === "LIKED" ? initialLikes + 1 : initialLikes;

	const handleLike = () => {
		if (interaction === "LIKED" || interaction === "DISLIKED") {
			setInteraction("NONE");
		} else {
			setInteraction("LIKED");
		}
	};

	const handleDislike = () => {
		if (interaction === "DISLIKED" || interaction === "LIKED") {
			setInteraction("NONE");
		} else {
			setInteraction("DISLIKED");
		}
	};

	return (
		<div className="flex items-center gap-fluid-sm shrink-0">
			{/* Like & Dislike clustered */}
			<div className="flex items-center gap-0">
				<button
					onClick={handleLike}
					aria-label="Like"
					className="flex items-center justify-center min-w-[var(--spacing-fluid-xl-val)] min-h-[var(--spacing-fluid-xl-val)] text-foreground gap-1.5 px-[var(--spacing-fluid-xs-val)]"
				>
					<FiThumbsUp size="1.25em" className={interaction === "LIKED" ? "fill-foreground" : ""} />
					<span className="font-sans text-caption font-bold">{likesCount}</span>
				</button>
				<button
					onClick={handleDislike}
					aria-label="Dislike"
					className="flex items-center justify-center min-w-[var(--spacing-fluid-xl-val)] min-h-[var(--spacing-fluid-xl-val)] text-foreground"
				>
					<FiThumbsDown size="1.25em" className={interaction === "DISLIKED" ? "fill-foreground" : ""} />
				</button>
			</div>
			{/* Share & Download */}
			<div className="flex items-center gap-0">
				<ShareActionButton url={url} />
				<a
					href={`/videos/${videoFileName}.mp4`}
					download
					aria-label="Download video"
					className="flex items-center justify-center min-w-[var(--spacing-fluid-xl-val)] min-h-[var(--spacing-fluid-xl-val)] text-foreground"
					title="Download"
				>
					<FiDownload size="1.25em" />
				</a>
			</div>
		</div>
	);
}
