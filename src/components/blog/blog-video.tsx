"use client";
import { useState } from "react";
import { PlayIcon } from "lucide-react";
import Image from "next/image";
import ProjectLightbox from "@/components/projects/project-lightbox";

interface Props {
	url: string;
	title?: string;
	thumbnail?: string;
}

function toEmbedUrl(url: string): string {
	const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
	if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0`;
	const vm = url.match(/vimeo\.com\/(\d+)/);
	if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`;
	return url;
}

function getYouTubeThumbnail(url: string): string | null {
	const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
	return yt ? `https://img.youtube.com/vi/${yt[1]}/maxresdefault.jpg` : null;
}

export default function BlogVideo({ url, title = "Video", thumbnail }: Props) {
	const [open, setOpen] = useState(false);
	const embedUrl = toEmbedUrl(url);
	const thumbSrc = thumbnail ?? getYouTubeThumbnail(url);
	const slides = [{ type: "video" as const, embedUrl }];

	return (
		<>
			<figure className="my-6">
				{thumbSrc ? (
					<button
						type="button"
						onClick={() => setOpen(true)}
						className="group relative w-full cursor-pointer overflow-hidden rounded-lg border border-border/30"
					>
						<Image
							src={thumbSrc}
							alt={title}
							width={768}
							height={432}
							className="w-full object-cover brightness-75 transition-all duration-300 group-hover:brightness-90 group-hover:scale-[1.02]"
							loading="lazy"
							unoptimized={thumbSrc.startsWith("http")}
						/>
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="flex size-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
								<PlayIcon size={24} className="ml-0.5 text-white" fill="white" />
							</div>
						</div>
					</button>
				) : (
					<div className="overflow-hidden rounded-lg border border-border/30">
						<div className="relative aspect-video">
							<iframe
								src={embedUrl}
								title={title}
								allow="autoplay; fullscreen; picture-in-picture"
								allowFullScreen
								className="absolute inset-0 h-full w-full"
							/>
						</div>
					</div>
				)}
				{title !== "Video" && (
					<figcaption className="mt-2 text-center text-xs text-text-secondary">
						{title}
					</figcaption>
				)}
			</figure>

			<ProjectLightbox slides={slides} initialIndex={0} open={open} onClose={() => setOpen(false)} />
		</>
	);
}
