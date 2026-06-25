/**
 * Calculate developer GitHub score out of 100 based on repository stars, forks, and codebase activity
 */
const calculateGithubScore = (repositories) => {
  if (!repositories || repositories.length === 0) return 45; // Default score
  
  let totalStars = 0;
  let totalForks = 0;
  let totalCommits = 0;
  
  repositories.forEach(repo => {
    totalStars += repo.stars || 0;
    totalForks += repo.forks || 0;
    totalCommits += repo.commitsCount || 10;
  });
  
  // Weights: repos (15%), stars (35%), forks (25%), commits (25%)
  const repoCountScore = Math.min(100, repositories.length * 10);
  const starsScore = Math.min(100, totalStars * 5);
  const forksScore = Math.min(100, totalForks * 10);
  const commitsScore = Math.min(100, (totalCommits / repositories.length) * 2);
  
  const score = Math.round(
    0.15 * repoCountScore + 
    0.35 * starsScore + 
    0.25 * forksScore + 
    0.25 * commitsScore
  );
  
  return Math.min(100, Math.max(30, score));
};

/**
 * Calculate developer DSA (Leetcode) score out of 100 based on solved difficulties and ratings
 */
const calculateLeetcodeScore = (easy, medium, hard, contestRating) => {
  const easyWeight = 0.15;
  const mediumWeight = 0.50;
  const hardWeight = 0.35;
  
  // Cap solving goals
  const easyScore = Math.min(100, (easy / 50) * 100);
  const mediumScore = Math.min(100, (medium / 40) * 100);
  const hardScore = Math.min(100, (hard / 15) * 100);
  
  let baseScore = (easyScore * easyWeight) + (mediumScore * mediumWeight) + (hardScore * hardWeight);
  
  // Contest rating bonus (if rating exists)
  if (contestRating > 0) {
    const ratingBonus = Math.min(15, (contestRating / 1500) * 10);
    baseScore += ratingBonus;
  }
  
  return Math.min(100, Math.max(25, Math.round(baseScore)));
};

module.exports = {
  calculateGithubScore,
  calculateLeetcodeScore,
};
