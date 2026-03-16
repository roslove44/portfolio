import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Rostand MIGAN — Full Stack Developer & Builder",
		short_name: "Rostand MIGAN",
		description: "Full stack developer. I build things that work: web apps, fintech tools, and ideas that refuse to stay in my head.",
		start_url: "/",
		display: "standalone",
		background_color: "#0a0a0a",
		theme_color: "#0a0a0a",
		icons: [
			{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
		],
	};
}
