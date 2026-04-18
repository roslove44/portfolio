import { getSkill } from "@/lib/skills";

export function GET() {
	const skill = getSkill("content-inventory");
	if (!skill) return new Response("Skill not found\n", { status: 404 });

	return new Response(skill.body, {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			"Cache-Control": "public, max-age=0, s-maxage=86400, must-revalidate",
		},
	});
}
