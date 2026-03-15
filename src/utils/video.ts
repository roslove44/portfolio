export function toEmbedUrl(url: string): string {
	const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
	if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0`;
	const vm = url.match(/vimeo\.com\/(\d+)/);
	if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`;
	return url;
}

export function getVideoThumbnail(url: string): string | null {
	const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
	if (yt) return `https://img.youtube.com/vi/${yt[1]}/maxresdefault.jpg`;

	const vm = url.match(/vimeo\.com\/(\d+)/);
	if (vm) return `https://vumbnail.com/${vm[1]}.jpg`;

	return null;
}
