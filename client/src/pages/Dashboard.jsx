import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, Terminal, FileText, BarChart3, 
  HelpCircle, ChevronRight, Activity, Zap 
} from 'lucide-react';
import Github from '../components/GithubIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as dashboardService from '../services/dashboardService';
import ScoreCard from '../components/ScoreCard';
import SkillRadarChart from '../components/SkillRadarChart';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const data = await dashboardService.getOverview();
        setOverview(data);
      } catch (err) {
        console.error("Error loading dashboard overview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Set up details from overview response
  const developerScore = overview?.developerScore || 0;
  const githubScore = overview?.githubScore || 0;
  const leetcodeScore = overview?.leetcodeScore || 0;
  const atsScore = overview?.atsScore || 0;
  const placementReadiness = overview?.placementReadiness || 0;
  const targetRole = overview?.targetRole || "MERN Developer";

  // Recharts Bar chart data mapping
  const barChartData = [
    { name: 'GitHub Score', value: githubScore, fill: '#6366f1' },
    { name: 'DSA Score', value: leetcodeScore, fill: '#a855f7' },
    { name: 'ATS Resume', value: atsScore, fill: '#06b6d4' },
    { name: 'Placement Readiness', value: placementReadiness, fill: '#10b981' }
  ];

  // Radar charts metrics mapping based on user inputs
  const radarData = [
    { subject: 'Frontend', A: targetRole.includes('Frontend') || targetRole.includes('MERN') ? 85 : 40, fullMark: 100 },
    { subject: 'Backend', A: targetRole.includes('Backend') || targetRole.includes('MERN') ? 80 : 35, fullMark: 100 },
    { subject: 'DSA', A: leetcodeScore > 0 ? leetcodeScore : 45, fullMark: 100 },
    { subject: 'DevOps', A: targetRole.includes('DevOps') ? 90 : 35, fullMark: 100 },
    { subject: 'AI Tech', A: targetRole.includes('ML') || targetRole.includes('Science') ? 85 : 50, fullMark: 100 },
    { subject: 'Comm.', A: atsScore > 0 ? atsScore : 75, fullMark: 100 },
  ];

  return (
    <div className="space-y-8 relative z-10 w-full">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 glass-panel rounded-2xl border border-white/5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Welcome Back, <span className="gradient-text">{overview?.name || 'Developer'}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Analyzing metrics against your Target Role: <strong className="text-indigo-400 font-semibold">{targetRole}</strong>
          </p>
        </div>
        <div className="flex space-x-3 items-center self-start lg:self-center">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 font-mono">Live Sync Active</span>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ScoreCard 
          title="Overall Dev Score" 
          value={developerScore} 
          label="Multi-factor average"
          icon={Award}
          colorClass="from-indigo-500 to-purple-600"
        />
        <ScoreCard 
          title="GitHub Index" 
          value={githubScore} 
          label="Repository & commit weight"
          icon={Github}
          colorClass="from-blue-500 to-indigo-600"
        />
        <ScoreCard 
          title="LeetCode DSA" 
          value={leetcodeScore} 
          label="Solved counts & rating"
          icon={Terminal}
          colorClass="from-purple-500 to-pink-600"
        />
        <ScoreCard 
          title="Resume ATS" 
          value={atsScore} 
          label="Similarity keyword match"
          icon={FileText}
          colorClass="from-cyan-500 to-blue-500"
        />
      </div>

      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Placement Prediction Card */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono">Placement Readiness</span>
              <Zap className="w-5 h-5 text-indigo-400 animate-bounce" />
            </div>
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center relative w-36 h-36 rounded-full border-4 border-white/5 bg-slate-950/40">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/20 animate-spin"></div>
                <div className="text-center">
                  <h3 className="text-4xl font-extrabold text-white font-mono">{placementReadiness}%</h3>
                  <p className="text-[10px] text-indigo-300 font-semibold tracking-widest uppercase mt-1">Ready</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 text-center px-4 leading-relaxed font-medium">
              Calculated using the **Random Forest Regressor** model based on GitHub repositories, LeetCode submissions, and Resume ATS keyword indexing.
            </p>
          </div>
          <Link to="/assistant" className="btn-primary mt-6 w-full py-3 text-xs font-bold text-center text-white rounded-xl shadow-md flex items-center justify-center space-x-2">
            <span>Consult AI Career Assistant</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Radar Skills Balance */}
        <div className="glass-card p-6">
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono block mb-4">
            Skill Dimension Balance
          </span>
          <SkillRadarChart data={radarData} />
        </div>

        {/* Analytics bar chart */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono block mb-4">
              Target Framework Comparison
            </span>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-mono leading-snug pt-3 border-t border-white/5 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-slate-400" />
            <span>XGBoost classifies focus as: {targetRole}</span>
          </div>
        </div>
      </div>

      {/* Integration Status & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Connected integrations */}
        <div className="glass-card p-6 space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono block">
            Integration Connections
          </span>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/30 border border-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-300">
                  <Github className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">GitHub Integration</h4>
                  <p className="text-xs text-slate-400">Scrape repositories & language weight</p>
                </div>
              </div>
              {overview?.accountsConnected?.github ? (
                <Link to="/github" className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs font-semibold text-indigo-300">
                  Manage Sync
                </Link>
              ) : (
                <Link to="/github" className="px-3 py-1.5 btn-primary rounded-lg text-xs font-semibold text-white">
                  Connect Account
                </Link>
              )}
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/30 border border-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-300">
                  <Terminal className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">LeetCode Sync</h4>
                  <p className="text-xs text-slate-400">Compare solved DSA challenges</p>
                </div>
              </div>
              {overview?.accountsConnected?.leetcode ? (
                <Link to="/leetcode" className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs font-semibold text-indigo-300">
                  Manage Sync
                </Link>
              ) : (
                <Link to="/leetcode" className="px-3 py-1.5 btn-primary rounded-lg text-xs font-semibold text-white">
                  Connect Account
                </Link>
              )}
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/30 border border-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-300">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">ATS Resume Optimization</h4>
                  <p className="text-xs text-slate-400">Calculate similarity keyword alignment</p>
                </div>
              </div>
              {overview?.accountsConnected?.resume ? (
                <Link to="/resume" className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs font-semibold text-indigo-300">
                  Optimize
                </Link>
              ) : (
                <Link to="/resume" className="px-3 py-1.5 btn-primary rounded-lg text-xs font-semibold text-white">
                  Upload Resume
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* AI Action Suggestions */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono block mb-4">
              AI Action suggestions
            </span>
            <div className="space-y-4">
              <div className="flex space-x-3 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-indigo-200">
                <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 animate-pulse shrink-0"></div>
                <p className="leading-relaxed">
                  Your Target Role is set to <strong>{targetRole}</strong>. Set up your learning roadmap in AI assistant to identify which skills to study next.
                </p>
              </div>

              <div className="flex space-x-3 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-xs text-cyan-200">
                <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 animate-pulse shrink-0"></div>
                <p className="leading-relaxed">
                  Upload a fresh developer resume under the <strong>Resume section</strong> to check compatibility scoring using the TF-IDF Cosine Similarity algorithm.
                </p>
              </div>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Need career roadmap guidance?</span>
            <Link to="/assistant" className="font-bold text-indigo-400 hover:text-indigo-300 flex items-center">
              <span>Go to Assistant</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
