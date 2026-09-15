import { NextResponse } from "next/server";
import { profile, staticRoutes, getProjectSlug } from "@/app/data/profile";

const HOST = "medhanshk.me";
const BASE_URL = `https://${HOST}`;
const KEY = "4acab0b6b1664896bf7d6705e9b0908f";
const KEY_LOCATION = `${BASE_URL}/${KEY}.txt`;

function getIndexNowUrls(): string[] {
	const staticUrls = staticRoutes.map((r) =>
		r.path.startsWith("http") ? r.path : `${BASE_URL}${r.path}`
	);
	const projectUrls = profile.projects.map(
		(p) => `${BASE_URL}/projects/${getProjectSlug(p.title)}`
	);

	const coreUrls = [
		`${BASE_URL}/`,
		...staticUrls,
		...projectUrls,
		`${BASE_URL}/llms.txt`,
		`${BASE_URL}/sitemap.xml`,
	];

	return Array.from(new Set(coreUrls));
}

export async function GET() {
	const urlList = getIndexNowUrls();

	const payload = {
		host: HOST,
		key: KEY,
		keyLocation: KEY_LOCATION,
		urlList,
	};

	try {
		const response = await fetch("https://api.indexnow.org/IndexNow", {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
			body: JSON.stringify(payload),
		});

		return NextResponse.json({
			success: response.ok || response.status === 202,
			status: response.status,
			submittedUrls: urlList.length,
			urlList,
			timestamp: new Date().toISOString(),
		});
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json(
			{
				success: false,
				error: message,
			},
			{ status: 500 }
		);
	}
}
