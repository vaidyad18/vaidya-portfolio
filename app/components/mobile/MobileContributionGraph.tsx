import {
	getGfgData,
	getGithubData,
	getLeetcodeData,
} from "@/app/lib/api-fetchers";
import MobileContributionGraphUI from "./MobileContributionGraphUI";

export default async function MobileContributionGraph() {
	// Fetch all APIs concurrently on the server
	const [githubData, leetcodeData, gfgData] = await Promise.all([
		getGithubData(),
		getLeetcodeData(),
		getGfgData(),
	]);

	return (
		<MobileContributionGraphUI
			githubData={githubData}
			leetcodeData={leetcodeData?.calendar || {}}
			gfgData={gfgData?.calendar || {}}
		/>
	);
}

