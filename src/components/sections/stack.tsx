"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import StackModal from "@/components/modals/stack-modal";

export default function Stack() {
	const t = useTranslations("stack");
	const [open, setOpen] = useState(false);

	return (
		<section className="py-6">
			<button
				onClick={() => setOpen(true)}
				className="group text-left text-[15px] text-text-secondary transition-colors hover:text-accent"
			>
				{t.rich("teaser", {
					bold: (chunks) => (
						<span className="font-semibold text-text-primary transition-colors group-hover:text-accent">
							{chunks}
						</span>
					),
				})}
				<span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
					→
				</span>
			</button>
			<StackModal open={open} onClose={() => setOpen(false)} />
		</section>
	);
}
