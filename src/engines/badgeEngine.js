import {
  fetchUserProfile,
  fetchRepositoryInfo,
} from '../services/githubService.js';
import { formatNumber } from '../utils/svgUtils.js';

export const getBadgeData = async (type, param) => {
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
  } else {
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
  }
};
