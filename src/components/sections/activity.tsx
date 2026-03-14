import { getTranslations } from "next-intl/server";
import { fetchContributions } from "@/lib/github";
import ContributionGraph from "@/components/ui/contribution-graph";

export default async function Activity() {
	const t = await getTranslations("activity");
	const calendar = await fetchContributions("roslove44");

	if (!calendar) return null;

	return (
		<section className="py-3">
			<h2 className="sr-only mb-4 font-semibold tracking-wide text-text-primary">
				{t("title")}
			</h2>
			<ContributionGraph
				weeks={calendar.weeks}
				totalContributions={calendar.totalContributions}
			/>
		</section>
	);
}
