import { SITE_URL } from "@/data/constants";
import { SKILLS, sha256 } from "@/lib/skills";

export function GET() {
	const index = {
		$schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
		skills: SKILLS.map((skill) => ({
			name: skill.name,
			type: "skill-md",
			description: skill.description,
			url: `${SITE_URL}/.well-known/agent-skills/${skill.name}/SKILL.md`,
			digest: sha256(skill.body),
		})),
	};

	return new Response(JSON.stringify(index, null, 2), {
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "public, max-age=0, s-maxage=86400, must-revalidate",
		},
	});
}
