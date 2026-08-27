import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getBlogPost, getBlogPosts } from "@/lib/blog";
import { GENERATED_COVER_SIZE } from "@/lib/blog-cover";
import { routing } from "@/i18n/routing";

/**
 * The avatar has to be inlined: satori only decodes PNG, APNG, JPEG, GIF and SVG,
 * so it would reject the WebP served to the browser, and it never hits the network.
 */
const AVATAR = `data:image/png;base64,${readFileSync(join(process.cwd(), "public", "avatar-og.png")).toString("base64")}`;

/** Only articles without a frontmatter cover need a generated one. */
export function generateStaticParams() {
	return routing.locales.flatMap((locale) =>
		getBlogPosts(locale).filter((post) => !post.cover).map((post) => ({ locale, slug: post.slug }))
	);
}

// Everything is prerendered at build time: no cover is ever rasterized while serving.
export const dynamicParams = false;

const COLORS = {
	background: "#0a0a0b",
	border: "#27272a",
	textPrimary: "#f9fafb",
	textSecondary: "#9ca3af",
	accent: "#60a5fa",
};

function titleSize(title: string): number {
	if (title.length > 78) return 54;
	if (title.length > 52) return 62;
	return 72;
}

export async function GET(request: Request, { params }: { params: Promise<{ locale: string; slug: string }> }) {
	const { locale, slug } = await params;
	const post = getBlogPost(locale, slug);

	if (!post) {
		return new Response("Not found", { status: 404 });
	}

	const published = new Date(post.date).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return new ImageResponse(
		(
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					width: "100%",
					height: "100%",
					backgroundColor: COLORS.background,
					padding: "76px 84px",
					justifyContent: "space-between",
				}}
			>
				<div style={{ display: "flex", flexDirection: "column" }}>
					<div style={{ display: "flex", width: 96, height: 6, borderRadius: 3, backgroundColor: COLORS.accent }} />
					<div style={{ display: "flex", gap: 22, marginTop: 40 }}>
						{post.tags.slice(0, 4).map((tag) => (
							<div key={tag} style={{ display: "flex", fontSize: 26, color: COLORS.accent }}>
								#{tag}
							</div>
						))}
					</div>
				</div>

				<div
					style={{
						display: "flex",
						fontSize: titleSize(post.title),
						fontWeight: 700,
						color: COLORS.textPrimary,
						lineHeight: 1.16,
						letterSpacing: "-0.02em",
					}}
				>
					{post.title}
				</div>

				<div style={{ display: "flex", flexDirection: "column" }}>
					<div style={{ display: "flex", width: "100%", height: 1, backgroundColor: COLORS.border }} />
					<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 34 }}>
						<div style={{ display: "flex", alignItems: "center", gap: 22 }}>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={AVATAR}
								alt="Rostand MIGAN"
								width={80}
								height={80}
								style={{ borderRadius: 40, objectFit: "cover", border: `1px solid ${COLORS.border}` }}
							/>
							<div style={{ display: "flex", flexDirection: "column" }}>
								<div style={{ display: "flex", fontSize: 28, color: COLORS.textPrimary }}>Rostand MIGAN</div>
								<div style={{ display: "flex", fontSize: 22, color: COLORS.textSecondary, marginTop: 4 }}>rostand.dev</div>
							</div>
						</div>
						<div style={{ display: "flex", fontSize: 24, color: COLORS.textSecondary }}>{published}</div>
					</div>
				</div>
			</div>
		),
		GENERATED_COVER_SIZE
	);
}
