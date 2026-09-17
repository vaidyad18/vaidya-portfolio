import { NextResponse } from "next/server";
import { getGfgData } from "@/app/lib/api-fetchers";

export const revalidate = 3600; // Cache on server for 1 hour

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const username = searchParams.get("username") || "vaidyadantq0y";

	try {
		const result = await getGfgData(username);

		return NextResponse.json(result, {
			headers: {
				"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
			},
		});
	} catch (error) {
		console.error("Error in GFG proxy route:", error);
		return NextResponse.json(
			{ error: "Failed to fetch GFG data" },
			{ status: 500 },
		);
	}
}
