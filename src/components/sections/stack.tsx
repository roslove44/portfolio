"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import StackModal from "@/components/modals/stack-modal";
import { ChevronRightIcon, ScrollText } from "lucide-react";
import { STACK_CATEGORIES } from "@/data/constants";

export default function Stack() {
	const t = useTranslations("stack");
	const [open, setOpen] = useState(false);

	return (
		<section className="py-3">
			<h2 className="mb-2 font-semibold tracking-widest text-text-primary">
				{t("title")}
			</h2>
			<p className="text-[15px] text-text-primary">
				<ChevronRightIcon
					size={18}
					className={`shrink-0 inline me-2 text-text-secondary transition-transform duration-200 group-hover:text-accent ${open ? "rotate-90" : ""}`}
				/>
				{t("statement")} {" "}
				<button onClick={() => setOpen(true)} className="font-medium text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:text-accent-hover hover:decoration-accent">
					{t("cta")} <ScrollText size={16} className="ml-px inline-block animate-bot-float text-accent" />
				</button>
			</p>
			<dl className="sr-only">
				{Object.values(STACK_CATEGORIES).flat().map((tech) => (
					<div key={tech.key}>
						<dt>{tech.name}</dt>
						<dd>{t(`desc.${tech.key}`)}</dd>
					</div>
				))}
			</dl>
			<StackModal open={open} onClose={() => setOpen(false)} />
		</section>
	);
}
