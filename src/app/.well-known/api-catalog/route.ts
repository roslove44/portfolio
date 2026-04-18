import { SITE_URL } from "@/data/constants";

export function GET() {
	const catalog = {
		linkset: [
			{
				anchor: `${SITE_URL}/api/md`,
				"service-desc": [
					{ href: `${SITE_URL}/api/openapi.json`, type: "application/json" },
				],
				"service-doc": [
					{ href: `${SITE_URL}/api/docs`, type: "text/markdown" },
				],
				status: [
					{ href: `${SITE_URL}/api/health`, type: "application/json" },
				],
			},
		],
	};

	return new Response(JSON.stringify(catalog, null, 2), {
		headers: {
			"Content-Type": "application/linkset+json",
			"Cache-Control": "public, max-age=0, s-maxage=86400, must-revalidate",
		},
	});
}
