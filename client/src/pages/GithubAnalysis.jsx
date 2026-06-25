import React, { useState, useEffect } from 'react';
import { 
  Search, Star, GitFork, BookOpen, 
  Code, Loader2, BarChart2, ShieldAlert 
} from 'lucide-react';
import Github from '../components/GithubIcon';
import * as githubService from '../services/githubService';

const GithubAnalysis = () => {
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const data = await githubService.getGithubStats();
      if (data && data.username) {
        setStats(data);
        setUsername(data.username);
      }
    } catch (err) {
      console.warn("No prior GitHub sync data found.");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSync = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');

    try {
      const data = await githubService.analyzeGithubAccount(username);
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Scrape connection error. Ensure backend server is on.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8 relative z-10 w-full">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <Github className="w-5 h-5 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">GitHub Account Analysis</h1>
      </div>

      {/* Sync trigger */}
      <div className="glass-card p-6">
        <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500 font-mono block mb-4">
          Connect GitHub Profile
        </span>
        <form onSubmit={handleSync} className="flex flex-col sm:flex-row gap-4 items-stretch">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username (e.g. torvalds)"
              className="w-full glass-input rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-6 rounded-xl text-xs font-bold text-white shadow-lg flex items-center justify-center space-x-2 shrink-0 min-h-[50px] sm:min-h-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                <span>Scraping repos...</span>
              </>
            ) : (
              <span>Scrape & Analyze</span>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Scraped metrics block */}
      {stats && stats.score > 0 ? (
        <>
          {/* Key Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono block mb-2">GitHub Index Score</span>
              <h2 className="text-4xl font-extrabold tracking-tight text-indigo-400 font-mono">{stats.score}/100</h2>
              <p className="text-[10px] text-slate-500 mt-1">Weighted metric index</p>
            </div>

            <div className="glass-card p-6 text-center">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono block mb-2">Total Stars Secured</span>
              <h2 className="text-4xl font-extrabold tracking-tight text-amber-400 font-mono">{stats.stars}</h2>
              <p className="text-[10px] text-slate-500 mt-1">Cumulative project appreciation</p>
            </div>

            <div className="glass-card p-6 text-center">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono block mb-2">Repository Forks</span>
              <h2 className="text-4xl font-extrabold tracking-tight text-cyan-400 font-mono">{stats.forks}</h2>
              <p className="text-[10px] text-slate-500 mt-1">Cumulative community contributions</p>
            </div>
          </div>

          {/* Languages distribution */}
          <div className="glass-card p-6">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono block mb-4">
              Languages Composition (Commits Count %)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.languages && Object.entries(stats.languages).map(([lang, val]) => (
                <div key={lang} className="p-4 rounded-xl bg-slate-950/20 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Code className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white">{lang}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 font-mono">{val}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Repositories */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Top Repository Assets</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.repositories && stats.repositories.map((repo, idx) => (
                <div key={idx} className="glass-card p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-indigo-300">{repo.name}</h4>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-semibold text-slate-400">
                      {repo.language}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 mt-6 text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span>{repo.stars} stars</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <GitFork className="w-4 h-4 text-cyan-500" />
                      <span>{repo.forks} forks</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <BarChart2 className="w-4 h-4 text-purple-500" />
                      <span>{repo.commitsCount} commits</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="glass-card p-12 text-center text-slate-500 space-y-4">
          <Github className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-400">No synchronized GitHub profile</h3>
          <p className="text-xs max-w-sm mx-auto leading-relaxed">
            Enter your GitHub developer username in the prompt above and trigger the scraping engine to generate metrics.
          </p>
        </div>
      )}
    </div>
  );
};

export default GithubAnalysis;
