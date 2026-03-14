"use client";
import { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { AnimatePresence, motion } from "motion/react";
import { ExternalLinkIcon, PlayIcon, XIcon as XMarkIcon } from "lucide-react";
import { GitHubAltIcon, GitHubIcon, LinkedInIcon, XIcon } from "@/components/ui/icons";
import Image from "next/image";
import type { Project } from "@/data/projects";
import ProjectLightbox, { buildSlides } from "./project-lightbox";

const COVER_MASK = "linear-gradient(rgb(0,0,0) 0%, rgba(0,0,0,0.99) 18.5%, rgba(0,0,0,0.953) 34.3%, rgba(0,0,0,0.894) 47.6%, rgba(0,0,0,0.824) 58.5%, rgba(0,0,0,0.74) 67.5%, rgba(0,0,0,0.647) 74.7%, rgba(0,0,0,0.55) 80.3%, rgba(0,0,0,0.45) 84.7%, rgba(0,0,0,0.353) 88%, rgba(0,0,0,0.26) 90.5%, rgba(0,0,0,0.176) 92.5%, rgba(0,0,0,0.106) 94.2%, rgba(0,0,0,0.047) 95.9%, rgba(0,0,0,0.01) 97.7%, transparent 100%)";

export interface CardRect {
	top: number;
	left: number;
	width: number;
	height: number;
}

const MODAL_WIDTH = 672; // max-w-2xl = 42rem = 672px

function useFlipTransform(cardRect: CardRect | null) {
	return useMemo(() => {
		const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (reducedMotion) {
			return {
				initial: { opacity: 0 },
				exit: { opacity: 0 },
				transition: { duration: 0.15 },
			};
		}

		if (!cardRect) {
			return {
				initial: { opacity: 0, y: 40 },
				exit: { opacity: 0, y: 40 },
				transition: { duration: 0.35, ease: "easeOut" as const },
			};
		}

		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const isMobile = vw < 640;

		// Card center
		const cardCx = cardRect.left + cardRect.width / 2;
		const cardCy = cardRect.top + cardRect.height / 2;

		// Modal estimated size — on mobile it's full width, on desktop capped at MODAL_WIDTH
		const modalW = isMobile ? vw : Math.min(vw - 32, MODAL_WIDTH);
		// Rough modal height estimate (cover 224 + content ~200)
		const modalH = isMobile ? vh * 0.85 : 424;

		// Modal center (centered in viewport)
		const modalCx = vw / 2;
		const modalCy = isMobile ? vh - modalH / 2 : vh / 2;

		// Delta from modal center to card center
		const deltaX = cardCx - modalCx;
		const deltaY = cardCy - modalCy;

		if (isMobile) {
			// Mobile: slide up from card Y position, no scale
			return {
				initial: { opacity: 0, y: Math.max(deltaY, 60) },
				exit: { opacity: 0, y: Math.max(deltaY, 60) },
				transition: { type: "spring" as const, stiffness: 300, damping: 30, opacity: { duration: 0.3 } },
			};
		}

		const scaleX = cardRect.width / modalW;
		const scaleY = cardRect.height / modalH;
		const scale = Math.max(0.15, Math.min((scaleX + scaleY) / 2, 0.9));

		return {
			initial: { opacity: 0, scale, x: deltaX, y: deltaY },
			exit: { opacity: 0, scale, x: deltaX, y: deltaY },
			transition: { type: "spring" as const, stiffness: 300, damping: 30, opacity: { duration: 0.3 } },
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cardRect?.top, cardRect?.left, cardRect?.width, cardRect?.height]);
}

type FlipValues = ReturnType<typeof useFlipTransform>;

interface ModalContentProps {
	project: Project;
	flip: FlipValues;
	onClose: () => void;
}

const SOCIAL_ICONS = {
	github: GitHubIcon,
	x: XIcon,
	linkedin: LinkedInIcon,
} as const;

function ModalContent({ project, flip, onClose }: ModalContentProps) {
	const t = useTranslations("projects");
	const [coverError, setCoverError] = useState(false);
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [lightboxIndex, setLightboxIndex] = useState(0);

	const openLightbox = useCallback((idx: number) => {
		setLightboxIndex(idx);
		setLightboxOpen(true);
	}, []);

	const slides = useMemo(() => buildSlides(project), [project]);
	const desc = t.raw(`${project.key}.desc`) as string[];
	const hasCover = !!project.cover && !coverError;
	const coverSrc = project.cover ? `/projects/${project.key}/${project.cover}` : "";
	const coverSlideIndex = project.video ? 1 : 0;

	return (
		<>
			<Dialog static open onClose={onClose} className="relative z-50">
				<DialogBackdrop className="fixed inset-0">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="h-full w-full bg-black/60 backdrop-blur-sm"
					/>
				</DialogBackdrop>
				<div className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-4">
					<motion.div
						initial={flip.initial}
						animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
						exit={flip.exit}
						transition={flip.transition}
					>
						<DialogPanel
							className="relative w-full max-w-2xl overflow-hidden rounded-t-xl border border-border/40 bg-background shadow-2xl dark:border-border/60 dark:shadow-[0_0_30px_-5px_rgba(96,165,250,0.08)] sm:rounded-xl"
						>
							{/* Close button */}
							<button
								onClick={onClose}
								className="absolute right-3 top-3 z-10 rounded-full bg-black/40 p-1.5 text-white/80 transition hover:bg-black/60 hover:text-white"
								aria-label="Close"
							>
								<XMarkIcon size={16} />
							</button>

							{/* Cover image area */}
							<div className="relative h-48 w-full sm:h-56">
								{hasCover ? (
									<button
										onClick={() => openLightbox(coverSlideIndex)}
										className="relative block h-full w-full cursor-zoom-in"
									>
										<Image
											src={coverSrc}
											alt={t(`${project.key}.name`)}
											fill
											sizes="(max-width: 672px) 100vw, 672px"
											className="object-cover"
											style={{ maskImage: COVER_MASK, WebkitMaskImage: COVER_MASK }}
											onError={() => setCoverError(true)}
										/>
										{project.video && (
											<div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
												<PlayIcon size={12} className="fill-white" />
												{t("labels.video")}
												<span className="relative flex size-2">
													<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white dark:bg-accent opacity-75"></span>
													<span className="relative inline-flex size-2 rounded-full bg-white dark:bg-accent"></span>
												</span>
											</div>
										)}
									</button>
								) : (
									<>
										<div
											className="h-full w-full bg-border"
											style={{ maskImage: COVER_MASK, WebkitMaskImage: COVER_MASK }}
										/>
										{project.video && (
											<button
												onClick={() => openLightbox(0)}
												className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-black/70"
											>
												<PlayIcon size={12} className="fill-white" />
												{t("labels.video")}
												<span className="relative flex size-2">
													<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white dark:bg-accent opacity-75"></span>
													<span className="relative inline-flex size-2 rounded-full bg-white dark:bg-accent"></span>
												</span>
											</button>
										)}
									</>
								)}
							</div>

							{/* Content */}
							<div className="-mt-1 px-5 pb-5">
								{/* Title + links */}
								<div className="flex items-start justify-between gap-3">
									<h3 className="text-lg font-semibold text-text-primary">
										{t(`${project.key}.name`)}
									</h3>
									<div className="flex shrink-0 items-center gap-3">
										{project.github && (
											<a
												href={project.github}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-1 text-xs text-text-secondary transition-colors hover:text-accent"
											>
												<GitHubAltIcon className="size-3.5" />
												GitHub
											</a>
										)}
										{project.live && (
											<a
												href={project.live}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-1 text-xs text-text-secondary transition-colors hover:text-accent"
											>
												<ExternalLinkIcon size={13} />
												Live
											</a>
										)}
									</div>
								</div>

								<p className="text-sm text-text-secondary">
									{t(`${project.key}.summary`)}
								</p>

								{/* Description paragraphs */}
								<div className="mt-3 mb-6 h-auto">
									<div className="max-w-none">
										{desc.map((paragraph, i) => (
											<p key={i} className="text-sm text-shadow-text-primary leading-snug not-first:mt-2">
												{paragraph}
											</p>
										))}
									</div>
								</div>

								{/* Stack tags */}
								<div className="mt-6 rounded-lg border border-terminal-border bg-terminal-bg p-2">
									<p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-text-secondary text-center">
										Stack
									</p>
									<div className="flex flex-wrap justify-center gap-1.5">
										{project.stack.map((tech) => (
											<span
												key={tech}
												className="rounded-full border-terminal-border bg-terminal-header px-2.5 py-0.5 text-[11px] font-medium text-terminal-text-muted"
											>
												{tech}
											</span>
										))}
									</div>
								</div>

								{/* Role / Type / Owner */}
								{(t.has(`${project.key}.role`) || t.has(`${project.key}.type`) || project.owner) && (
									<div className="mt-3 flex flex-wrap items-center justify-center divide-x divide-border/40 text-xs text-text-secondary">
										{t.has(`${project.key}.role`) && (
											<AdditionalInfo label={t("labels.role")}>{t(`${project.key}.role`)}</AdditionalInfo>
										)}
										{t.has(`${project.key}.type`) && (
											<AdditionalInfo label={t("labels.type")}>{t(`${project.key}.type`)}</AdditionalInfo>
										)}
										{project.owner && (() => {
											const Icon = SOCIAL_ICONS[project.owner.social];
											return (
												<AdditionalInfo label={t("labels.owner")}>
													<a
														href={project.owner.url}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center gap-1 transition-colors hover:text-accent"
													>
														<Icon className="size-3" /> {project.owner.name}
													</a>
												</AdditionalInfo>
											);
										})()}
									</div>
								)}
							</div>
						</DialogPanel>
					</motion.div>
				</div>
			</Dialog>

			<ProjectLightbox
				slides={slides}
				initialIndex={lightboxIndex}
				open={lightboxOpen}
				onClose={() => setLightboxOpen(false)}
			/>
		</>
	);
}

function AdditionalInfo({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="inline-flex flex-col items-center gap-0.5 px-3">
			<span className="text-[11px] font-medium">{children}</span>
			<span className="text-[9px] uppercase tracking-widest text-text-secondary/60">{label}</span>
		</div>
	);
}

interface Props {
	project: Project | null;
	cardRect: CardRect | null;
	onClose: () => void;
}

export default function ProjectModal({ project, cardRect, onClose }: Props) {
	// Preserve cardRect during exit animation (project becomes null but we still need the rect)
	const [savedRect, setSavedRect] = useState<CardRect | null>(null);
	if (cardRect && (cardRect.top !== savedRect?.top || cardRect.left !== savedRect?.left)) setSavedRect(cardRect);
	const flip = useFlipTransform(cardRect ?? savedRect);

	return (
		<AnimatePresence onExitComplete={() => setSavedRect(null)}>
			{project && (
				<ModalContent project={project} flip={flip} onClose={onClose} />
			)}
		</AnimatePresence>
	);
}
