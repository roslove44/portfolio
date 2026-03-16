import { FileTextIcon, MailIcon } from "lucide-react";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/ui/icons";
import { SOCIAL_LINKS } from "@/data/constants";

const links = [
	{ href: SOCIAL_LINKS.github, icon: GitHubIcon, label: "GitHub" },
	{ href: SOCIAL_LINKS.linkedin, icon: LinkedInIcon, label: "LinkedIn" },
	{ href: SOCIAL_LINKS.x, icon: XIcon, label: "X" },
	{ href: `mailto:${SOCIAL_LINKS.email}`, icon: MailIcon, label: "Email" },
	{ href: "/resume", icon: FileTextIcon, label: "Resume", internal: true },
];

export default function SocialLinks() {
	return (
		<div className="flex items-center gap-3">
			{links.map(({ href, icon: Icon, label, internal }, i) => (
				<a
					key={label}
					href={href}
					target={href.startsWith("http") || href.startsWith("mailto:") || internal ? "_blank" : undefined}
					rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
					aria-label={label}
					title={label}
					className="text-text-secondary transition-colors hover:text-text-primary"
				>
					<Icon className={i === links.length - 1 ? "size-4" : "size-5"} />
				</a>
			))}
		</div>
	);
}
