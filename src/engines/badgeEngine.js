import {
  fetchUserProfile,
  fetchRepositoryInfo,
} from '../services/githubService.js';
import { formatNumber } from '../utils/svgUtils.js';

export const createFallbackBadgeData = (type, param) => {
  if (type === 'followers') {
    return {
      label: 'Followers',
      value: '0',
      color: '#4c1',
      singleSegment: false,
      style: 'flat',
    };
  }

  const repoName =
    String(param || '')
      .split('/')
      .at(-1) || 'repo';

  switch (type) {
    case 'stars':
      return {
        label: 'Stars',
        value: '0',
        color: '#4c1',
        singleSegment: false,
        style: 'flat',
      };
    case 'forks':
      return {
        label: 'Forks',
        value: '0',
        color: '#4c1',
        singleSegment: false,
        style: 'flat',
      };
    case 'license':
      return {
        label: 'License',
        value: 'Unknown',
        color: '#007ec6',
        singleSegment: false,
        style: 'flat',
      };
    case 'repo':
      return {
        label: 'Repo',
        value: repoName,
        color: '#007ec6',
        singleSegment: false,
        style: 'flat',
      };
    default:
      throw new Error('Invalid badge type');
  }
};

export const getBadgeData = async (type, param) => {
  try {
    let data;
    if (type === 'followers') {
      data = await fetchUserProfile(param);
      return {
        label: 'Followers',
        value: formatNumber(data.followers),
        color: '#4c1',
        singleSegment: false,
        style: 'flat',
      };
    }

    data = await fetchRepositoryInfo(param);
    switch (type) {
      case 'stars':
        return {
          label: 'Stars',
          value: formatNumber(data.stargazers_count),
          color: '#4c1',
          singleSegment: false,
          style: 'flat',
        };
      case 'forks':
        return {
          label: 'Forks',
          value: formatNumber(data.forks_count),
          color: '#4c1',
          singleSegment: false,
          style: 'flat',
        };
      case 'license':
        return {
          label: 'License',
          value: data.license ? data.license.spdx_id : 'None',
          color: '#007ec6',
          singleSegment: false,
          style: 'flat',
        };
      case 'repo':
        return {
          label: 'Repo',
          value: data.name,
          color: '#007ec6',
          singleSegment: false,
          style: 'flat',
        };
      default:
        throw new Error('Invalid badge type');
    }
  } catch (error) {
    if (error.message === 'Invalid badge type') {
      throw error;
    }

    if (
      error.message.includes('404') ||
      error.message.includes('401') ||
      error.message.includes('403') ||
      error.message.includes('fetch failed')
    ) {
      return createFallbackBadgeData(type, param);
    }

    return createFallbackBadgeData(type, param);
  }
};
