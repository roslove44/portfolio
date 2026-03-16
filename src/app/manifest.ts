import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Portfolio - Rostand MIGAN",
		short_name: "Rostand MIGAN",
		description: "Full stack developer. I build things that work: web apps, fintech tools, and ideas that refuse to stay in my head.",
		start_url: "/",
		display: "standalone",
		background_color: "#0a0a0a",
		theme_color: "#0a0a0a",
		icons: [
			{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
			{ src: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
			{ src: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
		],
	};
}
