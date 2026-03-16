"use client";
import { useState } from "react";
import Image from "next/image";
import Lightbox from "@/components/ui/lightbox";

interface Props {
	images: string[];
	alts?: string[];
	columns?: 2 | 3;
}

export default function BlogGallery({ images, alts = [], columns = 2 }: Props) {
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [lightboxIndex, setLightboxIndex] = useState(0);

	const slides = images.map((src, i) => ({
		type: "image" as const,
		src,
		alt: alts[i] ?? "",
	}));

	const gridCols = columns === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2";

	return (
		<>
			<div className={`my-6 grid ${gridCols} gap-2`}>
				{images.map((src, i) => (
					<button
						key={src}
						type="button"
						onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
						aria-label={alts[i] ? `View image: ${alts[i]}` : `View image ${i + 1} of ${images.length}`}
						className="group relative cursor-zoom-in overflow-hidden rounded-lg border border-border/30"
					>
						<Image
							src={src}
							alt={alts[i] ?? ""}
							width={384}
							height={256}
							className="aspect-3/2 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
						/>
					</button>
				))}
			</div>

			<Lightbox slides={slides} initialIndex={lightboxIndex} open={lightboxOpen} onClose={() => setLightboxOpen(false)} />
		</>
	);
}
