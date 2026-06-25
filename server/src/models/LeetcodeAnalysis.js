const mongoose = require('mongoose');

const LeetcodeAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  easySolved: {
    type: Number,
    default: 0,
  },
  mediumSolved: {
    type: Number,
    default: 0,
  },
  hardSolved: {
    type: Number,
    default: 0,
  },
  totalSolved: {
    type: Number,
    default: 0,
  },
  contestRating: {
    type: Number,
    default: 0,
  },
  globalRank: {
    type: Number,
    default: 0,
  },
  analyzedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('LeetcodeAnalysis', LeetcodeAnalysisSchema);
