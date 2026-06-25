import React, { useState, useEffect } from 'react';
import { 
  Terminal, Search, Loader2, Award, 
  HelpCircle, ShieldAlert, CheckCircle2 
} from 'lucide-react';
import * as leetcodeService from '../services/leetcodeService';

const LeetcodeAnalysis = () => {
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const data = await leetcodeService.getLeetcodeStats();
      if (data && data.username) {
        setStats(data);
        setUsername(data.username);
      }
    } catch (err) {
      console.warn("No prior LeetCode data found.");
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
      const data = await leetcodeService.analyzeLeetcodeAccount(username);
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Sync error. Ensure backend server is on.');
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
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
          <Terminal className="w-5 h-5 text-purple-400" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">LeetCode DSA Analysis</h1>
      </div>

      {/* Sync input */}
      <div className="glass-card p-6">
        <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500 font-mono block mb-4">
          Connect LeetCode Account
        </span>
        <form onSubmit={handleSync} className="flex flex-col sm:flex-row gap-4 items-stretch">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter LeetCode username"
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
                <span>Syncing metrics...</span>
              </>
            ) : (
              <span>Sync Account</span>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2 animate-pulse">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results grid */}
      {stats && stats.score > 0 ? (
        <>
          {/* Top Row metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono block mb-2">DSA Score</span>
              <h2 className="text-4xl font-extrabold tracking-tight text-purple-400 font-mono">{stats.score}/100</h2>
              <p className="text-[10px] text-slate-500 mt-1">Difficulty & Rating weighted</p>
            </div>

            <div className="glass-card p-6 text-center">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono block mb-2">Contest Rating</span>
              <h2 className="text-4xl font-extrabold tracking-tight text-amber-400 font-mono">{stats.contestRating}</h2>
              <p className="text-[10px] text-slate-500 mt-1">Active contest percentile</p>
            </div>

            <div className="glass-card p-6 text-center">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono block mb-2">Global Rank</span>
              <h2 className="text-4xl font-extrabold tracking-tight text-cyan-400 font-mono">#{stats.globalRank.toLocaleString()}</h2>
              <p className="text-[10px] text-slate-500 mt-1">Platform-wide ranking position</p>
            </div>
          </div>

          {/* Circular solve count details */}
          <div className="glass-card p-8">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono block mb-6">
              Submission Difficulty Distribution
            </span>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              {/* Total solved display */}
              <div className="text-center md:border-r border-white/5 py-4">
                <h3 className="text-5xl font-extrabold text-white font-mono">{stats.totalSolved}</h3>
                <p className="text-xs text-slate-500 font-semibold uppercase mt-1.5 tracking-wider">Total Challenges Solved</p>
              </div>

              {/* EasySolved bar */}
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-emerald-400">Easy Solved</span>
                  <span className="text-xs font-bold text-white font-mono">{stats.easySolved}</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (stats.easySolved/50)*100)}%` }}></div>
                </div>
              </div>

              {/* MediumSolved bar */}
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-400">Medium Solved</span>
                  <span className="text-xs font-bold text-white font-mono">{stats.mediumSolved}</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, (stats.mediumSolved/45)*100)}%` }}></div>
                </div>
              </div>

              {/* HardSolved bar */}
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-red-400">Hard Solved</span>
                  <span className="text-xs font-bold text-white font-mono">{stats.hardSolved}</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: `${Math.min(100, (stats.hardSolved/20)*100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="glass-card p-12 text-center text-slate-500 space-y-4">
          <Award className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-400">No synchronized LeetCode profile</h3>
          <p className="text-xs max-w-sm mx-auto leading-relaxed">
            Configure your username above and sync LeetCode solved distributions to populate data science charts.
          </p>
        </div>
      )}
    </div>
  );
};

export default LeetcodeAnalysis;
