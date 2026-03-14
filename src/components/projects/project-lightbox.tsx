"use client";
import { useState, useCallback } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import Image from "next/image";

type Slide = { type: "image"; src: string; alt: string } | { type: "video"; embedUrl: string };

interface Props {
	slides: Slide[];
	initialIndex: number;
	open: boolean;
	onClose: () => void;
}

function toEmbedUrl(url: string): string {
	const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
	if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0`;
	const vm = url.match(/vimeo\.com\/(\d+)/);
	if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`;
	return url;
}

export function buildSlides(project: { key: string; cover?: string; video?: string; images?: string[] }): Slide[] {
	const slides: Slide[] = [];
	if (project.video) {
		slides.push({ type: "video", embedUrl: toEmbedUrl(project.video) });
	}
	if (project.cover) {
		slides.push({ type: "image", src: `/projects/${project.key}/${project.cover}`, alt: project.key });
	}
	if (project.images) {
		for (const img of project.images) {
			slides.push({ type: "image", src: `/projects/${project.key}/${img}`, alt: project.key });
		}
	}
	return slides;
}

export default function ProjectLightbox({ slides, initialIndex, open, onClose }: Props) {
	const [index, setIndex] = useState(initialIndex);

	const prev = useCallback(() => setIndex((i) => (i > 0 ? i - 1 : slides.length - 1)), [slides.length]);
	const next = useCallback(() => setIndex((i) => (i < slides.length - 1 ? i + 1 : 0)), [slides.length]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "ArrowLeft") prev();
			else if (e.key === "ArrowRight") next();
		},
		[prev, next],
	);

	const slide = slides[index];

	return (
		<AnimatePresence>
			{open && (
				<Dialog static open={open} onClose={onClose} className="relative z-60">
					<DialogBackdrop className="fixed inset-0">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="h-full w-full bg-black/90 backdrop-blur-md"
						/>
					</DialogBackdrop>
					<div className="fixed inset-0 flex items-center justify-center p-4" onKeyDown={handleKeyDown}>
						<motion.div
							initial={{ opacity: 0, scale: 0.92 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.92 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
						>
							<DialogPanel className="relative h-[85vh] w-[90vw] max-w-5xl">
								{/* Close */}
								<button
									onClick={onClose}
									className="absolute -top-10 right-0 rounded-full p-1.5 text-white/70 transition hover:text-white"
									aria-label="Close"
								>
									<XIcon size={20} />
								</button>

								{/* Slide */}
								{slide.type === "image" ? (
									<Image
										src={slide.src}
										alt={slide.alt}
										fill
										sizes="90vw"
										className="rounded-lg object-contain"
									/>
								) : (
									<iframe
										src={slide.embedUrl}
										title="Video"
										allow="autoplay; fullscreen; picture-in-picture"
										allowFullScreen
										className="h-full w-full rounded-lg"
									/>
								)}

								{/* Navigation */}
								{slides.length > 1 && (
									<>
										<button
											onClick={prev}
											className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white/70 transition hover:bg-black/60 hover:text-white"
											aria-label="Previous"
										>
											<ChevronLeftIcon size={20} />
										</button>
										<button
											onClick={next}
											className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white/70 transition hover:bg-black/60 hover:text-white"
											aria-label="Next"
										>
											<ChevronRightIcon size={20} />
										</button>

										{/* Dots */}
										<div className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 gap-1.5">
											{slides.map((_, i) => (
												<button
													key={i}
													onClick={() => setIndex(i)}
													className={`size-1.5 rounded-full transition ${i === index ? "bg-white" : "bg-white/40"}`}
													aria-label={`Slide ${i + 1}`}
												/>
											))}
										</div>
									</>
								)}
							</DialogPanel>
						</motion.div>
					</div>
				</Dialog>
			)}
		</AnimatePresence>
	);
}
