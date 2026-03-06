/**
 * Process and sort repository data
 * @param {Array} repos - Array of repository objects from GitHub API
 * @param {number} count - How many repos to return (default 6)
 * @returns {Array} - Top repositories with formatted data
 */
export const getRepoStats = (repos, count = 6) => {
  if (!repos || !Array.isArray(repos)) return [];

  return repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, count)
    .map(repo => ({
      name: repo.name,
      description: repo.description || 'No description',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.watchers_count,
      language: repo.language || null,
      url: repo.html_url,
      isPrivate: repo.private || false,
    }));
};