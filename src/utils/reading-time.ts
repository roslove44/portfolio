export function getWordCount(content: string): number {
	return content.trim().split(/\s+/).length;
}

export function getReadingTime(content: string): number {
	return Math.max(1, Math.round(getWordCount(content) / 180));
}
