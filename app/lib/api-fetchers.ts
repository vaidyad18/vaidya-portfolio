import type {
	CodeforcesStatusEntry,
	CodeforcesUserInfo,
	ContributionDay,
	GithubData,
} from "./schemas";
import {
	CodeforcesRatingSchema,
	CodeforcesStatusSchema,
	CodeforcesUserInfoSchema,
	GithubCommitArraySchema,
	GithubContributionsSchema,
	GithubReposArraySchema,
	GithubUserSchema,
	LeetCodeResponseSchema,
} from "./schemas";

const LANG_COLORS: Record<string, string> = {
	Python: "var(--color-accent-secondary)",
	TypeScript: "var(--color-accent-warning)",
	"C++": "var(--color-accent)",
	JavaScript: "#f1e05a",
	Java: "#b07219",
	Go: "#00ADD8",
	Rust: "#dea584",
	HTML: "#e34c26",
	CSS: "#563d7c",
};

const LANG_SHORT: Record<string, string> = {
	Python: "PY",
	TypeScript: "TS",
	"C++": "C++",
	JavaScript: "JS",
	Java: "JAVA",
	Go: "GO",
	Rust: "RS",
};

export async function getGithubData(
	usernameInput?: string,
): Promise<GithubData> {
	const username =
		usernameInput || process.env.GITHUB_USERNAME || "Medhansh-741";
	const token = process.env.GITHUB_TOKEN;

	const authHeaders: Record<string, string> = {
		"User-Agent": "Portfolio-App",
		Accept: "application/vnd.github.v3+json",
	};
	if (token) {
		authHeaders["Authorization"] = `Bearer ${token}`;
	}

	try {
		const currentYear = new Date().getFullYear();
		const prevYear = currentYear - 1;
		const query = `
      query($userName:String!) {
        user(login: $userName) {
          current: contributionsCollection(from: "${currentYear}-01-01T00:00:00Z", to: "${currentYear}-12-31T23:59:59Z") {
            contributionCalendar {
              totalContributions
              weeks { contributionDays { contributionCount date } }
            }
          }
          previous: contributionsCollection(from: "${prevYear}-01-01T00:00:00Z", to: "${prevYear}-12-31T23:59:59Z") {
            contributionCalendar {
              totalContributions
              weeks { contributionDays { contributionCount date } }
            }
          }
        }
      }
    `;

		const [graphqlRes, userRes, reposRes] = await Promise.allSettled([
			fetch("https://api.github.com/graphql", {
				method: "POST",
				next: { revalidate: 3600 },
				headers: {
					...authHeaders,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ query, variables: { userName: username } }),
			}),
			fetch(`https://api.github.com/users/${username}`, {
				next: { revalidate: 3600 },
				headers: authHeaders,
			}),
			fetch(
				`https://api.github.com/users/${username}/repos?per_page=100&type=owner`,
				{
					next: { revalidate: 3600 },
					headers: authHeaders,
				},
			),
		]);

		const contribData = {
			total: {} as Record<string, number>,
			contributions: [] as ContributionDay[],
		};

		if (graphqlRes.status === "fulfilled" && graphqlRes.value.ok) {
			const json = await graphqlRes.value.json();
			const collections = json?.data?.user;

			if (collections) {
				const getLevel = (count: number) => {
					if (count === 0) return 0;
					if (count <= 3) return 1;
					if (count <= 6) return 2;
					if (count <= 9) return 3;
					return 4;
				};

				const processCalendar = (
					calendarInfo: any,
					yearStr: string,
				) => {
					if (!calendarInfo) return;
					contribData.total[yearStr] = calendarInfo.totalContributions;

					for (const week of calendarInfo.weeks) {
						for (const day of week.contributionDays) {
							// Only push days up to today to match normal behavior
							const todayStr = new Date().toISOString().split("T")[0];
							if (day.date <= todayStr || yearStr === prevYear.toString()) {
								contribData.contributions.push({
									date: day.date,
									count: day.contributionCount,
									level: getLevel(day.contributionCount),
								});
							} else if (day.date > todayStr) {
								// Include future days as empty so the skeleton renders a full grid
								contribData.contributions.push({
									date: day.date,
									count: 0,
									level: 0,
								});
							}
						}
					}
				};

				processCalendar(
					collections.current?.contributionCalendar,
					currentYear.toString(),
				);
				processCalendar(
					collections.previous?.contributionCalendar,
					prevYear.toString(),
				);
			}
		}

		let publicRepos = 14;
		if (userRes.status === "fulfilled" && userRes.value.ok) {
			const rawJson = await userRes.value.json();
			const parsed = GithubUserSchema.safeParse(rawJson);
			if (parsed.success && typeof parsed.data.public_repos === "number") {
				publicRepos = parsed.data.public_repos;
			}
		}

		let totalStars = 24;
		const langCounts: Record<string, number> = {};

		if (reposRes.status === "fulfilled" && reposRes.value.ok) {
			const rawJson = await reposRes.value.json();
			const parsed = GithubReposArraySchema.safeParse(rawJson);
			if (parsed.success && parsed.data.length > 0) {
				let starsSum = 0;
				parsed.data.forEach((repo) => {
					if (!repo.fork) {
						starsSum += repo.stargazers_count;
						if (repo.language) {
							langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
						}
					}
				});
				totalStars = starsSum;
			}
		}

		// Process top 3 languages
		const totalLangRepos =
			Object.values(langCounts).reduce((a, b) => a + b, 0) || 1;
		const sortedLangs = Object.entries(langCounts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 3);

		const topLanguages = sortedLangs.map(([name, count], index) => {
			const pct = Math.round((count / totalLangRepos) * 100);
			const defaultColors = [
				"var(--color-accent-secondary)",
				"var(--color-accent-warning)",
				"var(--color-accent)",
			];
			return {
				name,
				shortName: LANG_SHORT[name] || name.substring(0, 4).toUpperCase(),
				percentage: pct,
				color: LANG_COLORS[name] || defaultColors[index % defaultColors.length],
			};
		});

		// Fallback if no language data was returned
		if (topLanguages.length === 0) {
			topLanguages.push(
				{
					name: "Python",
					shortName: "PY",
					percentage: 65,
					color: "var(--color-accent-secondary)",
				},
				{
					name: "TypeScript",
					shortName: "TS",
					percentage: 25,
					color: "var(--color-accent-warning)",
				},
				{
					name: "C++",
					shortName: "C++",
					percentage: 10,
					color: "var(--color-accent)",
				},
			);
		}

		return {
			...contribData,
			stats: {
				publicRepos,
				totalStars,
				topLanguages,
			},
		};
	} catch (error) {
		console.error("Error in server getGithubData:", error);
		return {
			total: {},
			contributions: [],
			stats: { publicRepos: 14, totalStars: 24, topLanguages: [] },
		};
	}
}

