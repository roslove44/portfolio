"use client";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export default function LangSwitch() {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	const nextLocale = locale === "en" ? "fr" : "en";

	function switchLocale() {
		router.replace(pathname, { locale: nextLocale });
	}

	return (
		<button
			onClick={switchLocale}
			aria-label={`Switch to ${nextLocale === "en" ? "English" : "Français"}`}
			title={`Switch to ${nextLocale === "en" ? "English" : "Français"}`}
			className="flex h-5 items-center rounded-md px-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
		>
			{nextLocale.toUpperCase()}
		</button>
	);
}
