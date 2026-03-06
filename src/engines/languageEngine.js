/**
 * Calculate language statistics from repository data.
 * Returns both all languages and top N languages.
 * @param {Array} repos - Array of repository objects from GitHub API
 * @param {number} topCount - How many top languages to include (default 5)
 * @returns {{ all: Object, top: Object }} - Full and top language distributions
 */
export const getLanguageStats = (repos, topCount = 5) => {
  if (!repos || !Array.isArray(repos)) return { all: {}, top: {} };

  const languageCount = {};

  repos.forEach((repo) => {
    if (repo.language) {
      languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
    }
  });

  const total = Object.values(languageCount).reduce((sum, c) => sum + c, 0);
  if (total === 0) return { all: {}, top: {} };

  // Sort descending by count
  const sorted = Object.entries(languageCount).sort((a, b) => b[1] - a[1]);

  const toPercentMap = (entries) => {
    const result = {};
    entries.forEach(([lang, count]) => {
      result[lang] = parseFloat(((count / total) * 100).toFixed(1));
    });
    return result;
  };

  return {
    all: toPercentMap(sorted),
    top: toPercentMap(sorted.slice(0, topCount)),
  };
};
