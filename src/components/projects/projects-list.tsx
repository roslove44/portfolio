"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { PROJECTS, PROJECT_TYPES, type Project, type ProjectType } from "@/data/projects";
import ProjectCard from "@/components/projects/project-card";
import ProjectModal, { type CardRect } from "@/components/projects/project-modal";
import { Fragment } from "react/jsx-runtime";

type Filter = "all" | ProjectType;
const FILTERS: Filter[] = ["all", ...PROJECT_TYPES];

function getFilteredProjects(filter: Filter): Project[] {
	const projects = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.type === filter);
	return [...projects].sort((a, b) => b.date.localeCompare(a.date));
}

export default function ProjectsList() {
	const t = useTranslations("projects");
	const [filter, setFilter] = useState<Filter>("all");
	const [selected, setSelected] = useState<{ project: Project; rect: CardRect | null } | null>(null);
	const projects = getFilteredProjects(filter);

	return (
		<>
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-xl font-semibold tracking-tight text-text-primary">
					{t("title")}
				</h1>

				<h2 className="sr-only">
					{t("list")}
				</h2>

				<div
					role="radiogroup"
					className="relative flex items-center gap-0.5 rounded-lg border border-border bg-border/50 px-0.5 py-0.5 dark:bg-surface"
				>
					{FILTERS.map((id) => {
						const isActive = filter === id;
						return (
							<button
								key={id}
								role="radio"
								aria-checked={isActive}
								onClick={() => setFilter(id)}
								className="relative z-10 rounded-md px-1.5 py-px transition-colors"
							>
								<span className={`text-xs font-medium ${isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}`}>
									{t(`filters.${id}`)}
								</span>
								{isActive && (
									<motion.span
										layoutId="project-filter"
										className="absolute inset-0 rounded-md bg-background shadow-sm"
										style={{ zIndex: -1 }}
										transition={{ type: "spring", stiffness: 500, damping: 35 }}
									/>
								)}
							</button>
						);
					})}
				</div>
			</div>

			{projects.length === 0 ? (
				<p className="text-sm text-text-secondary text-center">{t("empty")}</p>
			) : (
				<div className="grid grid-cols-1">
					{projects.map((project, i) => (
						<Fragment key={project.key}>
							<ProjectCard
								project={project}
								t={t}
								showStack
								showDate
								onClick={(e) => {
									const r = e.currentTarget.getBoundingClientRect();
									setSelected({ project, rect: { top: r.top, left: r.left, width: r.width, height: r.height } });
								}}
							/>
							{i < projects.length - 1 && <hr className="text-border my-4" />}
						</Fragment>
					))}
				</div>
			)}

			<ProjectModal
				project={selected?.project ?? null}
				cardRect={selected?.rect ?? null}
				onClose={() => setSelected(null)}
			/>
		</>
	);
}
