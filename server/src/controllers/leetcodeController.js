const LeetcodeAnalysis = require('../models/LeetcodeAnalysis');
const { fetchLeetcodeData } = require('../services/leetcodeService');

// In-memory fallback
let localLeetcodeData = {};

const analyzeLeetcode = async (req, res) => {
  const { username } = req.body;
  const userId = req.user._id;

  if (!username) {
    return res.status(400).json({ message: 'LeetCode username is required' });
  }

  try {
    const analysisResults = await fetchLeetcodeData(username);
    
    let savedAnalysis;
    try {
      let existingAnalysis = await LeetcodeAnalysis.findOne({ userId });
      
      if (existingAnalysis) {
        existingAnalysis.username = username;
        existingAnalysis.score = analysisResults.score;
        existingAnalysis.easySolved = analysisResults.easySolved;
        existingAnalysis.mediumSolved = analysisResults.mediumSolved;
        existingAnalysis.hardSolved = analysisResults.hardSolved;
        existingAnalysis.totalSolved = analysisResults.totalSolved;
        existingAnalysis.contestRating = analysisResults.contestRating;
        existingAnalysis.globalRank = analysisResults.globalRank;
        existingAnalysis.analyzedAt = Date.now();
        savedAnalysis = await existingAnalysis.save();
      } else {
        savedAnalysis = await LeetcodeAnalysis.create({
          userId,
          username,
          ...analysisResults
        });
      }
    } catch (dbErr) {
      console.warn("DB save failed for Leetcode Analysis, saving locally:", dbErr.message);
      localLeetcodeData[userId] = {
        userId,
        username,
        ...analysisResults,
        analyzedAt: new Date()
      };
      savedAnalysis = localLeetcodeData[userId];
    }

    res.status(200).json(savedAnalysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeetcodeAnalysis = async (req, res) => {
  const userId = req.user._id;

  try {
    let analysis;
    try {
      analysis = await LeetcodeAnalysis.findOne({ userId });
    } catch (dbErr) {
      analysis = localLeetcodeData[userId];
    }

    if (!analysis) {
      return res.status(200).json({
        username: '',
        score: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        totalSolved: 0,
        contestRating: 0,
        globalRank: 0
      });
    }
    
    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { analyzeLeetcode, getLeetcodeAnalysis, localLeetcodeData };
