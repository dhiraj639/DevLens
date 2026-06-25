import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Cpu, User, Settings, LogOut, 
  MessageSquare, Terminal, FileText 
} from 'lucide-react';
import Github from './GithubIcon';
import useAuth from '../hooks/useAuth';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Reset scroll position to top of window on route changes (standard window scroll restoration)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const sidebarLinks = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'GitHub Analysis', path: '/github', icon: Github },
    { name: 'LeetCode Analysis', path: '/leetcode', icon: Terminal },
    { name: 'Resume ATS', path: '/resume', icon: FileText },
    { name: 'AI Assistant', path: '/assistant', icon: MessageSquare },
    { name: 'Profile Settings', path: '/profile', icon: User },
    { name: 'App Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative">
      {/* Background ambient glowing shapes */}
      <div className="glowing-blob blob-indigo w-[600px] h-[600px] top-[-200px] left-[-200px]"></div>
      <div className="glowing-blob blob-purple w-[600px] h-[600px] bottom-[-200px] right-[-200px]"></div>
      <div className="glowing-blob blob-blue w-[400px] h-[400px] top-[40%] right-[10%]"></div>

      {/* Grid background layer */}
      <div className="absolute inset-0 grid-overlay opacity-40 pointer-events-none z-0"></div>

      <Navbar />

      <div className="flex-1 flex relative z-10 w-full max-w-[1600px] mx-auto">
        {/* Sidebar Left (Desktop only - Sticky so it remains fixed while main content scrolls) */}
        {user && (
          <aside className="hidden lg:flex w-64 flex-col border-r border-white/5 bg-slate-900/25 backdrop-blur-md p-6 space-y-6 shrink-0 sticky top-[70px] h-[calc(100vh-70px)] overflow-y-auto">
            <div className="text-xs uppercase font-extrabold tracking-widest text-slate-500 font-mono">
              Intelligence Core
            </div>
            
            <nav className="flex-1 flex flex-col space-y-1.5">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive(link.path)
                        ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={logout}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all duration-300 border border-transparent hover:border-red-500/15"
            >
              <LogOut className="w-4.5 h-4.5" />
              <span>Log out</span>
            </button>
          </aside>
        )}

        {/* Dynamic Content Panel (Scrolls with the browser window) */}
        <main className="flex-1 flex flex-col px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
