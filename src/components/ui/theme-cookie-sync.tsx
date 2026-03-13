"use client";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function ThemeCookieSync() {
	const { resolvedTheme } = useTheme();

	useEffect(() => {
		if (resolvedTheme) {
			document.cookie = `theme=${resolvedTheme};path=/;max-age=31536000;SameSite=Lax`;
		}
	}, [resolvedTheme]);

	return null;
}
