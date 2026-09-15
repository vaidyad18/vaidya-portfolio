import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = "https://medhanshk.me";

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/api/"],
			},
			{
				userAgent: [
					"Googlebot",
					"Bingbot",
					"Applebot",
					"OAI-SearchBot",
					"ChatGPT-User",
					"GPTBot",
					"ClaudeBot",
					"Claude-SearchBot",
					"PerplexityBot",
					"Perplexity-User",
					"Google-Extended",
					"CCBot",
					"xAI-SearchBot",
					"GrokBot",
					"Twitterbot",
					"LinkedInBot",
					"facebookexternalhit",
				],
				allow: "/",
				disallow: ["/api/"],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
