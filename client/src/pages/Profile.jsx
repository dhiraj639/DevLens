import React, { useState, useEffect } from 'react';
import { User, Award, Shield, CheckCircle, Loader2 } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import * as dashboardService from '../services/dashboardService';

const Profile = () => {
  const { user, updateCachedUserRole } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [targetRole, setTargetRole] = useState('MERN Developer');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setTargetRole(user.targetRole || 'MERN Developer');
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      // 1. Update target role on Node backend
      await dashboardService.updateRole(targetRole);
      
      // 2. Update local context cache
      updateCachedUserRole(targetRole);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred while updating role.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    "MERN Developer",
    "Frontend Developer",
    "Backend Developer",
    "Data Scientist",
    "ML Engineer",
    "DevOps Engineer"
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 relative z-10 w-full">
      {/* Banner card */}
      <div className="relative rounded-2xl overflow-hidden glass-panel p-8 border border-white/5 flex flex-col md:flex-row items-center md:space-x-6 text-center md:text-left">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent pointer-events-none"></div>
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-4xl font-extrabold text-white uppercase ring-4 ring-white/10 shrink-0 mb-4 md:mb-0">
          {name.charAt(0)}
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-white">{name}</h2>
          <p className="text-sm text-slate-400 font-medium">{email}</p>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-300">
            <Shield className="w-3.5 h-3.5" />
            <span>Developer Account</span>
          </div>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center space-x-3 text-emerald-400 text-sm animate-pulse">
          <CheckCircle className="w-5 h-5" />
          <span>Profile configuration updated successfully! All ML predictions are now calibrated.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Profile forms config */}
      <div className="glass-card p-8">
        <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500 font-mono block mb-6">
          Profile Settings
        </span>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono mb-2">
                Name
              </label>
              <input
                type="text"
                disabled
                value={name}
                className="w-full glass-input rounded-xl py-3 px-4 text-sm font-medium opacity-50 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono mb-2">
                Email
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full glass-input rounded-xl py-3 px-4 text-sm font-medium opacity-50 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono mb-2">
              Target Developer Role
            </label>
            <p className="text-xs text-slate-500 mb-3">
              This field regulates ML predictions and coordinates personalized AI Roadmaps.
            </p>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full glass-input rounded-xl py-3.5 px-4 text-sm font-semibold bg-slate-900 border border-white/10"
            >
              {roles.map((role) => (
                <option key={role} value={role} className="bg-slate-950 text-white font-medium">
                  {role}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-6 py-3 rounded-xl text-xs font-bold text-white shadow-lg flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving target role...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </form>
      </div>

      {/* Badges/Achievements layout */}
      <div className="glass-card p-6">
        <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono block mb-4">
          Earned Badges
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-center flex flex-col items-center">
            <Award className="w-8 h-8 text-indigo-400 mb-2" />
            <h4 className="text-xs font-bold text-white">Profile Synced</h4>
            <p className="text-[10px] text-slate-400 mt-1">Setup Target Role</p>
          </div>

          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 text-center flex flex-col items-center opacity-50">
            <Award className="w-8 h-8 text-purple-400 mb-2" />
            <h4 className="text-xs font-bold text-white">GitHub Scraper</h4>
            <p className="text-[10px] text-slate-400 mt-1">Linked repository metrics</p>
          </div>

          <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-center flex flex-col items-center opacity-50">
            <Award className="w-8 h-8 text-cyan-400 mb-2" />
            <h4 className="text-xs font-bold text-white">DSA Master</h4>
            <p className="text-[10px] text-slate-400 mt-1">Conquered medium DSA challenges</p>
          </div>

          <div className="p-4 rounded-xl bg-pink-500/5 border border-pink-500/10 text-center flex flex-col items-center opacity-50">
            <Award className="w-8 h-8 text-pink-400 mb-2" />
            <h4 className="text-xs font-bold text-white">ATS Certified</h4>
            <p className="text-[10px] text-slate-400 mt-1">Resume score above 80</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
