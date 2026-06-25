const { generateAIContent } = require('../services/aiService');
const GithubAnalysis = require('../models/GithubAnalysis');
const LeetcodeAnalysis = require('../models/LeetcodeAnalysis');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const { localGithubData } = require('./githubController');
const { localLeetcodeData } = require('./leetcodeController');
const { localResumeData } = require('./resumeController');

// Helper to gather profile context
const gatherProfileContext = async (req) => {
  const userId = req.user._id;
  const targetRole = req.user.targetRole || "MERN Developer";

  let gitData, dsaData, resumeData;
  
  try {
    gitData = await GithubAnalysis.findOne({ userId });
  } catch (e) {
    gitData = localGithubData[userId];
  }
  
  try {
    dsaData = await LeetcodeAnalysis.findOne({ userId });
  } catch (e) {
    dsaData = localLeetcodeData[userId];
  }
  
  try {
    resumeData = await ResumeAnalysis.findOne({ userId });
  } catch (e) {
    resumeData = localResumeData[userId];
  }

  const githubScore = gitData ? gitData.score : 0;
  const dsaScore = dsaData ? dsaData.score : 0;
  const atsScore = resumeData ? resumeData.atsScore : 0;
  const skills = resumeData ? resumeData.skills : [];

  return {
    targetRole,
    githubScore,
    dsaScore,
    atsScore,
    skills
  };
};

const getAIReview = async (req, res) => {
  try {
    const context = await gatherProfileContext(req);
    const content = await generateAIContent('review', context);
    res.status(200).json({ review: content });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAIGapAnalysis = async (req, res) => {
  try {
    const context = await gatherProfileContext(req);
    const content = await generateAIContent('gap-analysis', context);
    res.status(200).json({ gapAnalysis: content });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAIRoadmap = async (req, res) => {
  try {
    const context = await gatherProfileContext(req);
    const content = await generateAIContent('roadmap', context);
    res.status(200).json({ roadmap: content });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const chatWithAssistant = async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    const context = await gatherProfileContext(req);
    context.message = message;
    
    // Add simple placement score context to chatbot
    const github_score = context.githubScore;
    const dsa_score = context.dsaScore;
    const ats_score = context.atsScore;
    context.placementScore = Math.round((github_score + dsa_score + ats_score) / 3) || 50;

    const reply = await generateAIContent('chat', context);
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAIReview,
  getAIGapAnalysis,
  getAIRoadmap,
  chatWithAssistant
};
