import { NextResponse } from "next/server";
import { getCodeforcesData } from "@/app/lib/api-fetchers";

export const revalidate = 3600; // Cache on server for 1 hour

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const username = searchParams.get("username") || "Medhansh_217";

	try {
		const result = await getCodeforcesData(username);

		return NextResponse.json(result, {
			headers: {
				"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
			},
		});
	} catch (error) {
		console.error("Error in Codeforces proxy route:", error);
		return NextResponse.json(
			{ error: "Failed to fetch Codeforces data" },
			{ status: 500 },
		);
	}
}