async function fetchWithTimeout(
	url: string,
	init?: RequestInit,
	timeoutMs = 5000,
) {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
	try {
		const res = await fetch(url, {
			...init,
			next: { revalidate: 3600, ...(init?.next || {}) },
			headers: {
				Accept: "application/json",
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
				...(init?.headers || {}),
			},
			signal: controller.signal,
		});
		clearTimeout(timeoutId);
		return res;
	} catch {
		clearTimeout(timeoutId);
		return null;
	}
}

export async function getLeetcodeData(usernameInput?: string) {
	const username = usernameInput || "iXfyEpMpyu";
	const currentYear = new Date().getFullYear();
	const prevYear = currentYear - 1;

	const query = `
    query userProblemsSolved($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
        calendarCurrent: userCalendar(year: ${currentYear}) {
          submissionCalendar
        }
        calendarPrev: userCalendar(year: ${prevYear}) {
          submissionCalendar
        }
      }
      userContestRanking(username: $username) {
        rating
        topPercentage
      }
    }
  `;

	try {
		const response = await fetchWithTimeout(
			"https://leetcode.com/graphql",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Referer: "https://leetcode.com",
				},
				body: JSON.stringify({ query, variables: { username } }),
			},
			5000,
		);

		if (!response || !response.ok) return { data: null, calendar: {} };

		const rawJson = await response.json().catch(() => null);
		if (!rawJson) return { data: null, calendar: {} };

		const parsed = LeetCodeResponseSchema.safeParse(rawJson);
		if (!parsed.success) return { data: null, calendar: {} };

		const json = parsed.data;
		const calendarMap: Record<string, number> = {};

		if (json.data && json.data.matchedUser) {
			const { calendarCurrent, calendarPrev } = json.data.matchedUser;
			const parseCalendar = (
				cal: { submissionCalendar?: string } | null | undefined,
			) => {
				if (cal && cal.submissionCalendar) {
					try {
						const parsedCal = JSON.parse(cal.submissionCalendar);
						Object.entries(parsedCal).forEach(([ts, count]) => {
							const date = new Date(parseInt(ts) * 1000);
							const year = date.getFullYear();
							const month = String(date.getMonth() + 1).padStart(2, "0");
							const day = String(date.getDate()).padStart(2, "0");
							const dateStr = `${year}-${month}-${day}`;
							calendarMap[dateStr] =
								(calendarMap[dateStr] || 0) + (count as number);
						});
					} catch {}
				}
			};
			parseCalendar(calendarCurrent);
			parseCalendar(calendarPrev);
		}

		return { data: json.data, calendar: calendarMap };
	} catch (err) {
		console.error("Error in server getLeetcodeData:", err);
		return { data: null, calendar: {} };
	}
}

