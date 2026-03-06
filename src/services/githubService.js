import { config, getFeatureConfig } from '../config/config.js';

const headers = {
  "User-Agent": "octometrics"
};

const githubConfig = getFeatureConfig('github');
// Only attach token if it looks like a real GitHub token (not a placeholder)
const isRealToken = (t) => t && (
  t.startsWith('ghp_') ||
  t.startsWith('gho_') ||
  t.startsWith('github_pat_') ||
  (t.length >= 40 && !t.includes(' ') && t !== 'your_github_token_here')
);
if (isRealToken(githubConfig?.token)) {
  headers["Authorization"] = `Bearer ${githubConfig.token}`;
}

// Fetch user profile data
export const fetchUserProfile = async (username) => {
  const url = `https://api.github.com/users/${username}`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  return response.json();
};

// Fetch user repositories
export const fetchUserRepositories = async (username) => {
  const url = `https://api.github.com/users/${username}/repos?per_page=100`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  return response.json();
};

// Fetch repository info
export const fetchRepositoryInfo = async (repo) => {
  const url = `https://api.github.com/repos/${repo}`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  return response.json();
};

// Fetch contribution graph data via GraphQL (requires GITHUB_TOKEN)
export const fetchContributionGraph = async (username) => {
  if (!headers['Authorization']) {
    throw new Error('GITHUB_TOKEN is not set. Add it to your .env file. GitHub GraphQL API requires authentication. See: https://github.com/settings/tokens');
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { username },
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL API error: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(`GraphQL errors: ${data.errors.map(e => e.message).join(', ')}`);
  }

  return data.data.user.contributionsCollection.contributionCalendar;
};