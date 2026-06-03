import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Layers } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="glass sticky top-0 z-40 w-full border-b border-slate-800 px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/20 glow-border">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-sans text-xl font-bold tracking-tight text-white bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-200">
              Crew<span className="text-indigo-400">Flow</span>
            </span>
            <span className="block text-[10px] text-slate-400 tracking-wider uppercase font-semibold">Team Task Manager</span>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-900/60 px-4 py-2 border border-slate-800">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-slate-300 overflow-hidden">
              <img 
                src="/logo.png" 
                alt="User Logo" 
                className="h-5 w-auto object-contain invert mix-blend-screen opacity-95"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-slate-300">{user.email}</p>
            </div>

            {/* Role Badge */}
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide border ${
              user.role === 'Admin' 
                ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' 
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            }`}>
              {user.role}
            </span>
          </div>

          {/* Logout Trigger */}
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900/80 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 border border-slate-800 px-4 py-2 text-sm text-slate-400 transition-all duration-200"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline font-medium">Sign Out</span>
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
