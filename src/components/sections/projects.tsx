"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { PROJECTS, type Project } from "@/data/projects";
import ProjectCard from "@/components/projects/project-card";
import ProjectModal, { type CardRect } from "@/components/projects/project-modal";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

const TABS = ["featured", "latest"] as const;
type Tab = (typeof TABS)[number];

function getProjectsByTab(tab: Tab) {
	if (tab === "featured") return PROJECTS.filter((p) => p.featured);
	return [...PROJECTS].sort((a, b) => b.date.localeCompare(a.date));
}

export default function Projects() {
	const t = useTranslations("projects");
	const [tab, setTab] = useState<Tab>("featured");
	const [selected, setSelected] = useState<{ project: Project; rect: CardRect | null } | null>(null);
	const projects = getProjectsByTab(tab);

	return (
		<section className="py-3">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="font-semibold tracking-wide text-text-primary">
					{t("title")}
				</h2>
				<div
					role="radiogroup"
					className="relative flex items-center gap-0.5 rounded-lg border border-border bg-border/50 px-0.5 py-0.5 dark:bg-surface"
				>
					{TABS.map((id) => {
						const isActive = tab === id;
						return (
							<button
								key={id}
								role="radio"
								aria-checked={isActive}
								onClick={() => setTab(id)}
								className="relative z-10 rounded-md px-1.5 py-px transition-colors"
							>
								<span className={`text-xs font-medium ${isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}`}>
									{t(`tabs.${id}`)}
								</span>
								{isActive && (
									<motion.span
										layoutId="project-tab"
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

			<div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
				{projects.map((project) => (
					<ProjectCard
						key={project.key}
						project={project}
						t={t}
						onClick={(e) => {
							const r = e.currentTarget.getBoundingClientRect();
							setSelected({ project, rect: { top: r.top, left: r.left, width: r.width, height: r.height } });
						}}
					/>
				))}
			</div>

			<div className="mt-4 text-center lg:text-right">
				<p className="text-[13px] text-text-secondary tracking-wide">
					{t("others.summary")}
				</p>
				<Link href="/projects" className="mt-1 text-[13px] text-text-secondary inline-flex items-center gap-1 px-2 py-1 rounded-md transition-colors hover:bg-border/50 hover:text-text-primary">
					{t("others.cta")} <ArrowRight size={14} />
				</Link>
			</div>
			<ProjectModal
				project={selected?.project ?? null}
				cardRect={selected?.rect ?? null}
				onClose={() => setSelected(null)}
			/>
		</section>
	);
}
