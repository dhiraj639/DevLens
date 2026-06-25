import API from './api';

export const runMLPredictions = async () => {
  const response = await API.post('/ml/predict');
  return response.data;
};
