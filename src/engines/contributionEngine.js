import { fetchContributionGraph } from '../services/githubService.js';

export const getContributionGraph = async (username, year) => {
  let from = null;
  let to = null;

  if (year && year.match(/^\d{4}$/)) {
    from = `${year}-01-01T00:00:00Z`;
    to = `${year}-12-31T23:59:59Z`;
  }

  const calendar = await fetchContributionGraph(username, from, to);

  // Convert to grid format: array of weeks, each week is array of 7 intensity levels (0-4)
  const grid = calendar.weeks.map((week) =>
    week.contributionDays.map((day) => {
      const count = day.contributionCount;
      if (count === 0) return 0;
      if (count <= 3) return 1;
      if (count <= 6) return 2;
      if (count <= 9) return 3;
      return 4;
    })
  );

  return {
    grid,
    totalContributions: calendar.totalContributions || 0,
    weeks: calendar.weeks,
  };
};

export const generate3DContributionGrid = (calendar) => {
  const grid = calendar.weeks.map((week) =>
    week.contributionDays.map((day) => day.contributionCount)
  );
  return {
    grid,
    totalContributions: calendar.totalContributions || 0,
  };
};
