"use client";
import { getCalApi } from "@calcom/embed-react";
import { CAL_LINK } from "@/data/constants";

export async function openCalModal(theme: "dark" | "light") {
	const cal = await getCalApi();
	cal("ui", {
		theme,
		hideEventTypeDetails: false,
		cssVarsPerTheme: {
			light: { "cal-brand": "#2563eb" },
			dark: { "cal-brand": "#60a5fa" },
		},
	});
	cal("modal", { calLink: CAL_LINK, config: { layout: "month_view" } });
}
