const mongoose = require('mongoose');

const RepositorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  stars: { type: Number, default: 0 },
  forks: { type: Number, default: 0 },
  language: { type: String, default: 'JavaScript' },
  commitsCount: { type: Number, default: 10 },
});

const GithubAnalysisSchema = new mongoose.Schema({
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
  stars: {
    type: Number,
    default: 0,
  },
  forks: {
    type: Number,
    default: 0,
  },
  languages: {
    type: Map,
    of: Number, // Example: { 'JavaScript': 70, 'HTML': 20, 'CSS': 10 }
    default: {},
  },
  repositories: [RepositorySchema],
  analyzedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('GithubAnalysis', GithubAnalysisSchema);
