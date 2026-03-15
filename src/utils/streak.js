export function flattenContributionDays(calendar, today) {
  return calendar.weeks
    .flatMap((week) => week.contributionDays)
    .filter((day) => day.date <= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function calculateLongestStreak(days) {
  let longest = 0;
  let current = 0;

  for (const day of days) {
    if (day.contributionCount > 0) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }

  return longest;
}

export function calculateCurrentStreak(days, today) {
  const contributedDays = days.filter((day) => day.contributionCount > 0);
  if (contributedDays.length === 0) {
    return 0;
  }

  const latestContributionDate = contributedDays.at(-1).date;
  const latestTime = Date.parse(`${latestContributionDate}T00:00:00Z`);
  const todayTime = Date.parse(`${today}T00:00:00Z`);
  const dayDiff = Math.floor((todayTime - latestTime) / 86400000);

  if (dayDiff > 1) {
    return 0;
  }

  let streak = 0;
  for (let index = days.length - 1; index >= 0; index -= 1) {
    const day = days[index];
    if (day.date > latestContributionDate) {
      continue;
    }

    if (day.contributionCount > 0) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}
