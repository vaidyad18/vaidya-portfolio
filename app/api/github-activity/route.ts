import { NextResponse } from "next/server";
import { getCommitFeed } from "@/app/lib/api-fetchers";

export const revalidate = 60; // Cache on server for 1 minute

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const username = searchParams.get("username") || undefined;

	try {
		const commitsList = await getCommitFeed(username);

		return NextResponse.json(commitsList || [], {
			headers: {
				"Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
			},
		});
	} catch (error) {
		console.error("Error in GitHub activity proxy:", error);
		return NextResponse.json(
			{ error: "Failed to fetch commit activity" },
			{ status: 500 },
		);
	}
}
