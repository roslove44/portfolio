import fs from "fs";
import path from "path";

export type ImageSize = { width: number; height: number };

function parsePng(buffer: Buffer): ImageSize | null {
	if (buffer.length < 24) return null;
	return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function parseWebp(buffer: Buffer): ImageSize | null {
	const chunk = buffer.subarray(12, 16).toString("ascii");

	if (chunk === "VP8 ") {
		if (buffer.length < 30) return null;
		return {
			width: buffer.readUInt16LE(26) & 0x3fff,
			height: buffer.readUInt16LE(28) & 0x3fff,
		};
	}

	if (chunk === "VP8L") {
		if (buffer.length < 25) return null;
		const bits = buffer.readUInt32LE(21);
		return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
	}

	if (chunk === "VP8X") {
		if (buffer.length < 30) return null;
		return { width: buffer.readUIntLE(24, 3) + 1, height: buffer.readUIntLE(27, 3) + 1 };
	}

	return null;
}

function parseJpeg(buffer: Buffer): ImageSize | null {
	let offset = 2;

	while (offset + 9 < buffer.length) {
		if (buffer[offset] !== 0xff) {
			offset++;
			continue;
		}

		const marker = buffer[offset + 1];
		const isFrameHeader = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
		if (isFrameHeader) {
			return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
		}

		offset += 2 + buffer.readUInt16BE(offset + 2);
	}

	return null;
}

function parse(buffer: Buffer): ImageSize | null {
	if (buffer.subarray(1, 4).toString("ascii") === "PNG") return parsePng(buffer);
	if (buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") return parseWebp(buffer);
	if (buffer[0] === 0xff && buffer[1] === 0xd8) return parseJpeg(buffer);
	return null;
}

const cache = new Map<string, ImageSize | null>();

/**
 * Reads the intrinsic size of an asset served from `public/`, at build time.
 * Returns null for a missing file or an unsupported format, so callers can
 * simply omit the dimensions rather than fail.
 */
export function getPublicImageSize(publicPath: string): ImageSize | null {
	if (!publicPath.startsWith("/") || publicPath.includes("..")) return null;

	const cached = cache.get(publicPath);
	if (cached !== undefined) return cached;

	let size: ImageSize | null = null;
	try {
		size = parse(fs.readFileSync(path.join(process.cwd(), "public", publicPath)));
	} catch {
		size = null;
	}

	cache.set(publicPath, size);
	return size;
}
