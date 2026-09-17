import { z } from "zod";

// GeeksForGeeks Normalized DTO
// GFG has no official API; data is scraped from the public profile page
// LeetCode API Schemas
export const LeetCodeResponseSchema = z.object({
	data: z
		.object({
			allQuestionsCount: z
				.array(
					z.object({
						difficulty: z.string(),
						count: z.number(),
					}),
				)
				.optional(),
			matchedUser: z
				.object({
					submitStats: z
						.object({
							acSubmissionNum: z
								.array(
									z.object({
										difficulty: z.string(),
										count: z.number(),
									}),
								)
								.optional(),
						})
						.optional(),
					calendarCurrent: z
						.object({
							submissionCalendar: z.string().optional(),
						})
						.optional()
						.nullable(),
					calendarPrev: z
						.object({
							submissionCalendar: z.string().optional(),
						})
						.optional()
						.nullable(),
				})
				.optional()
				.nullable(),
			userContestRanking: z
				.object({
					rating: z.number().optional(),
					topPercentage: z.number().optional(),
				})
				.optional()
				.nullable(),
		})
		.optional(),
});

// GitHub Contributions & User REST API Schemas
export const GithubContributionsSchema = z.object({
	total: z.record(z.string(), z.number()).optional(),
	contributions: z
		.array(
			z.object({
				date: z.string(),
				count: z.number(),
				level: z.number(),
			}),
		)
		.optional(),
});

export const GithubUserSchema = z.object({
	public_repos: z.number().optional(),
});

export const GithubRepoSchema = z.object({
	name: z.string(),
	full_name: z.string().optional(),
	stargazers_count: z.number().default(0),
	language: z.string().nullable().optional(),
	fork: z.boolean().default(false),
});

export const GithubReposArraySchema = z.array(GithubRepoSchema);

export const GithubEventSchema = z.object({
	id: z.string(),
	type: z.string(),
	created_at: z.string(),
	repo: z.object({
		name: z.string(),
	}),
	payload: z
		.object({
			commits: z
				.array(
					z.object({
						sha: z.string().optional(),
						message: z.string().optional(),
						url: z.string().optional(),
					}),
				)
				.optional(),
		})
		.optional(),
});

export const GithubEventsArraySchema = z.array(GithubEventSchema);

export const GithubCommitSchema = z.object({
	sha: z.string(),
	author: z.object({ login: z.string().optional() }).optional(),
	commit: z.object({
		message: z.string(),
		author: z.object({ date: z.string() }).optional(),
		committer: z.object({ date: z.string() }).optional(),
	}),
	html_url: z.string().optional(),
});

export const GithubCommitArraySchema = z.array(GithubCommitSchema);

export type NormalizedGfgDto = {
	handle: string;
	codingScore: number;
	problemsSolved: number;
	streak: number;
	instituteRank: number;
	calendar: Record<string, number>;
};

export type ContributionDay = {
	date: string;
	count: number;
	level: number;
};

export type GithubData = {
	total: Record<string, number>;
	contributions: ContributionDay[];
	stats: {
		publicRepos: number;
		totalStars: number;
		topLanguages: Array<{
			name: string;
			shortName: string;
			percentage: number;
			color: string;
		}>;
	};
};

export type LeetCodeApiResponse = {
	data?: {
		allQuestionsCount?: Array<{ difficulty: string; count: number }>;
		matchedUser?: {
			submitStats?: {
				acSubmissionNum?: Array<{ difficulty: string; count: number }>;
			};
			calendarCurrent?: { submissionCalendar?: string } | null;
			calendarPrev?: { submissionCalendar?: string } | null;
		} | null;
		userContestRanking?: { rating?: number; topPercentage?: number } | null;
	} | null;
	calendar?: Record<string, number>;
};
