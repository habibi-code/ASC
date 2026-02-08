import React from 'react';
import { View, StudyModule } from '../types';
import { motion } from 'framer-motion';

interface SidebarProps {
  currentView: View;
  setView: (v: View) => void;
  modules: StudyModule[];
  activeModule: StudyModule | null;
  onSelectModule: (m: StudyModule) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, modules, activeModule, onSelectModule, onLogout, isOpen, onClose }) => {
  const navItems = [
    { view: View.DASHBOARD, label: 'Dashboard', icon: 'fa-th-large' },
    { view: View.COLLABORATION, label: 'Study Groups', icon: 'fa-users-viewfinder' },
    { view: View.UPLOAD, label: 'New Lecture', icon: 'fa-plus-circle' },
    { view: View.LIVE, label: 'Live Assistant', icon: 'fa-microphone-lines', pulse: true },
    { view: View.INFO, label: 'Project Hub', icon: 'fa-circle-info' },
  ];

  return (
    <aside className={`
      fixed md:relative inset-y-0 left-0 w-72 bg-zinc-950 border-r border-zinc-900 flex flex-col h-full shrink-0 z-50 transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-600/20"
          >
            <i className="fas fa-brain"></i>
          </motion.div>
          <h1 className="text-2xl font-black text-white tracking-tight">ASC</h1>
        </div>
        
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          aria-label="Close Sidebar"
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 text-zinc-500 hover:text-white transition-colors"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-1 py-2 hide-scrollbar">
        {navItems.map((item) => (
          <button 
            key={item.view}
            onClick={() => setView(item.view)}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 group relative ${currentView === item.view ? 'bg-zinc-900 text-brand-400 border border-zinc-800 shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'}`}
          >
            <i className={`fas ${item.icon} w-5 text-center transition-transform group-hover:scale-110`}></i>
            <span className="font-semibold">{item.label}</span>
            {item.pulse && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.6)]"></span>
            )}
          </button>
        ))}

        <div className="mt-10 pt-8 border-t border-zinc-900">
          <h2 className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">Library</h2>
          <div className="space-y-1">
            {modules.length === 0 ? (
              <p className="px-4 text-xs text-zinc-700 italic font-medium">No materials yet</p>
            ) : (
              modules.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => onSelectModule(m)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center gap-3 ${activeModule?.id === m.id && currentView === View.STUDY ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${m.progress > 80 ? 'bg-emerald-500' : 'bg-brand-500'} opacity-60`}></div>
                  <span className="truncate flex-1">{m.title}</span>
                  <span className="text-[10px] text-zinc-700 font-bold">{m.progress}%</span>
                </button>
              ))
            )}
          </div>
        </div>
      </nav>

      <div className="p-6 space-y-4 border-t border-zinc-900">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all font-bold group"
        >
          <i className="fas fa-sign-out-alt w-5 group-hover:-translate-x-1 transition-transform"></i>
          Logout
        </button>

        <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">XP Progression</p>
          <p className="text-lg font-black text-white leading-none">Level 12</p>
          <div className="w-full bg-zinc-800/50 h-1.5 rounded-full mt-3 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '42%' }}
              className="bg-brand-600 h-full rounded-full"
            ></motion.div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
