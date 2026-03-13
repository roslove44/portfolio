import { Github, Linkedin, FileText } from "lucide-react";

const links = [
	{ href: "https://github.com/rostandmigan", icon: Github, label: "GitHub" },
	{ href: "https://linkedin.com/in/rostandmigan", icon: Linkedin, label: "LinkedIn" },
	{ href: "/resume", icon: FileText, label: "Resume", internal: true },
] as const;

export default function SocialLinks() {
	return (
		<div className="flex items-center gap-3">
			{links.map(({ href, icon: Icon, label }) => (
				<a
					key={label}
					href={href}
					target={href.startsWith("http") ? "_blank" : undefined}
					rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
					aria-label={label}
					className="text-text-secondary transition-colors hover:text-text-primary"
				>
					<Icon size={20} />
				</a>
			))}
		</div>
	);
}
