export const getUserStats = (profile, repos) => {
  const totalRepos = profile.public_repos;
  const followers = profile.followers;
  const following = profile.following;
  const starsReceived = repos.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );
  const forks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
  const accountAge = Math.floor(
    (new Date() - new Date(profile.created_at)) / (1000 * 60 * 60 * 24)
  );

  return {
    username: profile.login,
    totalRepos,
    followers,
    following,
    starsReceived,
    forks,
    accountAge,
  };
};
