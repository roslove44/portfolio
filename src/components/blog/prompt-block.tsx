"use client";
import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

interface Props {
	children: React.ReactNode;
}

export default function PromptBlock({ children }: Props) {
	const contentRef = useRef<HTMLDivElement>(null);
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		const text = contentRef.current?.textContent ?? "";
		await navigator.clipboard.writeText(text.trim());
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="relative my-6 overflow-hidden rounded-xl border border-border">
			<div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2">
				<span className="font-mono text-[11px] font-medium uppercase tracking-widest text-text-secondary">
					Agent prompt
				</span>
				<button
					type="button"
					onClick={handleCopy}
					className="rounded p-1 text-text-secondary transition-colors hover:text-text-primary"
					aria-label={copied ? "Prompt copié" : "Copier le prompt"}
				>
					{copied ? (
						<Check size={14} className="text-green-500" aria-hidden="true" />
					) : (
						<Copy size={14} aria-hidden="true" />
					)}
				</button>
				<span className="sr-only" aria-live="polite" aria-atomic="true">
					{copied ? "Prompt copié" : ""}
				</span>
			</div>
			<div className="terminal-scroll relative max-h-56 overflow-y-auto bg-surface">
				<div
					ref={contentRef}
					className="px-5 py-4 text-sm leading-relaxed text-text-primary [&_p]:mb-3 [&_p]:font-mono [&_ul]:mb-3 [&_ul]:list-none [&_ul]:pl-0 [&_li]:font-mono [&_li]:before:mr-2 [&_li]:before:text-text-secondary [&_li]:before:content-['-']"
				>
					{children}
				</div>
				<div className="pointer-events-none sticky bottom-0 h-10 bg-linear-to-t from-surface to-transparent" />
			</div>
		</div>
	);
}
