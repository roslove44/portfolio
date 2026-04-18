import { SITE_URL } from "@/data/constants";

export function GET() {
	const body = [
		"User-agent: *",
		"Allow: /",
		"Disallow: /api/",
		"Content-Signal: ai-train=yes, search=yes, ai-input=yes",
		"",
		`Sitemap: ${SITE_URL}/sitemap.xml`,
		`Host: ${SITE_URL}`,
		"",
	].join("\n");

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=0, s-maxage=86400, must-revalidate",
		},
	});
}
