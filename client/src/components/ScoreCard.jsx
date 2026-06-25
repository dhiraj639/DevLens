import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const ScoreCard = ({ title, value, maxVal = 100, label, icon: Icon, colorClass = "from-indigo-500 to-purple-500", trend }) => {
  const percentage = Math.min(100, Math.round((value / maxVal) * 100));

  return (
    <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden group">
      {/* Top radial gradient light effect inside card */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent blur-md rounded-full pointer-events-none"></div>

      {/* Header row */}
      <div className="flex items-center justify-between z-10">
        <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${colorClass} flex items-center justify-center shadow-lg`}>
          {Icon && <Icon className="w-5 h-5 text-white" />}
        </div>
      </div>

      {/* Numerical display */}
      <div className="my-5 z-10">
        <div className="flex items-baseline space-x-1.5">
          <h2 className="text-4xl font-extrabold tracking-tight text-white font-mono">
            {value}
          </h2>
          {maxVal !== value && (
            <span className="text-sm font-medium text-slate-500">/{maxVal}</span>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-1">{label}</p>
      </div>

      {/* Footer progress bar or trend indicator */}
      <div className="mt-2 z-10">
        {trend ? (
          <div className="flex items-center space-x-1 text-emerald-400 text-xs font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{trend}</span>
          </div>
        ) : (
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-1000 ease-out`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreCard;
