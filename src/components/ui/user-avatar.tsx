"use client";
import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

const sizeConfig = {
	xs: { px: 20, className: "size-5", text: "text-[9px]" },
	sm: { px: 24, className: "size-6", text: "text-[10px]" },
	md: { px: 32, className: "size-8", text: "text-xs" },
	lg: { px: 40, className: "size-10", text: "text-sm" },
	xl: { px: 44, className: "size-11", text: "text-sm" },
	"2xl": { px: 80, className: "size-20", text: "text-xl" },
} as const;

export type AvatarSize = keyof typeof sizeConfig;

interface UserAvatarProps {
	src?: string | null;
	firstname: string;
	lastname: string;
	size?: AvatarSize;
	className?: string;
}

export function UserAvatar({ src, firstname, lastname, size = "md", className }: UserAvatarProps) {
	const config = sizeConfig[size];
	const initials = `${firstname[0] ?? ""}${lastname[0] ?? ""}`.toUpperCase();
	const [imgError, setImgError] = useState(false);

	if (src && !imgError) {
		return (
			<Image
				src={src}
				alt={`${firstname} ${lastname}`}
				width={config.px}
				height={config.px}
				className={clsx(
					config.className,
					"shrink-0 rounded-full object-cover bg-background ring-1 ring-border",
					className
				)}
				onError={() => setImgError(true)}
			/>
		);
	}

	return (
		<span
			className={clsx(
				config.className,
				config.text,
				"shrink-0 rounded-full bg-surface flex items-center justify-center font-semibold text-text-secondary",
				className
			)}
		>
			{initials}
		</span>
	);
}
