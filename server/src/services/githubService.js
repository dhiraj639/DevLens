const { calculateGithubScore } = require('../utils/scoringUtils');

/**
 * Fetch GitHub metrics for username.
 * For production, this calls GitHub API. 
 * For this demo/developer platform, we mock realistic, rich developer profiles deterministically based on username.
 */
const fetchGithubData = async (username) => {
  // Deterministic seed generation based on username
  let seed = 0;
  for (let i = 0; i < username.length; i++) {
    seed += username.charCodeAt(i);
  }
  
  const repoNames = [
    'ecommerce-microservices', 'react-dashboard-glassmorphism', 'dsa-practice',
    'fastapi-ml-deploy', 'graphql-gateway', 'chat-assistant-ui',
    'docker-ansible-cicd', 'kubernetes-cluster-monitoring', 'web-scraper-redis',
    'neural-network-from-scratch', 'cli-markdown-editor'
  ];
  
  const languagesList = ['JavaScript', 'TypeScript', 'Python', 'Go', 'HTML', 'CSS', 'Shell'];
  
  const reposCount = 4 + (seed % 6);
  const repositories = [];
  const languageStats = {};
  
  let totalStars = 0;
  let totalForks = 0;
  
  for (let i = 0; i < reposCount; i++) {
    const repoIndex = (seed + i) % repoNames.length;
    const name = repoNames[repoIndex] + (i > 3 ? `-${i}` : '');
    const stars = (seed * (i + 1)) % 45;
    const forks = (seed + i) % 18;
    const lang = languagesList[(seed + i * 2) % languagesList.length];
    const commitsCount = 15 + ((seed * (i + 2)) % 80);
    
    repositories.push({
      name,
      stars,
      forks,
      language: lang,
      commitsCount
    });
    
    totalStars += stars;
    totalForks += forks;
    
    languageStats[lang] = (languageStats[lang] || 0) + commitsCount;
  }
  
  // Normalize languages to percentages
  const totalCommits = Object.values(languageStats).reduce((a, b) => a + b, 0);
  const normalizedLanguages = {};
  Object.keys(languageStats).forEach(lang => {
    normalizedLanguages[lang] = Math.round((languageStats[lang] / totalCommits) * 100);
  });
  
  const score = calculateGithubScore(repositories);
  
  return {
    username,
    score,
    stars: totalStars,
    forks: totalForks,
    languages: normalizedLanguages,
    repositories
  };
};

module.exports = { fetchGithubData };
