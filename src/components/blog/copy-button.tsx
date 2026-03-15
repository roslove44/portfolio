"use client";
import { useState, type RefObject } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyButton({ preRef }: { preRef: RefObject<HTMLPreElement | null> }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		const text = preRef.current?.querySelector("code")?.textContent ?? "";
		await navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<button
			type="button"
			onClick={handleCopy}
			className="rounded p-1 text-terminal-text-muted transition-colors hover:text-terminal-text"
			aria-label="Copy code"
		>
			{copied ? (
				<Check size={14} className="text-green-400" />
			) : (
				<Copy size={14} />
			)}
		</button>
	);
}
