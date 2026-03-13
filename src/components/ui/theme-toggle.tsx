"use client";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { Monitor, Sun, Moon } from "lucide-react";
import ToggleGroup from "./toggle-group";

const options = [
	{ value: "system", icon: <Monitor size={12} />, label: "System theme" },
	{ value: "light", icon: <Sun size={12} />, label: "Light theme" },
	{ value: "dark", icon: <Moon size={12} />, label: "Dark theme" },
];

const subscribe = () => () => { };

// Inspired by Grafikart's circle theme switcher
// https://grafikart.fr/tutoriels/theme-switcher-circle-2315
function switchTheme(setTheme: (t: string) => void, theme: string, event: React.MouseEvent<HTMLButtonElement>) {
	if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		setTheme(theme);
		return;
	}

	const { top, left, width, height } = event.currentTarget.getBoundingClientRect();
	const x = left + width / 2;
	const y = top + height / 2;
	const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

	document.documentElement.classList.add("theme-transitioning");

	const transition = document.startViewTransition(() => {
		flushSync(() => setTheme(theme));
	});

	transition.ready.then(() => {
		document.documentElement.animate(
			{ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
			{ duration: 500, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" },
		);
	});

	transition.finished.then(() => {
		document.documentElement.classList.remove("theme-transitioning");
	});
}

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const mounted = useSyncExternalStore(subscribe, () => true, () => false);

	if (!mounted) {
		return <div className="h-5 w-16 animate-pulse rounded-lg bg-border/50 dark:bg-surface" aria-hidden />;
	}

	return (
		<ToggleGroup
			items={options}
			value={theme ?? "system"}
			onChange={(value, event) => switchTheme(setTheme, value, event)}
		/>
	);
}
