import { NextResponse } from "next/server";
import { getGithubData } from "@/app/lib/api-fetchers";

export const revalidate = 3600; // Cache on server for 1 hour

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const username = searchParams.get("username") || undefined;

	try {
		const payload = await getGithubData(username);

		return NextResponse.json(payload, {
			headers: {
				"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
			},
		});
	} catch (error) {
		console.error("Error in GitHub proxy:", error);
		return NextResponse.json(
			{ error: "Failed to fetch GitHub data" },
			{ status: 500 },
		);
	}
}
