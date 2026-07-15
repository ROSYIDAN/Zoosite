import { browseRepo } from "./dashboard/browse.repo";
import { exploreRepo } from "./dashboard/explore.repo";
import { statsRepo } from "./dashboard/stats.repo";
import { trendingRepo } from "./dashboard/trending.repo";

export const dashboardRepo = {
  ...browseRepo,
  ...exploreRepo,
  ...statsRepo,
  ...trendingRepo,
};