import {
	getCodeforcesData,
	getGithubData,
	getLeetcodeData,
} from "@/app/lib/api-fetchers";
import MobileContributionGraphUI from "./MobileContributionGraphUI";

export default async function MobileContributionGraph() {
	// Fetch all APIs concurrently on the server
	const [githubData, leetcodeData, codeforcesData] = await Promise.all([
		getGithubData(),
		getLeetcodeData(),
		getCodeforcesData(),
	]);

	return (
		<MobileContributionGraphUI
			githubData={githubData}
			leetcodeData={leetcodeData?.calendar || {}}
			codeforcesData={codeforcesData?.calendar || {}}
		/>
	);
}
