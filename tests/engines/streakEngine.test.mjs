import {
  calculateCurrentStreak,
  calculateLongestStreak,
  flattenContributionDays,
} from '../../src/utils/streak.js';

describe('streak engine', () => {
  test('flattens and sorts contribution days up to today', () => {
    const calendar = {
      weeks: [
        {
          contributionDays: [
            { date: '2026-01-03', contributionCount: 2 },
            { date: '2026-01-01', contributionCount: 1 },
          ],
        },
        {
          contributionDays: [
            { date: '2026-01-04', contributionCount: 0 },
            { date: '2026-01-02', contributionCount: 3 },
            { date: '2026-12-31', contributionCount: 5 },
          ],
        },
      ],
    };

    expect(flattenContributionDays(calendar, '2026-01-04')).toEqual([
      { date: '2026-01-01', contributionCount: 1 },
      { date: '2026-01-02', contributionCount: 3 },
      { date: '2026-01-03', contributionCount: 2 },
      { date: '2026-01-04', contributionCount: 0 },
    ]);
  });

  test('calculates longest streak across the year', () => {
    const days = [
      { date: '2026-01-01', contributionCount: 1 },
      { date: '2026-01-02', contributionCount: 2 },
      { date: '2026-01-03', contributionCount: 0 },
      { date: '2026-01-04', contributionCount: 4 },
      { date: '2026-01-05', contributionCount: 6 },
      { date: '2026-01-06', contributionCount: 5 },
      { date: '2026-01-07', contributionCount: 0 },
    ];

    expect(calculateLongestStreak(days)).toBe(3);
  });

  test('calculates current streak when the latest contribution is recent', () => {
    const days = [
      { date: '2026-03-10', contributionCount: 0 },
      { date: '2026-03-11', contributionCount: 2 },
      { date: '2026-03-12', contributionCount: 1 },
      { date: '2026-03-13', contributionCount: 3 },
      { date: '2026-03-14', contributionCount: 2 },
    ];

    expect(calculateCurrentStreak(days, '2026-03-15')).toBe(4);
  });

  test('returns zero current streak when the last contribution is stale', () => {
    const days = [
      { date: '2026-03-01', contributionCount: 1 },
      { date: '2026-03-02', contributionCount: 2 },
      { date: '2026-03-03', contributionCount: 0 },
      { date: '2026-03-04', contributionCount: 1 },
    ];

    expect(calculateCurrentStreak(days, '2026-03-15')).toBe(0);
  });
});
