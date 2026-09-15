import { NextResponse } from "next/server";
import { getLeetcodeData } from "@/app/lib/api-fetchers";

export const revalidate = 3600; // Cache on server for 1 hour

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const username = searchParams.get("username") || "iXfyEpMpyu";

	try {
		const result = await getLeetcodeData(username);

		return NextResponse.json(result, {
			headers: {
				"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
			},
		});
	} catch (error) {
		console.error("Error in LeetCode proxy route:", error);
		return NextResponse.json(
			{ error: "Failed to fetch LeetCode data" },
			{ status: 500 },
		);
	}
}
