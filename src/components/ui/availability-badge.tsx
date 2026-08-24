"use client";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import AvailabilityModal from "@/components/modals/availability-modal";

export default function AvailabilityBadge({ label }: { label: string }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="badge-glow group inline-block rounded-full p-px"
				aria-haspopup="dialog"
			>
				<span className="flex items-center gap-1 rounded-full bg-background px-3 py-1 text-xs font-medium text-text-secondary transition-colors group-hover:text-text-primary">
					{label}
					<ArrowUpRight size={12} className="text-text-secondary transition-colors group-hover:text-accent" aria-hidden="true" />
				</span>
			</button>
			<AvailabilityModal open={open} onClose={() => setOpen(false)} />
		</>
	);
}
