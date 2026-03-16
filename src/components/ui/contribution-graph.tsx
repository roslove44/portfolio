"use client";
import { useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { ContributionDay, ContributionWeek } from "@/lib/github";

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"] as const;

const LEVEL_CLASSES = [
	"bg-border/50 dark:bg-surface",
	"bg-accent/20",
	"bg-accent/40",
	"bg-accent/60",
	"bg-accent",
] as const;

function getLevel(count: number, max: number): number {
	if (count === 0 || max === 0) return 0;
	const ratio = count / max;
	if (ratio <= 0.25) return 1;
	if (ratio <= 0.5) return 2;
	if (ratio <= 0.75) return 3;
	return 4;
}

function getMonthLabel(week: ContributionWeek, prevWeek: ContributionWeek | undefined, t: (key: string) => string): string {
	const firstDay = week.contributionDays[0];
	if (!firstDay) return "";
	const month = new Date(firstDay.date).getMonth();
	if (!prevWeek) return "";
	const prevMonth = new Date(prevWeek.contributionDays[0].date).getMonth();
	return month !== prevMonth ? t(`months.${MONTHS[month]}`) : "";
}

interface Props {
	weeks: ContributionWeek[];
	totalContributions: number;
}

export default function ContributionGraph({ weeks, totalContributions }: Props) {
	const t = useTranslations("activity");
	const locale = useLocale();
	const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; count: number } | null>(null);

	const maxCount = Math.max(...weeks.flatMap(w => w.contributionDays.map(d => d.contributionCount)), 1);

	const handleMouseEnter = useCallback((e: React.MouseEvent, day: ContributionDay) => {
		const rect = e.currentTarget.getBoundingClientRect();
		setTooltip({
			x: rect.left + rect.width / 2,
			y: rect.top,
			date: day.date,
			count: day.contributionCount,
		});
	}, []);

	const handleMouseLeave = useCallback(() => setTooltip(null), []);

	const formatDate = (dateStr: string) =>
		new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateStr));

	// Day labels: Mon (index 1), Wed (3), Fri (5) in Sun-based week
	const dayLabels = Array.from({ length: 7 }, (_, i) =>
		i === 1 ? t("days.mon") : i === 3 ? t("days.wed") : i === 5 ? t("days.fri") : ""
	);

	return (
		<div className="mt-4">
			<div className="overflow-x-auto [scrollbar-width:thin] pb-2">
				<div className="inline-flex gap-0.75" role="img" aria-label={t("total", { count: totalContributions.toLocaleString(locale) })}>
					{/* Day labels */}
					<div className="flex flex-col gap-0.75" aria-hidden="true">
						<span className="h-3.25" />
						{dayLabels.map((label, i) => (
							<span key={i} className="flex h-2.5 w-6 items-center text-[10px] leading-none text-text-secondary">
								{label}
							</span>
						))}
					</div>

					{/* Week columns */}
					{weeks.map((week, wi) => (
						<div key={wi} className="flex w-2.5 shrink-0 flex-col gap-0.75" aria-hidden="true">
							<span className="h-3.25 text-[10px] leading-3.25 text-text-secondary">
								{getMonthLabel(week, weeks[wi - 1], t)}
							</span>
							{week.contributionDays.map((day, di) => (
								<div
									key={di}
									className={`h-2.5 w-2.5 rounded-xs ${LEVEL_CLASSES[getLevel(day.contributionCount, maxCount)]}`}
									onMouseEnter={(e) => handleMouseEnter(e, day)}
									onMouseLeave={handleMouseLeave}
								/>
							))}
						</div>
					))}
				</div>
			</div>

			{/* Footer: total + legend */}
			<div className="mt-2 flex items-center justify-between text-[11px] text-text-secondary">
				<span>
					{t("total", { count: totalContributions.toLocaleString(locale) })}
				</span>
				<div className="flex items-center gap-1">
					<span>{t("less")}</span>
					{LEVEL_CLASSES.map((cls, i) => (
						<div key={i} className={`h-2.5 w-2.5 rounded-xs ${cls}`} aria-hidden="true" />
					))}
					<span>{t("more")}</span>
				</div>
			</div>

			{/* Tooltip */}
			{tooltip && (
				<div
					role="tooltip"
					className="pointer-events-none fixed z-50"
					style={{ left: tooltip.x, top: tooltip.y - 8, transform: "translateX(-50%) translateY(-100%)" }}
				>
					<div className="rounded-md bg-text-primary px-2.5 py-1.5 text-xs text-background shadow-lg">
						<span className="font-medium">{formatDate(tooltip.date)}</span>
						<span className="text-background/70">
							{" — "}
							{tooltip.count} {tooltip.count === 1 ? "contribution" : "contributions"}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
