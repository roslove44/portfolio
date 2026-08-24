"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { AnimatePresence, motion } from "motion/react";
import { BadgeCheck, CalendarCheck, Check, Clock, Copy, XIcon, type LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { openCalModal } from "@/components/modals/cal-modal";
import { SOCIAL_LINKS } from "@/data/constants";

function Point({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
	return (
		<div className="flex gap-3">
			<Icon size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
			<div>
				<p className="text-sm font-medium text-text-primary">{title}</p>
				<p className="mt-1 text-sm leading-relaxed text-text-secondary">{body}</p>
			</div>
		</div>
	);
}

export default function AvailabilityModal({ open, onClose }: { open: boolean; onClose: () => void }) {
	const t = useTranslations("hero.availabilityModal");
	const { resolvedTheme } = useTheme();
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(SOCIAL_LINKS.email);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleBook = () => {
		onClose();
		openCalModal(resolvedTheme === "dark" ? "dark" : "light");
	};

	return (
		<AnimatePresence>
			{open && (
				<Dialog static open={open} onClose={onClose} className="relative z-50">
					<DialogBackdrop
						as={motion.div}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm"
					/>
					<div className="fixed inset-0 flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
							className="w-full max-w-lg"
						>
							<DialogPanel className="overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
								<div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
									<DialogTitle className="text-[15px] font-semibold text-text-primary">
										{t("title")}
									</DialogTitle>
									<button
										type="button"
										onClick={onClose}
										className="-me-1 rounded p-1 text-text-secondary transition-colors hover:text-text-primary"
										aria-label={t("close")}
									>
										<XIcon size={16} aria-hidden="true" />
									</button>
								</div>

								<div className="max-h-[60vh] space-y-4 overflow-y-auto px-5 py-4">
									<p className="text-sm leading-relaxed text-text-primary">{t("intro")}</p>
									<Point icon={Clock} title={t("timezoneTitle")} body={t("timezoneBody")} />
									<Point icon={BadgeCheck} title={t("trackTitle")} body={t("trackBody")} />
									<Point icon={CalendarCheck} title={t("readyTitle")} body={t("readyBody")} />
								</div>

								<div className="flex flex-col gap-2 border-t border-border bg-surface px-5 py-4 sm:flex-row">
									<button
										type="button"
										onClick={handleBook}
										className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
									>
										{t("book")}
									</button>
									<button
										type="button"
										onClick={handleCopy}
										className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent/50 hover:text-accent"
									>
										{copied ? (
											<Check size={14} className="text-accent" aria-hidden="true" />
										) : (
											<Copy size={14} aria-hidden="true" />
										)}
										{copied ? t("copied") : t("copy")}
									</button>
									<span className="sr-only" aria-live="polite" aria-atomic="true">
										{copied ? t("copied") : ""}
									</span>
								</div>
							</DialogPanel>
						</motion.div>
					</div>
				</Dialog>
			)}
		</AnimatePresence>
	);
}
