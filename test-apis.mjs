import { getGithubData, getLeetcodeData, getCodeforcesData } from "./app/lib/api-fetchers.ts";

async function verify() {
  console.log("=== Testing getGithubData('vaidyad18') ===");
  const gh = await getGithubData("vaidyad18");
  console.log("GitHub Total:", gh.total);
  console.log("GitHub Contributions count:", gh.contributions.length);
  console.log("GitHub Stats:", gh.stats);

  console.log("=== Testing getLeetcodeData('vaidyad18') ===");
  const lc = await getLeetcodeData("vaidyad18");
  console.log("LeetCode data present:", !!lc.data);
  console.log("LeetCode calendar keys:", Object.keys(lc.calendar).length);

  console.log("=== Testing getCodeforcesData('vaidyad18') ===");
  const cf = await getCodeforcesData("vaidyad18");
  console.log("Codeforces Handle:", cf.handle);
  console.log("Codeforces Rating:", cf.rating);
}

verify();
