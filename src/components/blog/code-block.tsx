"use client";
import { useRef } from "react";
import CopyButton from "./copy-button";

interface Props {
	children: React.ReactNode;
	"data-language"?: string;
}

export default function CodeBlock({ children, "data-language": lang, ...props }: Props) {
	const preRef = useRef<HTMLPreElement>(null);

	return (
		<div className="group relative my-6 overflow-hidden rounded-lg bg-terminal-bg">
			<div className="absolute right-3 top-3 z-10 flex items-center gap-2 rounded-md bg-terminal-header px-2 py-1 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
				{lang && (
					<span className="text-[11px] font-medium uppercase tracking-wider text-terminal-text-muted" aria-hidden="true">
						{lang}
					</span>
				)}
				<CopyButton preRef={preRef} />
			</div>
			<pre ref={preRef} {...props} className="overflow-x-auto text-sm leading-relaxed" style={{ padding: "20px" }}>
				{children}
			</pre>
		</div>
	);
}
