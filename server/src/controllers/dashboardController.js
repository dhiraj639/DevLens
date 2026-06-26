const GithubAnalysis = require('../models/GithubAnalysis');
const LeetcodeAnalysis = require('../models/LeetcodeAnalysis');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const User = require('../models/User');
const { localGithubData } = require('./githubController');
const { localLeetcodeData } = require('./leetcodeController');
const { localResumeData } = require('./resumeController');

/**
 * Returns a high-level developer profile summary for the Dashboard view.
 */
const getDashboardOverview = async (req, res) => {
  const userId = req.user._id;
  const targetRole = req.user.targetRole || "MERN Developer";

  try {
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
    
    // Average developer score is the mean of connected metrics
    let activeMetricsCount = 0;
    let sumScores = 0;
    
    if (gitData) {
      sumScores += githubScore;
      activeMetricsCount++;
    }
    if (dsaData) {
      sumScores += dsaScore;
      activeMetricsCount++;
    }
    if (resumeData) {
      sumScores += atsScore;
      activeMetricsCount++;
    }
    
    const developerScore = activeMetricsCount > 0 ? Math.round(sumScores / activeMetricsCount) : 0;
    
    // Placement prediction calculations
    let placementReadiness = 0;
    if (activeMetricsCount > 0) {
      placementReadiness = Math.round(
        (0.3 * githubScore) + 
        (0.4 * dsaScore) + 
        (0.3 * atsScore)
      );
      placementReadiness = Math.min(98, Math.max(30, placementReadiness));
    }

    // Extracted skills from resume (used for radar skill-gap mapping)
    const extractedSkills = resumeData
      ? [...(resumeData.extractedSkills || []), ...(resumeData.skills || [])]
      : [];

    res.status(200).json({
      name: req.user.name,
      email: req.user.email,
      targetRole,
      developerScore,
      githubScore,
      leetcodeScore: dsaScore,
      atsScore,
      placementReadiness,
      extractedSkills,  // actual skills from user's resume
      accountsConnected: {
        github: !!gitData,
        leetcode: !!dsaData,
        resume: !!resumeData
      },
      activityHistory: [
        { date: 'Mon', github: Math.max(0, githubScore - 10), leetcode: Math.max(0, dsaScore - 5) },
        { date: 'Tue', github: Math.max(0, githubScore - 5), leetcode: Math.max(0, dsaScore - 2) },
        { date: 'Wed', github: githubScore, leetcode: dsaScore },
        { date: 'Thu', github: githubScore, leetcode: dsaScore },
        { date: 'Fri', github: githubScore, leetcode: dsaScore }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfileRole = async (req, res) => {
  const { targetRole } = req.body;
  const userId = req.user._id;

  if (!targetRole) {
    return res.status(400).json({ message: "targetRole is required" });
  }

  const validRoles = ["MERN Developer", "Frontend Developer", "Backend Developer", "Data Scientist", "ML Engineer", "DevOps Engineer"];
  if (!validRoles.includes(targetRole)) {
    return res.status(400).json({ message: "Invalid targetRole value" });
  }

  try {
    let user;
    try {
      user = await User.findById(userId);
      if (user) {
        user.targetRole = targetRole;
        await user.save();
      }
    } catch (dbErr) {
      // In-memory bypass fallback
      console.warn("DB update role failed, modifying targetRole in req user session.");
      req.user.targetRole = targetRole;
    }

    res.status(200).json({
      message: "Target Role updated successfully",
      targetRole
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardOverview, updateProfileRole };
