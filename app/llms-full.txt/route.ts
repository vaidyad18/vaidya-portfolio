import { NextResponse } from "next/server";
import { generateLlmsText } from "@/app/llms.txt/route";

export async function GET() {
	const content = generateLlmsText();
	return new NextResponse(content, {
		status: 200,
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=86400",
		},
	});
}
