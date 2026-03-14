export interface ContributionDay {
	contributionCount: number;
	date: string;
}

export interface ContributionWeek {
	contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
	totalContributions: number;
	weeks: ContributionWeek[];
}

export async function fetchContributions(username: string): Promise<ContributionCalendar | null> {
	const token = process.env.GITHUB_TOKEN;
	if (!token) {
		console.warn("[activity] GITHUB_TOKEN not set — skipping contribution graph");
		return null;
	}

	const query = `
		query($username: String!) {
			user(login: $username) {
				contributionsCollection {
					contributionCalendar {
						totalContributions
						weeks {
							contributionDays {
								contributionCount
								date
							}
						}
					}
				}
			}
		}
	`;

	try {
		const res = await fetch("https://api.github.com/graphql", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ query, variables: { username } }),
			next: { revalidate: 3600 },
		});

		if (!res.ok) return null;

		const data = await res.json();
		return data.data?.user?.contributionsCollection?.contributionCalendar ?? null;
	} catch {
		return null;
	}
}
