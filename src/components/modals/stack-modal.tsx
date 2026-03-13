"use client";
import { useTranslations } from "next-intl";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import { STACK_CATEGORIES } from "@/data/constants";

type Line = {
	type: "prompt" | "header" | "item" | "text" | "error" | "blank";
	text?: string;
	desc?: string;
	last?: boolean;
	id: number;
};

const CATEGORY_NAMES = Object.keys(STACK_CATEGORIES);
const AUTO_TYPE_HINT = "help";
const AUTO_TYPE_DELAY = 800;
const AUTO_TYPE_SPEED = 100;
const DOTS = "·".repeat(50);

let lineId = 0;
function nextId() {
	return lineId++;
}

export default function StackModal({ open, onClose }: { open: boolean; onClose: () => void }) {
	const t = useTranslations("stack");
	const [lines, setLines] = useState<Line[]>([]);
	const [input, setInput] = useState("");
	const [history, setHistory] = useState<string[]>([]);
	const [historyIdx, setHistoryIdx] = useState(-1);
	const [ready, setReady] = useState(false);
	const [autoTyping, setAutoTyping] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const scrollRef = useRef<HTMLDivElement>(null);
	const autoTypeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const cancelAutoType = useCallback(() => {
		if (autoTypeRef.current) {
			clearTimeout(autoTypeRef.current);
			autoTypeRef.current = null;
		}
		setAutoTyping(false);
	}, []);

	const buildCategory = useCallback(
		(cat: string): Line[] => {
			const techs = STACK_CATEGORIES[cat];
			return [
				{ type: "header", text: cat, id: nextId() },
				...techs.map((tech, i) => ({
					type: "item" as const,
					text: tech.name,
					desc: t(`desc.${tech.key}`),
					last: i === techs.length - 1,
					id: nextId(),
				})),
			];
		},
		[t],
	);

	const buildAll = useCallback((): Line[] => {
		return CATEGORY_NAMES.flatMap((cat, i) => [
			...(i > 0 ? [{ type: "blank" as const, id: nextId() }] : []),
			...buildCategory(cat),
		]);
	}, [buildCategory]);

	const exec = useCallback(
		(cmd: string): Line[] | null => {
			const c = cmd.trim().toLowerCase();
			if (c === "clear") return null;

			const result: Line[] = [{ type: "prompt", text: cmd || "", id: nextId() }];
			if (!c) return result;

			if (c === "help") {
				result.push({ type: "text", text: t("help"), id: nextId() });
			} else if (c === "ls") {
				result.push({ type: "text", text: CATEGORY_NAMES.map((n) => `${n}/`).join("  "), id: nextId() });
			} else if (c === "ls -a" || c === "ls --all") {
				result.push(...buildAll());
			} else if (c.startsWith("ls ")) {
				const name = c.slice(3).replace(/\/$/, "");
				if (CATEGORY_NAMES.includes(name)) {
					result.push(...buildCategory(name));
				} else {
					result.push({ type: "error", text: `ls: ${name}: no such directory`, id: nextId() });
				}
			} else {
				result.push({ type: "error", text: `${c}: ${t("notFound")}`, id: nextId() });
			}

			return result;
		},
		[t, buildAll, buildCategory],
	);

	// Auto ls -a on open
	useEffect(() => {
		if (!open) return;

		setLines([]);
		setInput("");
		setHistory([]);
		setHistoryIdx(-1);
		setReady(false);
		setAutoTyping(false);

		const allLines: Line[] = [
			{ type: "prompt", text: "ls -a", id: nextId() },
			...buildAll(),
		];

		let i = 0;
		const timer = setInterval(() => {
			if (i < allLines.length) {
				const line = allLines[i];
				setLines((prev) => [...prev, line]);
				i++;
			} else {
				clearInterval(timer);
				setReady(true);
			}
		}, 30);

		return () => {
			clearInterval(timer);
			cancelAutoType();
		};
	}, [open, buildAll, cancelAutoType]);

	// Auto-type "help" after ready
	useEffect(() => {
		if (!ready) return;

		inputRef.current?.focus();
		setAutoTyping(true);

		let charIdx = 0;
		const typeNext = () => {
			if (charIdx < AUTO_TYPE_HINT.length) {
				const nextChar = AUTO_TYPE_HINT[charIdx];
				charIdx++;
				setInput((prev) => prev + nextChar);
				autoTypeRef.current = setTimeout(typeNext, AUTO_TYPE_SPEED);
			} else {
				setAutoTyping(false);
				autoTypeRef.current = null;
			}
		};

		autoTypeRef.current = setTimeout(typeNext, AUTO_TYPE_DELAY);

		return () => cancelAutoType();
	}, [ready, cancelAutoType]);

	useEffect(() => {
		if (!lines.length) return;
		scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
	}, [lines]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		cancelAutoType();
		const result = exec(input);
		if (result === null) {
			setLines([]);
		} else {
			setLines((prev) => [...prev, ...result]);
		}
		if (input.trim()) {
			setHistory((prev) => [...prev, input.trim()]);
		}
		setHistoryIdx(-1);
		setInput("");
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (autoTyping) {
			cancelAutoType();
			if (e.key.length === 1) {
				setInput(e.key);
			} else {
				setInput("");
			}
			e.preventDefault();
			return;
		}

		if (e.key === "ArrowUp") {
			e.preventDefault();
			if (!history.length) return;
			const idx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
			setHistoryIdx(idx);
			setInput(history[idx]);
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			if (historyIdx === -1) return;
			const idx = historyIdx + 1;
			if (idx >= history.length) {
				setHistoryIdx(-1);
				setInput("");
			} else {
				setHistoryIdx(idx);
				setInput(history[idx]);
			}
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (autoTyping) {
			cancelAutoType();
		}
		setInput(e.target.value);
	};

	return (
		<AnimatePresence>
			{open && (
				<Dialog static open={open} onClose={onClose} className="relative z-50">
					<DialogBackdrop
						as={motion.div}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-terminal-backdrop backdrop-blur-sm"
					/>
					<div className="fixed inset-0 flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							transition={{ duration: 0.7, ease: "easeInOut" }}
						>
							<DialogPanel
								className="w-full mx-auto max-w-11/12 min-w-11/12 sm:max-w-lg md:min-w-lg md:max-w-2xl overflow-hidden rounded-t-lg border border-terminal-border bg-terminal-bg font-mono text-sm shadow-2xl"
							>
								{/* macOS top bar */}
								<div className="flex items-center gap-2 border-b border-terminal-border bg-terminal-header px-4 py-2.5">
									<div className="flex gap-1.5">
										<button
											onClick={onClose}
											className="size-3 rounded-full bg-terminal-dot-close transition-opacity hover:opacity-80"
											aria-label="Close"
										/>
										<div className="size-3 rounded-full bg-terminal-dot-minimize" />
										<div className="size-3 rounded-full bg-terminal-dot-maximize" />
									</div>
									<span className="flex-1 text-center text-xs text-terminal-text-muted">
										rostand@dev: ~/stack
									</span>
								</div>

								{/* Terminal body */}
								<div
									ref={scrollRef}
									className="terminal-scroll max-h-[60vh] overflow-y-auto p-4 leading-relaxed"
									onClick={() => inputRef.current?.focus()}
								>
									{lines.map((line) => (
										<TerminalLine key={line.id} line={line} />
									))}

									{ready ? (
										<form onSubmit={handleSubmit} className="flex items-center">
											<span className="text-terminal-prompt me-1">$</span>
											<input
												ref={inputRef}
												value={input}
												onChange={handleChange}
												onKeyDown={handleKeyDown}
												className="flex-1 bg-transparent text-terminal-text caret-terminal-prompt outline-none"
												spellCheck={false}
												autoComplete="off"
											/>
										</form>
									) : (
										<span className="animate-cursor-blink text-terminal-prompt">▌</span>
									)}
								</div>
							</DialogPanel>
						</motion.div>
					</div>
				</Dialog>
			)}
		</AnimatePresence>
	);
}

const TerminalLine = memo(function TerminalLine({ line }: { line: Line }) {
	switch (line.type) {
		case "prompt":
			return (
				<div>
					<span className="text-terminal-prompt">$ </span>
					<span className="text-terminal-text">{line.text}</span>
				</div>
			);
		case "header":
			return <div className="mt-2 text-terminal-category">{line.text}/</div>;
		case "item":
			return (
				<div className={`flex items-baseline gap-x-2 pl-2${line.last ? " mb-2" : ""}`}>
					<span className="shrink-0 text-terminal-text">{line.text}</span>
					<span
						className="mx-1.5 hidden min-w-2 flex-1 overflow-hidden text-terminal-text-dim sm:inline"
						aria-hidden="true"
					>
						{DOTS}
					</span>
					<span className="min-w-0 flex-1 truncate text-right text-terminal-text-muted sm:flex-none sm:shrink-0">{line.desc}</span>
				</div>
			);
		case "text":
			return <div className="text-terminal-text-subtle">{line.text}</div>;
		case "error":
			return <div className="text-terminal-error">{line.text}</div>;
		case "blank":
			return <div className="h-2" />;
		default:
			return null;
	}
});
