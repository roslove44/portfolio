interface Props {
	children: React.ReactNode;
}

export default function Lead({ children }: Props) {
	return (
		<p className="text-base leading-8 text-text-secondary not-prose border-l-2 border-accent pl-4 my-6">
			{children}
		</p>
	);
}
