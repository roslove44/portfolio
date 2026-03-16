"use client";
import { useState } from "react";
import Image from "next/image";
import Lightbox from "@/components/ui/lightbox";

interface Props {
	size?: number;
}

const SLIDES = [{ type: "image" as const, src: "/avatar.webp", alt: "Rostand MIGAN", legend: "Rostand MIGAN - 2026" }];

export default function Avatar({ size = 36 }: Props) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="avatar-glow shrink-0 cursor-zoom-in rounded-full p-0.5"
			>
				<Image
					src="/avatar.webp"
					alt="Rostand MIGAN"
					width={size}
					height={size}
					className="aspect-square rounded-full object-cover object-center bg-background"
				/>
			</button>

			<Lightbox slides={SLIDES} initialIndex={0} open={open} onClose={() => setOpen(false)} />
		</>
	);
}
