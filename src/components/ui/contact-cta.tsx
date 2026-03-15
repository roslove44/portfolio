"use client";

import { Bot } from "lucide-react";
import { useCalEmbed, calDataAttributes } from "@/components/modals/cal-modal";

interface Props {
	text: string;
}

export default function ContactCta({ text }: Props) {
	useCalEmbed();

	return (
		<button
			className="font-medium text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:text-accent-hover hover:decoration-accent"
			{...calDataAttributes()}
		>
			{text} <Bot size={16} className="ml-px inline-block animate-bot-float text-accent" />
		</button>
	);
}
