"use client";
import { useState } from "react";
import Image from "next/image";
import Lightbox from "@/components/ui/lightbox";

interface Props {
	src: string;
	alt: string;
}

export default function BlogCover({ src, alt }: Props) {
	const [open, setOpen] = useState(false);
	const slides = [{ type: "image" as const, src, alt }];

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				aria-label={alt ? `View image: ${alt}` : "View image in fullscreen"}
				className="group relative mb-8 block aspect-[8/3] w-full cursor-zoom-in overflow-hidden rounded-lg border border-border/30"
			>
				<Image
					src={src}
					alt={alt}
					fill
					priority
					sizes="(min-width: 768px) 720px, 100vw"
					className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
				/>
			</button>

			<Lightbox slides={slides} initialIndex={0} open={open} onClose={() => setOpen(false)} />
		</>
	);
}
