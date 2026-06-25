import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Cpu, LayoutDashboard, User, Settings, LogOut, MessageSquare, Bell } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Assistant', path: '/assistant', icon: MessageSquare },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full h-[70px] bg-slate-950/75 backdrop-blur-md border-b border-white/5">
      <div className="w-full max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between">
      {/* Brand logo (Left) */}
      <Link to="/" className="flex items-center space-x-3 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-pink-300 font-sans">
          DevLens
        </span>
      </Link>

      {/* Navigation center (Desktop) */}
      {user && (
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Header Buttons/Avatar (Right) */}
      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          <>
            {/* Notification Icon */}
            <button className="relative p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/5 transition-all">
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500"></span>
              <Bell className="w-5 h-5" />
            </button>
            
            {/* User details & Logout */}
            <div className="flex items-center space-x-3 border-l border-white/10 pl-4">
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-200">{user.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">{user.targetRole}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center font-bold text-slate-950 uppercase ring-2 ring-white/10">
                {user.name.charAt(0)}
              </div>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all duration-300"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-3">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/signup" className="btn-primary px-5 py-2 text-sm font-medium text-white rounded-xl shadow-lg">
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Drawer Trigger */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="flex md:hidden p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/5 transition-all"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      </div>

      {/* Responsive Mobile Drawer overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-[70px] left-0 w-full bg-slate-950/95 border-b border-white/5 backdrop-blur-lg flex flex-col p-6 space-y-4 md:hidden shadow-2xl z-50">
          {user ? (
            <>
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                      isActive(link.path)
                        ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                );
              })}
              <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center font-bold text-slate-950 uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{user.name}</p>
                    <p className="text-[10px] text-slate-400">{user.targetRole}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-xs font-medium">Log out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col space-y-3 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-white/10 text-slate-300 font-medium hover:bg-white/5 transition-all"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl btn-primary text-white font-medium shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
