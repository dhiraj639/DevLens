const { calculateLeetcodeScore } = require('../utils/scoringUtils');

/**
 * Fetch LeetCode metrics for a username.
 * Mock realistic, rich developer profiles deterministically based on username.
 */
const fetchLeetcodeData = async (username) => {
  let seed = 0;
  for (let i = 0; i < username.length; i++) {
    seed += username.charCodeAt(i);
  }
  
  const easySolved = 15 + (seed % 35);
  const mediumSolved = 10 + (seed % 45);
  const hardSolved = 2 + (seed % 15);
  const totalSolved = easySolved + mediumSolved + hardSolved;
  
  const contestRating = 1350 + (seed % 650);
  const globalRank = 150000 - (seed % 100000);
  
  const score = calculateLeetcodeScore(easySolved, mediumSolved, hardSolved, contestRating);
  
  return {
    username,
    score,
    easySolved,
    mediumSolved,
    hardSolved,
    totalSolved,
    contestRating,
    globalRank
  };
};

module.exports = { fetchLeetcodeData };
