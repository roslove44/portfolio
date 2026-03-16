"use client";
import { useTranslations } from "next-intl";
import { FileTextIcon } from "lucide-react";

export default function Resume() {
	const t = useTranslations("resume");

	return (
		<section className="py-3">
			<h2 className="mb-2 font-semibold tracking-wide text-text-primary">
				{t("title")}
			</h2>

			<ResumeTerminal />

			<div className="mt-3 flex items-center gap-2 justify-end text-[13px]">
				<a
					href="/resume.pdf"
					download="Rostand_MIGAN_Resume.pdf"
					className="font-medium text-secondary underline decoration-text-secondary/30 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
				>
					{t("cta")}
					<FileTextIcon size={16} className="ms-1 inline-block text-secondary" />
				</a>
			</div>
		</section>
	);
}

function ResumeTerminal() {
	const t = useTranslations("resume");

	return (
		<button
			type="button"
			aria-label="Open resume in new tab"
			onClick={() => window.open("/resume", "_blank", "noopener")}
			className="mt-3 w-full overflow-hidden rounded-lg border border-terminal-border bg-terminal-bg font-mono text-sm shadow-lg cursor-pointer text-left"
		>
			{/* macOS header */}
			<div className="flex items-center gap-2 border-b border-terminal-border bg-terminal-header px-4 py-2">
				<div className="flex gap-1.5">
					<div className="size-2.5 rounded-full bg-terminal-dot-close" aria-hidden="true" />
					<div className="size-2.5 rounded-full bg-terminal-dot-minimize" aria-hidden="true" />
					<div className="size-2.5 rounded-full bg-terminal-dot-maximize" aria-hidden="true" />
				</div>
				<span className="flex-1 text-center text-xs text-terminal-text-muted">
					rostand@dev: ~/resume
				</span>
			</div>

			{/* Terminal body */}
			<div className="p-4 leading-relaxed text-xs">
				<div>
					<span className="text-terminal-prompt">$ </span>
					<span className="text-terminal-text">{t("command")}</span>
				</div>
				<div>
					<span className="text-terminal-text-muted">{"//"} {t("punchline")}</span>
				</div>
			</div>
		</button>
	);
}
