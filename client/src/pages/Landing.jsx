import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Terminal, FileText, Cpu, 
  MessageSquare, Star, ArrowUpRight, CheckCircle2 
} from 'lucide-react';
import Github from '../components/GithubIcon';

const Landing = () => {
  const stats = [
    { title: "Average Developer Score", value: "82/100", label: "Across all accounts" },
    { title: "ATS Improvement", value: "+45%", label: "Average resume optimization" },
    { title: "Placement Accuracy", value: "94.2%", label: "Random Forest predictions" },
    { title: "Roadmaps Generated", value: "14.8K+", label: "Tailored career timelines" },
  ];

  const features = [
    {
      title: "GitHub Analyzer",
      desc: "Scrape code repositories, evaluate commit trends, languages composition and calculate developer score.",
      icon: Github,
      color: "from-indigo-500 to-blue-600"
    },
    {
      title: "LeetCode Evaluator",
      desc: "Analyze problem solving difficulty distribution (Easy, Medium, Hard) and contest ratings.",
      icon: Terminal,
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Resume ATS Matcher",
      desc: "Extract tech skills, score layout compatibility using TF-IDF and identify missing keywords.",
      icon: FileText,
      color: "from-cyan-500 to-blue-500"
    },
    {
      title: "Placement Predictor",
      desc: "Random Forest & XGBoost pipelines run predictions to match you against optimal career pathways.",
      icon: Cpu,
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "AI Career Assistant",
      desc: "Generate customized skill roadmaps, gap analysis audits, and chat in real-time.",
      icon: MessageSquare,
      color: "from-pink-500 to-rose-600"
    }
  ];

  const testimonials = [
    {
      name: "Aarav Sharma",
      role: "Backend Engineer at Stripe",
      stars: 5,
      review: "DevLens helped me identify crucial gaps in my backend portfolio. The AI roadmap gave me a precise checklist, and I secured my Stripe offer within 2 months!"
    },
    {
      name: "Sneha Patel",
      role: "MERN Stack Developer at Vercel",
      stars: 5,
      review: "The ATS resume keyword matcher is incredible. My application response rate shot up from 10% to almost 60% after incorporating the suggestions."
    },
    {
      name: "David Kim",
      role: "ML Engineer at Scale AI",
      stars: 5,
      review: "As a self-taught engineer, the DSA profile evaluator and placement readiness predictions gave me the confidence to apply to top-tier startups."
    }
  ];

  return (
    <div className="w-full relative z-10">
      {/* Hero Section */}
      <section className="text-center py-20 lg:py-28 relative">
        {/* Glow effect on hero background */}
        <div className="absolute top-[20%] left-[50%] -translate-x-[50%] w-[350px] lg:w-[650px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-300 uppercase tracking-widest inline-flex items-center space-x-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          <span>Next-Gen Developer Intelligence</span>
        </span>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight md:leading-none">
          AI-Powered Developer <br />
          <span className="gradient-text">Intelligence Platform</span>
        </h1>

        <p className="mt-6 text-base md:text-xl text-slate-400 max-w-2xl mx-auto font-medium">
          Benchmark GitHub repositories, analyze LeetCode profiles, optimize resume ATS compatibility, and let ML pipelines predict placement readiness.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/signup" className="btn-primary px-8 py-4 text-base font-bold text-white rounded-xl shadow-2xl flex items-center space-x-2">
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/login" className="btn-secondary px-8 py-4 text-base font-bold text-white rounded-xl">
            View Live Demo
          </Link>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 border-y border-white/5 bg-slate-900/10 backdrop-blur-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card p-6 flex flex-col justify-center items-center text-center">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500 font-mono mb-2">{stat.title}</span>
              <h3 className="text-4xl font-extrabold text-white tracking-tight font-mono mb-1">{stat.value}</h3>
              <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Comprehensive Analysis <span className="gradient-text-cyan">Suite</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto text-sm md:text-base font-medium">
            Multi-dimensional audits connecting your online presence to target placements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className="glass-card p-8 flex flex-col justify-between group relative overflow-hidden">
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">{feat.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">{feat.desc}</p>
                </div>
                <div className="mt-8 flex items-center text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                  <span>Explore analysis</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Loved by <span className="gradient-text">Developers</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto text-sm">
            Read success stories from developers who secured roles using DevLens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, i) => (
            <div key={i} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex space-x-1 mb-4 text-amber-400">
                  {[...Array(test.stars)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic">"{test.review}"</p>
              </div>
              <div className="mt-6 border-t border-white/5 pt-4">
                <p className="text-sm font-bold text-white">{test.name}</p>
                <p className="text-xs text-indigo-400 font-mono mt-0.5">{test.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center relative rounded-3xl overflow-hidden glass-panel border border-white/5 my-12">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/10 via-purple-900/10 to-blue-900/10 blur-xl pointer-events-none"></div>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
          Ready to Claim Your Target Role?
        </h2>
        <p className="text-slate-400 max-w-md mx-auto text-sm md:text-base font-medium mb-8">
          Sync your developer profiles and run placing audits today.
        </p>
        <Link to="/signup" className="btn-primary px-8 py-4 text-base font-bold text-white rounded-xl shadow-2xl inline-flex items-center space-x-2">
          <span>Start Free Integration</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 mt-12 flex flex-col md:flex-row items-center justify-between text-slate-500 text-xs gap-4">
        <div>
          <span>© {new Date().getFullYear()} DevLens Platform. All rights reserved.</span>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Developer API</a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
