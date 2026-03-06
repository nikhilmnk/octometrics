import { fetchUserProfile, fetchUserRepositories } from '../services/githubService.js';
import { getUserStats } from './statsEngine.js';
import { getLanguageStats } from './languageEngine.js';
import { getRepoStats } from './repoEngine.js';

export const generateDashboard = async (username) => {
  // Fetch profile and repos in parallel — let errors propagate so controller can show them
  const [profile, repos] = await Promise.all([
    fetchUserProfile(username),
    fetchUserRepositories(username),
  ]);

  // Generate each section
  const stats = getUserStats(profile, repos);
  const { top } = getLanguageStats(repos, 6);   // top 6 languages
  const topRepos = getRepoStats(repos, 4);         // top 4 repos

  return {
    username: profile.login,
    name: profile.name || profile.login,
    avatar: profile.avatar_url || null,
    bio: profile.bio || null,
    stats,
    languages: top,    // flat {lang: pct} map
    repos: topRepos,
  };
};