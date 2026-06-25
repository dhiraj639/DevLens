import API from './api';

export const getAIReview = async () => {
  const response = await API.get('/ai/review');
  return response.data;
};

export const getAIGapAnalysis = async () => {
  const response = await API.get('/ai/gap-analysis');
  return response.data;
};

export const getAIRoadmap = async () => {
  const response = await API.get('/ai/roadmap');
  return response.data;
};

export const chatWithAssistant = async (message) => {
  const response = await API.post('/ai/chat', { message });
  return response.data;
};

export const chatWithAssistantMultipart = async (formData) => {
  const response = await API.post('/ai/chat', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getChatHistory = async () => {
  const response = await API.get('/ai/history');
  return response.data;
};

export const clearChatHistory = async () => {
  const response = await API.delete('/ai/history');
  return response.data;
};


