import API from './api';

export const getOverview = async () => {
  const response = await API.get('/dashboard/overview');
  return response.data;
};

export const updateRole = async (targetRole) => {
  const response = await API.post('/dashboard/role', { targetRole });
  return response.data;
};
