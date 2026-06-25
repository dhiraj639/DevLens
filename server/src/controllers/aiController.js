const { generateAIContent } = require('../services/aiService');
const GithubAnalysis = require('../models/GithubAnalysis');
const LeetcodeAnalysis = require('../models/LeetcodeAnalysis');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const ChatMessage = require('../models/ChatMessage');
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
  if (!message && !req.file) {
    return res.status(400).json({ message: "Message or file is required" });
  }

  try {
    const context = await gatherProfileContext(req);
    context.message = message || "";
    context.file = req.file; // Pass uploaded file to AI context
    
    // Add simple placement score context to chatbot
    const github_score = context.githubScore;
    const dsa_score = context.dsaScore;
    const ats_score = context.atsScore;
    context.placementScore = Math.round((github_score + dsa_score + ats_score) / 3) || 50;

    // Save User message to DB
    const userMsg = new ChatMessage({
      userId: req.user._id,
      sender: 'user',
      text: message || "",
      file: req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : null
    });
    await userMsg.save();

    const reply = await generateAIContent('chat', context);

    // Save AI response to DB
    const aiMsg = new ChatMessage({
      userId: req.user._id,
      sender: 'ai',
      text: reply
    });
    await aiMsg.save();

    res.status(200).json({ 
      reply,
      file: req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ userId: req.user._id }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearChatHistory = async (req, res) => {
  try {
    await ChatMessage.deleteMany({ userId: req.user._id });
    res.status(200).json({ message: "Chat history cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAIReview,
  getAIGapAnalysis,
  getAIRoadmap,
  chatWithAssistant,
  getChatHistory,
  clearChatHistory
};
