import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const SkillRadarChart = ({ data }) => {
  // Fallback default mock data if not provided
  const chartData = data || [
    { subject: 'Frontend', A: 80, fullMark: 100 },
    { subject: 'Backend', A: 75, fullMark: 100 },
    { subject: 'DSA', A: 60, fullMark: 100 },
    { subject: 'DevOps', A: 45, fullMark: 100 },
    { subject: 'AI Tech', A: 55, fullMark: 100 },
    { subject: 'Comm.', A: 85, fullMark: 100 },
  ];

  return (
    <div className="w-full h-80 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="60%" margin={{ top: 10, right: 30, bottom: 10, left: 30 }} data={chartData}>
          <PolarGrid stroke="rgba(255, 255, 255, 0.05)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: '#475569', fontSize: 9 }}
            axisLine={false}
          />
          <Radar
            name="Developer Skills"
            dataKey="A"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.25}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillRadarChart;
