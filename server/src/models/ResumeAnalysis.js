const mongoose = require('mongoose');

const ResumeAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  atsScore: {
    type: Number,
    required: true,
    default: 0,
  },
  skills: {
    type: [String],
    default: [],
  },
  missingKeywords: {
    type: [String],
    default: [],
  },
  suggestions: {
    type: [String],
    default: [],
  },
  extractedSkills: {
    type: [String],
    default: [],
  },
  analyzedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ResumeAnalysis', ResumeAnalysisSchema);
