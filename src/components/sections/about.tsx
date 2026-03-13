"use client";
import { useTranslations } from "next-intl";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronRightIcon, LandmarkIcon, CodeXmlIcon } from "lucide-react";
import { Fragment } from "react";
import { AnimatePresence, motion, easeOut } from "motion/react";

export default function About() {
	const t = useTranslations("about");

	return (
		<section className="border-y border-border py-6">
			<h2 className="mb-4 font-semibold tracking-widest text-text-primary">
				{t("title")}
			</h2>
			<Disclosure>
				{({ open }) => (
					<>
						<DisclosureButton className="group flex w-full items-center gap-2 text-left text-[15px] font-medium transition-colors hover:text-accent">
							<ChevronRightIcon
								size={18}
								className={`shrink-0 text-text-secondary transition-transform duration-200 group-hover:text-accent ${open ? "rotate-90" : ""}`}
							/>
							{t("hook")}
							<span className="relative ml-1.5 inline-flex size-5 shrink-0 items-center justify-center">
								<LandmarkIcon size={16} className="absolute animate-icon-swap text-accent" />
								<CodeXmlIcon size={16} className="absolute animate-icon-swap-alt text-accent" />
							</span>
						</DisclosureButton>

						<AnimatePresence>
							{open && (
								<DisclosurePanel static as={Fragment}>
									<motion.div
										initial={{ opacity: 0, y: -24 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -24 }}
										transition={{ duration: 0.2, ease: easeOut }}
									>
										<div className="mt-4 space-y-4 text-[15px] text-text-secondary">
											<p>{t("p1")}</p>
											<p>{t("p2")}</p>
											<p>{t("p3")}</p>
										</div>

										<p className="mt-4 text-[15px] font-medium text-text-primary">
											{t("closing")}
										</p>
									</motion.div>
								</DisclosurePanel>
							)}
						</AnimatePresence>
					</>
				)}
			</Disclosure>
		</section>
	);
}
