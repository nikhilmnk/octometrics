import { logger } from '../utils/logger.js';
import { getFeatureConfig } from '../config/config.js';

const GITHUB_API_BASE = 'https://api.github.com';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const headers = {
  'User-Agent': 'octometrics',
  Accept: 'application/vnd.github.v3+json',
};

const githubConfig = getFeatureConfig('github');
if (githubConfig && githubConfig.token) {
  headers['Authorization'] = `Bearer ${githubConfig.token}`;
}

/**
 * Fetch helper with retry logic for GitHub API
 */
async function fetchWithRetry(url, options = {}, retries = 0) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: { ...headers, ...options.headers },
    });

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = response.headers.get('x-ratelimit-reset');
        logger.warn({ url, retryAfter }, 'GitHub API rate limited');
        throw new Error(`Rate limited. Retry after: ${retryAfter}`);
      }
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    return response;
  } catch (error) {
    if (retries < MAX_RETRIES && !error.message.includes('Rate limited')) {
      logger.debug(
        { url, retries },
        `Retrying request (attempt ${retries + 1})`
      );
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY * (retries + 1))
      );
      return fetchWithRetry(url, options, retries + 1);
    }
    throw error;
  }
}

/**
 * Fetch user profile data
 */
export const fetchUserProfile = async (username) => {
  const url = `${GITHUB_API_BASE}/users/${username}`;
  try {
    const response = await fetchWithRetry(url);
    logger.debug({ username }, 'Fetched user profile');
    return response.json();
  } catch (error) {
    logger.error(
      { username, error: error.message },
      'Failed to fetch user profile'
    );
    throw error;
  }
};

/**
 * Fetch user repositories
 */
export const fetchUserRepositories = async (username) => {
  const url = `${GITHUB_API_BASE}/users/${username}/repos?per_page=100`;
  try {
    const response = await fetchWithRetry(url);
    logger.debug({ username }, 'Fetched user repositories');
    return response.json();
  } catch (error) {
    logger.error(
      { username, error: error.message },
      'Failed to fetch repositories'
    );
    throw error;
  }
};

/**
 * Fetch repository info
 */
export const fetchRepositoryInfo = async (repo) => {
  const url = `${GITHUB_API_BASE}/repos/${repo}`;
  try {
    const response = await fetchWithRetry(url);
    logger.debug({ repo }, 'Fetched repository info');
    return response.json();
  } catch (error) {
    logger.error(
      { repo, error: error.message },
      'Failed to fetch repository info'
    );
    throw error;
  }
};

/**
 * Fetch contribution graph data via GraphQL
 */
export const fetchContributionGraph = async (username) => {
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
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

  try {
    const response = await fetchWithRetry(`${GITHUB_API_BASE}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { username } }),
    });

    const data = await response.json();
    if (data.errors) {
      throw new Error(
        `GraphQL errors: ${data.errors.map((e) => e.message).join(', ')}`
      );
    }

    logger.debug({ username }, 'Fetched contribution graph');
    return data.data.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    logger.error(
      { username, error: error.message },
      'Failed to fetch contribution graph'
    );
    throw error;
  }
};
