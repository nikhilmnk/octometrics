import {
  fetchUserProfile,
  fetchRepositoryInfo,
} from '../services/githubService.js';
import { formatNumber } from '../utils/svgUtils.js';

export const getBadgeData = async (type, param) => {
  let data;
  if (type === 'followers') {
    data = await fetchUserProfile(param);
    return { label: 'Followers', value: formatNumber(data.followers) };
  } else {
    data = await fetchRepositoryInfo(param);
    switch (type) {
      case 'stars':
        return { label: 'Stars', value: formatNumber(data.stargazers_count) };
      case 'forks':
        return { label: 'Forks', value: formatNumber(data.forks_count) };
      case 'license':
        return {
          label: 'License',
          value: data.license ? data.license.spdx_id : 'None',
        };
      case 'repo':
        return { label: 'Repo', value: data.name };
      default:
        throw new Error('Invalid badge type');
    }
  }
};
