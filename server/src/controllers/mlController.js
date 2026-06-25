const axios = require('axios');
const GithubAnalysis = require('../models/GithubAnalysis');
const LeetcodeAnalysis = require('../models/LeetcodeAnalysis');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const { localGithubData } = require('./githubController');
const { localLeetcodeData } = require('./leetcodeController');
const { localResumeData } = require('./resumeController');

/**
 * Executes ML pipelines for the user.
 * Combines GitHub, LeetCode, and Resume metrics to call Flask ML service.
 */
const runMLPredictions = async (req, res) => {
  const userId = req.user._id;
  const targetRole = req.user.targetRole || "MERN Developer";

  try {
    // 1. Fetch analysis records from DB or local arrays
    let gitData, dsaData, resumeData;
    
    try {
      gitData = await GithubAnalysis.findOne({ userId });
    } catch (dbErr) {
      gitData = localGithubData[userId];
    }
    
    try {
      dsaData = await LeetcodeAnalysis.findOne({ userId });
    } catch (dbErr) {
      dsaData = localLeetcodeData[userId];
    }
    
    try {
      resumeData = await ResumeAnalysis.findOne({ userId });
    } catch (dbErr) {
      resumeData = localResumeData[userId];
    }

    // Default features if profiles haven't been scanned yet
    const github_score = gitData ? gitData.score : 0;
    const dsa_score = dsaData ? dsaData.score : 0;
    const ats_score = resumeData ? resumeData.atsScore : 0;
    const projects_count = gitData ? gitData.repositories.length : 0;
    
    // Skills match ratio: calculate based on missing keywords count
    const missingCount = resumeData ? resumeData.missingKeywords.length : 4;
    const skills_match_ratio = Math.max(0.1, 1 - (missingCount / 10));

    // Experience vectors matched to User's targetRole (representing their profile focus)
    let frontend_exp = 0.5;
    let backend_exp = 0.5;
    let data_science_exp = 0.5;
    let devops_exp = 0.5;

    switch (targetRole) {
      case "MERN Developer":
        frontend_exp = 3.5;
        backend_exp = 3.0;
        devops_exp = 1.0;
        break;
      case "Frontend Developer":
        frontend_exp = 4.2;
        backend_exp = 0.8;
        break;
      case "Backend Developer":
        frontend_exp = 0.8;
        backend_exp = 4.0;
        devops_exp = 1.5;
        break;
      case "Data Scientist":
        data_science_exp = 3.8;
        break;
      case "ML Engineer":
        data_science_exp = 4.5;
        break;
      case "DevOps Engineer":
        devops_exp = 4.2;
        backend_exp = 2.0;
        break;
    }

    const mlPayload = {
      github_score,
      dsa_score,
      ats_score,
      projects_count,
      skills_match_ratio,
      frontend_exp,
      backend_exp,
      data_science_exp,
      devops_exp
    };

    const mlUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:5000';
    let placementReadiness = 40;
    let recommendedRole = "MERN Developer";

    // Call Random Forest (Placement prediction)
    try {
      const pResponse = await axios.post(`${mlUrl}/predict-placement`, mlPayload, { timeout: 3000 });
      if (pResponse.data && pResponse.data.placement_readiness) {
        placementReadiness = pResponse.data.placement_readiness;
      }
    } catch (e) {
      console.warn("Flask ML placement service connection offline, using formula calculation fallback:", e.message);
      // Fallback weight formula: 0.3*git + 0.35*dsa + 0.2*ats + metrics
      placementReadiness = Math.round(
        (0.3 * github_score) + 
        (0.35 * dsa_score) + 
        (0.2 * ats_score) + 
        (projects_count * 1.5) + 
        (skills_match_ratio * 5)
      );
      placementReadiness = Math.min(99, Math.max(30, placementReadiness));
    }

    // Call XGBoost (Career recommendation)
    try {
      const rResponse = await axios.post(`${mlUrl}/recommend-role`, mlPayload, { timeout: 3000 });
      if (rResponse.data && rResponse.data.recommended_role) {
        recommendedRole = rResponse.data.recommended_role;
      }
    } catch (e) {
      console.warn("Flask ML role service offline, using logic rule fallback:", e.message);
      recommendedRole = targetRole; // Fallback to current target role
    }

    res.status(200).json({
      placementReadiness,
      recommendedRole,
      metricsAnalyzed: {
        github_score,
        dsa_score,
        ats_score,
        projects_count,
        skills_match_ratio
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { runMLPredictions };
