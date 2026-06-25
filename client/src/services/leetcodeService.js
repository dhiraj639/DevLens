import API from './api';

export const analyzeLeetcodeAccount = async (username) => {
  const response = await API.post('/leetcode/analyze', { username });
  return response.data;
};

export const getLeetcodeStats = async () => {
  const response = await API.get('/leetcode');
  return response.data;
};
