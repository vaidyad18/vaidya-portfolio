/**
 * Extracts the YouTube Video ID from standard YouTube or youtu.be URLs
 * and constructs a privacy-enhanced embed URL with autoplay and responsive controls.
 */
export function getYouTubeEmbedUrl(url?: string): string | null {
	if (!url) return null;

	const match = url.match(
		/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
	);

	if (!match || !match[1]) return null;

	const videoId = match[1];
	return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
}