export async function getCodeforcesData(usernameInput?: string) {
	const username = usernameInput || "Medhansh_217";

	let info: CodeforcesUserInfo | null = null;
	let solvedCount = 0;
	let contestCount = 0;
	const calendarMap: Record<string, number> = {};

	try {
		// 1. Fetch User Info
		const infoRes = await fetchWithTimeout(
			`https://codeforces.com/api/user.info?handles=${username}`,
		);
		if (infoRes && infoRes.ok) {
			const rawJson = await infoRes.json().catch(() => null);
			if (rawJson) {
				const parsed = CodeforcesUserInfoSchema.safeParse(rawJson);
				if (
					parsed.success &&
					parsed.data.status === "OK" &&
					parsed.data.result &&
					parsed.data.result.length > 0
				) {
					info = parsed.data.result[0];
				}
			}
		}

		// 2. Fetch User Submissions (Status & Calendar)
		const statusRes = await fetchWithTimeout(
			`https://codeforces.com/api/user.status?handle=${username}`,
		);
		if (statusRes && statusRes.ok) {
			const rawJson = await statusRes.json().catch(() => null);
			if (rawJson) {
				const parsed = CodeforcesStatusSchema.safeParse(rawJson);
				if (
					parsed.success &&
					parsed.data.status === "OK" &&
					parsed.data.result
				) {
					const solvedSet = new Set();
					parsed.data.result.forEach((sub: CodeforcesStatusEntry) => {
						if (sub.verdict === "OK" && sub.problem) {
							solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`);
						}
						if (sub.creationTimeSeconds) {
							const date = new Date(sub.creationTimeSeconds * 1000);
							const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
							calendarMap[dateStr] = (calendarMap[dateStr] || 0) + 1;
						}
					});
					solvedCount = solvedSet.size;
				}
			}
		}

		// 3. Fetch Rating History
		const ratingRes = await fetchWithTimeout(
			`https://codeforces.com/api/user.rating?handle=${username}`,
		);
		if (ratingRes && ratingRes.ok) {
			const rawJson = await ratingRes.json().catch(() => null);
			if (rawJson) {
				const parsed = CodeforcesRatingSchema.safeParse(rawJson);
				if (
					parsed.success &&
					parsed.data.status === "OK" &&
					parsed.data.result
				) {
					contestCount = parsed.data.result.length;
				}
			}
		}
	} catch (err) {
		console.error("Error in server getCodeforcesData:", err);
	}

	return {
		handle: username,
		rating: info?.rating || 0,
		maxRating: info?.maxRating || 0,
		rank: info?.rank || "unrated",
		maxRank: info?.maxRank || "unrated",
		solvedCount,
		contestCount,
		avatar: info?.avatar || "",
		calendar: calendarMap,
	};
}

const COMMIT_FEED_REPO_COUNT = 12;
const COMMITS_PER_REPO = 3;

export async function getCommitFeed(usernameInput?: string) {
	const username =
		usernameInput || process.env.GITHUB_USERNAME || "Medhansh-741";
	const token = process.env.GITHUB_TOKEN;

	const authHeaders: Record<string, string> = {
		"User-Agent": "Portfolio-App",
		Accept: "application/vnd.github.v3+json",
	};
	if (token) {
		authHeaders["Authorization"] = `Bearer ${token}`;
	}

	try {
		const reposRes = await fetch(
			`https://api.github.com/user/repos?per_page=100`,
			{
				next: { revalidate: 60 },
				headers: authHeaders,
			},
		);
		if (!reposRes.ok) return [];

		const reposParsed =
			GithubReposArraySchema.safeParse(await reposRes.json());
		if (!reposParsed.success) return [];
		const repoNames = Array.from(
			new Set(
				reposParsed.data.map((repo) => repo.full_name || `${username}/${repo.name}`),
			),
		);
		if (repoNames.length === 0) return [];

		const results = await Promise.allSettled(
			repoNames.map((repo) =>
				fetch(
					`https://api.github.com/repos/${repo}/commits?per_page=${COMMITS_PER_REPO}&author=${username}`,
					{
						next: { revalidate: 60 },
						headers: authHeaders,
					},
				),
			),
		);

		const commitsList: Array<{
			id: string;
			repo: string;
			message: string;
			date: string;
			link: string;
		}> = [];

		for (const [index, result] of results.entries()) {
			if (result.status !== "fulfilled") continue;
			const res = result.value;
			if (!res.ok) continue;

			const parsed = GithubCommitArraySchema.safeParse(await res.json());
			if (!parsed.success || parsed.data.length === 0) continue;
			const mine = parsed.data.filter(
				(commit) => commit.author?.login === username,
			);
			if (mine.length === 0) continue;

			const repo = repoNames[index];
			for (const commit of mine) {
				const sha = commit.sha;
				const date =
					commit.commit.author?.date ?? commit.commit.committer?.date;
				commitsList.push({
					id: sha,
					repo,
					message: commit.commit.message.split("\n")[0].trim(),
					date: date ?? new Date().toISOString(),
					link:
						commit.html_url ?? `https://github.com/${repo}/commit/${sha}`,
				});
			}
		}

		const seen = new Set<string>();
		const uniqueCommits = commitsList.filter((commit) => {
			if (seen.has(commit.id)) return false;
			seen.add(commit.id);
			return true;
		});

		return uniqueCommits
			.sort(
				(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
			)
			.slice(0, COMMIT_FEED_REPO_COUNT);
	} catch {
		return [];
	}
}
