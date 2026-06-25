import API from './api';

export const analyzeGithubAccount = async (username) => {
  const response = await API.post('/github/analyze', { username });
  return response.data;
};

export const getGithubStats = async () => {
  const response = await API.get('/github');
  return response.data;
};
