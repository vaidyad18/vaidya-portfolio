import type { MetadataRoute } from "next";
import { profile, staticRoutes, getProjectSlug } from "@/app/data/profile";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://medhanshk.me";
	const now = new Date();

	const staticRouteUrls: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
		url: route.path.startsWith("http") ? route.path : `${baseUrl}${route.path}`,
		lastModified: now,
	}));

	const projectUrls: MetadataRoute.Sitemap = profile.projects.map((p) => ({
		url: `${baseUrl}/projects/${getProjectSlug(p.title)}`,
		lastModified: now,
	}));

	return [
		{
			url: baseUrl,
			lastModified: now,
		},
		...staticRouteUrls,
		...projectUrls,
	];
}
