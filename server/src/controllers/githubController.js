const GithubAnalysis = require('../models/GithubAnalysis');
const { fetchGithubData } = require('../services/githubService');

// In-memory fallback
let localGithubData = {};

const analyzeGithub = async (req, res) => {
  const { username } = req.body;
  const userId = req.user._id;

  if (!username) {
    return res.status(400).json({ message: 'GitHub username is required' });
  }

  try {
    const analysisResults = await fetchGithubData(username);
    
    // Attempt database save
    let savedAnalysis;
    try {
      // Find existing analysis or create new
      let existingAnalysis = await GithubAnalysis.findOne({ userId });
      
      if (existingAnalysis) {
        existingAnalysis.username = username;
        existingAnalysis.score = analysisResults.score;
        existingAnalysis.stars = analysisResults.stars;
        existingAnalysis.forks = analysisResults.forks;
        existingAnalysis.languages = analysisResults.languages;
        existingAnalysis.repositories = analysisResults.repositories;
        existingAnalysis.analyzedAt = Date.now();
        savedAnalysis = await existingAnalysis.save();
      } else {
        savedAnalysis = await GithubAnalysis.create({
          userId,
          username,
          ...analysisResults
        });
      }
    } catch (dbErr) {
      console.warn("DB save failed for GitHub Analysis, saving locally:", dbErr.message);
      localGithubData[userId] = {
        userId,
        username,
        ...analysisResults,
        analyzedAt: new Date()
      };
      savedAnalysis = localGithubData[userId];
    }

    res.status(200).json(savedAnalysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGithubAnalysis = async (req, res) => {
  const userId = req.user._id;

  try {
    let analysis;
    try {
      analysis = await GithubAnalysis.findOne({ userId });
    } catch (dbErr) {
      analysis = localGithubData[userId];
    }

    if (!analysis) {
      // Return a default blank analysis
      return res.status(200).json({
        username: '',
        score: 0,
        stars: 0,
        forks: 0,
        languages: {},
        repositories: []
      });
    }
    
    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { analyzeGithub, getGithubAnalysis, localGithubData };
