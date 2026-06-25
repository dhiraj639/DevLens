import React, { useState, useEffect } from 'react';
import { 
  FileText, UploadCloud, AlertCircle, Loader2, 
  CheckCircle2, AlertTriangle, ShieldCheck 
} from 'lucide-react';
import * as resumeService from '../services/resumeService';
import useAuth from '../hooks/useAuth';

const ResumeAnalysis = () => {
  const { user } = useAuth();
  const targetRole = user?.targetRole || 'MERN Developer';

  const [stats, setStats] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const data = await resumeService.getResumeStats();
      if (data && data.atsScore > 0) {
        setStats(data);
      }
    } catch (err) {
      console.warn("No prior resume analysis found.");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await resumeService.uploadResumeFile(file);
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading file. Limit size is 10MB.');
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
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
          <FileText className="w-5 h-5 text-cyan-400" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">ATS Resume Optimizer</h1>
      </div>

      {/* Upload area */}
      <div className="glass-card p-6">
        <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500 font-mono block mb-4">
          Upload CV/Resume
        </span>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-white/10 hover:border-indigo-500/20 rounded-2xl p-8 text-center bg-slate-950/20 transition-all flex flex-col items-center justify-center cursor-pointer relative">
            <input
              type="file"
              accept=".pdf,.txt,.docx"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="w-12 h-12 text-slate-500 mb-4" />
            <h4 className="text-sm font-bold text-white mb-1">
              {file ? file.name : "Drag & Drop resume here"}
            </h4>
            <p className="text-[10px] text-slate-400 font-medium">
              Supports PDF, DOCX or TXT files up to 10MB
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="text-[10px] text-slate-500 font-medium">
              Calibrated to evaluate similarity matching against: <strong>{targetRole}</strong>
            </span>
            <button
              type="submit"
              disabled={loading || !file}
              className="btn-primary w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white shadow-lg flex items-center justify-center space-x-2 disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  <span>Parsing content...</span>
                </>
              ) : (
                <span>Upload & Calculate Score</span>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Analysis dashboard panels */}
      {stats && stats.atsScore > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ATS score circle (Left) */}
          <div className="glass-card p-6 flex flex-col justify-between items-center text-center lg:col-span-1">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono block mb-6">
                ATS Compatibility Index
              </span>

              <div className="inline-flex items-center justify-center relative w-40 h-40 rounded-full border-4 border-white/5 bg-slate-950/40 my-4">
                <div className={`absolute inset-0 rounded-full border-4 ${
                  stats.atsScore > 80 ? 'border-emerald-500/30' : 'border-amber-500/30'
                }`}></div>
                <div className="text-center">
                  <h2 className={`text-5xl font-extrabold font-mono ${
                    stats.atsScore > 80 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {stats.atsScore}
                  </h2>
                  <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1">Score</p>
                </div>
              </div>
            </div>

            <div className="w-full border-t border-white/5 pt-4 text-xs text-slate-400 font-medium">
              {stats.atsScore > 80 ? (
                <div className="flex items-center justify-center space-x-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Excellent ATS keyword match!</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-1.5 text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Moderate. Add missing keywords.</span>
                </div>
              )}
            </div>
          </div>

          {/* Suggestions and Keywords gaps (Right columns) */}
          <div className="glass-card p-6 lg:col-span-2 space-y-6">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono block mb-3">
                Extracted Skills Profile
              </span>
              <div className="flex flex-wrap gap-2">
                {stats.extractedSkills && stats.extractedSkills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono block mb-3">
                Missing Keywords Gap
              </span>
              <div className="flex flex-wrap gap-2">
                {stats.missingKeywords && stats.missingKeywords.length > 0 ? (
                  stats.missingKeywords.map((kw) => (
                    <span key={kw} className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-semibold text-red-400">
                      {kw}
                    </span>
                  ))
                ) : (
                  <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>No missing keywords identified!</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono block mb-3">
                Strategic ATS Suggestions
              </span>
              <ul className="space-y-2.5">
                {stats.suggestions && stats.suggestions.map((sug, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300 font-medium leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></div>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 text-center text-slate-500 space-y-4">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-400">No analyzed resume data</h3>
          <p className="text-xs max-w-sm mx-auto leading-relaxed">
            Upload your technical resume or CV profile file using the field above to calculate cosine similarity alignment.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalysis;
