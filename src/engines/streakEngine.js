import { fetchContributionGraph } from '../services/githubService.js';
import {
  flattenContributionDays,
  calculateCurrentStreak,
  calculateLongestStreak,
} from '../utils/streak.js';

function getCurrentYearRange() {
  const now = new Date();
  const year = now.getUTCFullYear();
  return {
    year,
    from: `${year}-01-01T00:00:00Z`,
    to: `${year}-12-31T23:59:59Z`,
    today: now.toISOString().slice(0, 10),
  };
}

export const getStreakStats = async (username) => {
  const { year, from, to, today } = getCurrentYearRange();
  const calendar = await fetchContributionGraph(username, from, to);
  const days = flattenContributionDays(calendar, today);

  return {
    year,
    currentStreak: calculateCurrentStreak(days, today),
    longestStreak: calculateLongestStreak(days),
    totalContributions: calendar.totalContributions || 0,
  };
};
