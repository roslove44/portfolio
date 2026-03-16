"use client";
import { useState } from "react";
import Image from "next/image";
import Lightbox from "@/components/ui/lightbox";

interface Props {
	src: string;
	alt?: string;
	caption?: string;
}

export default function BlogImage({ src, alt = "", caption }: Props) {
	const [open, setOpen] = useState(false);
	const slides = [{ type: "image" as const, src, alt }];

	return (
		<>
			<figure className="my-6">
				<button
					type="button"
					onClick={() => setOpen(true)}
					className="group relative w-full cursor-zoom-in overflow-hidden rounded-lg border border-border/30"
				>
					<Image
						src={src}
						alt={alt}
						width={768}
						height={432}
						className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
					/>
				</button>
				{caption && (
					<figcaption className="mt-2 text-center text-xs text-text-secondary">
						{caption}
					</figcaption>
				)}
			</figure>

			<Lightbox slides={slides} initialIndex={0} open={open} onClose={() => setOpen(false)} />
		</>
	);
}
