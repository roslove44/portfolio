"use client";
import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { CAL_LINK } from "@/data/constants";

export function useCalEmbed() {
	const { resolvedTheme } = useTheme();

	useEffect(() => {
		(async () => {
			const cal = await getCalApi();
			cal("ui", {
				theme: resolvedTheme === "dark" ? "dark" : "light",
				hideEventTypeDetails: false,
				cssVarsPerTheme: {
					light: { "cal-brand": "#2563eb" },
					dark: { "cal-brand": "#60a5fa" },
				},
			});
		})();
	}, [resolvedTheme]);
}

export function calDataAttributes() {
	return {
		"data-cal-link": CAL_LINK,
		"data-cal-config": '{"layout":"month_view"}',
	} as const;
}
