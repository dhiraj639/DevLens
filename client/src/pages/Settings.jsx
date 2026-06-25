import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Bell, Eye, EyeOff, Key, Trash2 } from 'lucide-react';

const Settings = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('********************************');
  
  return (
    <div className="max-w-3xl mx-auto space-y-8 relative z-10 w-full">
      <div className="flex items-center space-x-3">
        <SettingsIcon className="w-8 h-8 text-indigo-400" />
        <h1 className="text-3xl font-extrabold tracking-tight text-white">App Settings</h1>
      </div>

      {/* General Settings */}
      <div className="glass-card p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Preferences</h3>
          <p className="text-xs text-slate-400">Configure theme rendering and notifications.</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-950/20 border border-white/5 rounded-xl">
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Dark Mode presets</h4>
              <p className="text-xs text-slate-500">Enable premium glow backdrops (Default on)</p>
            </div>
            <div className="w-11 h-6 bg-indigo-600 rounded-full flex items-center justify-end px-0.5 cursor-pointer">
              <div className="w-5 h-5 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-950/20 border border-white/5 rounded-xl">
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Email Notifications</h4>
              <p className="text-xs text-slate-500">Get notified when ML placement model runs predictions</p>
            </div>
            <div className="w-11 h-6 bg-slate-800 rounded-full flex items-center px-0.5 cursor-pointer">
              <div className="w-5 h-5 bg-slate-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* API Integrations */}
      <div className="glass-card p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">API Integrations</h3>
          <p className="text-xs text-slate-400">Manage Gemini / OpenAI key variables.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono mb-2">
              Gemini API Key
            </label>
            <div className="relative">
              <Key className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full glass-input rounded-xl py-3.5 pl-12 pr-12 text-sm font-medium"
              />
              <button 
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300"
              >
                {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <button className="btn-secondary px-5 py-2.5 rounded-lg text-xs font-bold text-white">
            Save Integration Keys
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card p-6 border-red-500/25 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-red-400 mb-1">Danger Zone</h3>
          <p className="text-xs text-slate-400">Irreversibly delete analysis records or user accounts.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Delete all statistics</h4>
            <p className="text-xs text-slate-500">Purge GitHub repositories history and Leetcode solved scores</p>
          </div>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-xs font-bold text-white rounded-lg flex items-center space-x-1.5 shadow-md">
            <Trash2 className="w-4 h-4" />
            <span>Purge Stats</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
