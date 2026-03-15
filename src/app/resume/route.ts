import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

const NOT_FOUND_ASCII = `
    ┌──────────────────────────────────────────────┐
    │                                              │
    │   404 — Resume not found                     │
    │                                              │
    │   It's not a bug, it's a feature.            │
    │   The resume is deployed on /dev/null.       │
    │                                              │
    │   In the meantime:                           │
    │                                              │
    │   $ git commit -m "add resume"               │
    │   > error: nothing to commit                 │
    │   > (just like my work-life balance)         │
    │                                              │
    │   Try again later. Or hire me to fix it.     │
    │                                              │
    └──────────────────────────────────────────────┘
`;

export async function GET() {
	const filePath = join(process.cwd(), "public", "resume.pdf");

	try {
		const file = await readFile(filePath);
		return new NextResponse(file, {
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": "inline",
			},
		});
	} catch {
		return new NextResponse(NOT_FOUND_ASCII, {
			status: 404,
			headers: { "Content-Type": "text/plain; charset=utf-8" },
		});
	}
}
