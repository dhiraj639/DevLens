const path = require('path');
const fs = require('fs');
const axios = require('axios');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const { parseResumeFile } = require('../services/resumeService');

// In-memory fallback
let localResumeData = {};

const analyzeResume = async (req, res) => {
  const userId = req.user._id;

  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a resume file' });
  }

  const filePath = req.file.path;
  const targetRole = req.user.targetRole || 'MERN Developer';

  try {
    // 1. Extract text from uploaded document
    const resumeText = await parseResumeFile(filePath);
    
    // 2. Call ML microservice to get similarity metrics and keyword gaps
    const mlUrl = `${process.env.ML_SERVICE_URL || 'http://127.0.0.1:5000'}/analyze-ats`;
    
    let mlResults = {
      ats_score: 55,
      missing_keywords: ['Docker', 'AWS', 'Redis'],
      suggestions: ['Add containerization details.', 'Optimize profile keywords.'],
      extracted_skills: ['React', 'Node', 'Express', 'JavaScript', 'HTML']
    };

    try {
      const mlResponse = await axios.post(mlUrl, {
        resume_text: resumeText,
        target_role: targetRole
      }, { timeout: 4000 });
      
      if (mlResponse.data) {
        mlResults = mlResponse.data;
      }
    } catch (mlErr) {
      console.warn("ML Service connection offline, using fallback ATS scoring logic:", mlErr.message);
      // Construct logical fallback scores depending on keywords in the text
      const textLower = resumeText.toLowerCase();
      let matchedCount = 0;
      const criticalKeywords = targetRole === 'MERN Developer' 
        ? ['react', 'node', 'express', 'mongodb', 'javascript']
        : ['docker', 'kubernetes', 'aws', 'cicd', 'git'];
        
      criticalKeywords.forEach(kw => {
        if (textLower.includes(kw)) matchedCount++;
      });
      
      const ratio = matchedCount / criticalKeywords.length;
      mlResults.ats_score = Math.round(35 + (ratio * 55));
      mlResults.missing_keywords = criticalKeywords.filter(kw => !textLower.includes(kw)).map(k => k.toUpperCase());
    }

    // 3. Save to database or memory
    let savedAnalysis;
    try {
      let existingAnalysis = await ResumeAnalysis.findOne({ userId });
      
      if (existingAnalysis) {
        existingAnalysis.filePath = filePath;
        existingAnalysis.atsScore = mlResults.ats_score;
        existingAnalysis.skills = mlResults.extracted_skills || [];
        existingAnalysis.missingKeywords = mlResults.missing_keywords || [];
        existingAnalysis.suggestions = mlResults.suggestions || [];
        existingAnalysis.extractedSkills = mlResults.extracted_skills || [];
        existingAnalysis.analyzedAt = Date.now();
        savedAnalysis = await existingAnalysis.save();
      } else {
        savedAnalysis = await ResumeAnalysis.create({
          userId,
          filePath,
          atsScore: mlResults.ats_score,
          skills: mlResults.extracted_skills || [],
          missingKeywords: mlResults.missing_keywords || [],
          suggestions: mlResults.suggestions || [],
          extractedSkills: mlResults.extracted_skills || []
        });
      }
    } catch (dbErr) {
      console.warn("DB save failed for Resume Analysis, saving locally:", dbErr.message);
      localResumeData[userId] = {
        userId,
        filePath,
        atsScore: mlResults.ats_score,
        skills: mlResults.extracted_skills || [],
        missingKeywords: mlResults.missing_keywords || [],
        suggestions: mlResults.suggestions || [],
        extractedSkills: mlResults.extracted_skills || [],
        analyzedAt: new Date()
      };
      savedAnalysis = localResumeData[userId];
    }

    res.status(200).json(savedAnalysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResumeAnalysis = async (req, res) => {
  const userId = req.user._id;

  try {
    let analysis;
    try {
      analysis = await ResumeAnalysis.findOne({ userId });
    } catch (dbErr) {
      analysis = localResumeData[userId];
    }

    if (!analysis) {
      return res.status(200).json({
        filePath: '',
        atsScore: 0,
        skills: [],
        missingKeywords: [],
        suggestions: [],
        extractedSkills: []
      });
    }

    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { analyzeResume, getResumeAnalysis, localResumeData };
