import { ExternalLinkIcon } from "lucide-react";
import { GitHubAltIcon } from "@/components/ui/icons";
import type { Project } from "@/data/projects";

interface Props {
	project: Project;
	t: (key: string) => string;
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
	showStack?: boolean;
}

export default function ProjectCard({ project, t, onClick, showStack = false }: Props) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="group relative rounded-sm border border-transparent px-2 py-1.5 text-left transition-all duration-200 hover:border-border/60 hover:bg-surface/60 hover:shadow-xs hover:backdrop-blur-md dark:hover:border-border/40 dark:hover:bg-surface/40"
		>
			{/* Hover icons — top right */}
			<div className="absolute right-2 top-2 flex items-center gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
				{project.github && (
					<a
						href={project.github}
						target="_blank"
						rel="noopener noreferrer"
						className="text-text-secondary transition-colors hover:text-accent"
						aria-label={`GitHub — ${t(`${project.key}.name`)}`}
						onClick={(e) => e.stopPropagation()}
					>
						<GitHubAltIcon className="size-3.5" />
					</a>
				)}
				{project.live && (
					<a
						href={project.live}
						target="_blank"
						rel="noopener noreferrer"
						className="text-text-secondary transition-colors hover:text-accent"
						aria-label={`${t(`${project.key}.name`)} — Live`}
						onClick={(e) => e.stopPropagation()}
					>
						<ExternalLinkIcon size={13} />
					</a>
				)}
			</div>

			<h3 className="text-sm font-medium tracking-tight text-text-primary">
				{t(`${project.key}.name`)}
			</h3>
			<p className="mt-0.5 text-[12.5px] text-text-secondary line-clamp-3 lg:line-clamp-2">
				{t(`${project.key}.summary`)}
			</p>
			{showStack && project.stack.length > 0 && (
				<div className="mt-1.5 flex flex-wrap gap-x-1.5 gap-y-0.5 font-medium" aria-label={`Stack: ${project.stack.join(", ")}`} role="list">
					{project.stack.map((tech) => (
						<span key={tech} className="text-[11px] text-text-secondary" role="listitem" aria-label={tech}>
							<span aria-hidden="true">#</span>{tech}
						</span>
					))}
				</div>
			)}
		</button>
	);
}
