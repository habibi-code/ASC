
import React, { useState } from 'react';
import { StudyModule, User, StudyGroup } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardProps {
  user: User | null;
  modules: StudyModule[];
  groups: StudyGroup[];
  onSelectModule: (m: StudyModule) => void;
  onDeleteModule: (id: string) => void;
  onStartNew: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, modules, groups, onSelectModule, onDeleteModule, onStartNew }) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  const personalModules = modules.filter(m => !m.groupId && m.authorId === user?.id);
  const groupModules = modules.filter(m => !!m.groupId);

  const stats = [
    { label: 'Personal Vault', val: personalModules.length, icon: 'fa-box-archive', color: 'text-brand-400' },
    { label: 'Group Topics', val: groupModules.length, icon: 'fa-users', color: 'text-indigo-400' },
    { label: 'Avg Mastery', val: `${modules.length > 0 ? Math.round(modules.reduce((acc, m) => acc + m.progress, 0) / modules.length) : 0}%`, icon: 'fa-bullseye', color: 'text-emerald-400' },
    { label: 'Active Groups', val: groups.length, icon: 'fa-network-wired', color: 'text-orange-400' },
  ];

  const handleDeleteRequest = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConfirmDeleteId(id);
  };

  return (
    <div className="w-full px-4 py-6 md:p-10 max-w-7xl mx-auto space-y-10 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
            Hi, {user?.name || 'Scholar'}
          </h2>
          <p className="text-zinc-500 font-medium">Your centralized academic hub.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onStartNew}
            className="bg-brand-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-brand-600/20 hover:bg-brand-500 transition-all flex items-center justify-center gap-3"
          >
            <i className="fas fa-plus"></i>
            New Note
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-900 flex flex-col">
            <div className={`${stat.color} text-lg mb-4`}><i className={`fas ${stat.icon}`}></i></div>
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-white mt-1">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Personal Notes */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-white">My Private Vault</h3>
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{personalModules.length} Items</span>
          </div>
          <div className="space-y-4">
            {personalModules.length === 0 ? (
              <div className="p-10 border-2 border-dashed border-zinc-900 rounded-[2.5rem] text-center text-zinc-700 italic font-bold">No private notes yet.</div>
            ) : (
              personalModules.map(m => (
                <div key={m.id} onClick={() => onSelectModule(m)} className="group p-5 bg-zinc-900/40 rounded-3xl border border-zinc-900 hover:border-brand-500/40 cursor-pointer transition-all flex items-center gap-4 relative overflow-hidden">
                  <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center text-brand-500 shadow-inner shrink-0">
                    <i className={`fas ${m.sourceType === 'audio' ? 'fa-waveform' : 'fa-file-lines'}`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-zinc-200 truncate group-hover:text-brand-400">{m.title}</h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">{new Date(m.timestamp).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className="text-xs font-black text-brand-500">{m.progress}%</span>
                    {m.authorId === user?.id && (
                      <button 
                        onClick={(e) => handleDeleteRequest(e, m.id)}
                        className="w-8 h-8 rounded-lg bg-zinc-950/50 flex items-center justify-center text-zinc-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <i className="fas fa-trash-can text-xs"></i>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Group Collaborations */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-white flex items-center gap-3">
              <i className="fas fa-users-viewfinder text-indigo-500"></i>
              Group Collaborations
            </h3>
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{groupModules.length} Active</span>
          </div>
          <div className="space-y-4">
            {groupModules.length === 0 ? (
              <div className="p-10 border-2 border-dashed border-zinc-900 rounded-[2.5rem] text-center text-zinc-700 italic font-bold">Not collaborating on any group notes yet.</div>
            ) : (
              groupModules.map(m => {
                const groupName = groups.find(g => g.id === m.groupId)?.name || 'Study Group';
                return (
                  <div key={m.id} onClick={() => onSelectModule(m)} className="group p-5 bg-indigo-900/10 rounded-3xl border border-indigo-900/30 hover:border-indigo-500/50 cursor-pointer transition-all flex items-center gap-4 relative overflow-hidden">
                    <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center text-indigo-400 shadow-inner shrink-0">
                      <i className="fas fa-people-group"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-zinc-200 truncate group-hover:text-indigo-400">{m.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">{groupName}</span>
                        <span className="text-[9px] text-zinc-500 font-black uppercase tracking-tighter">{m.comments?.length || 0} Comments</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                       <div className="flex -space-x-2">
                          <div className="w-7 h-7 bg-zinc-800 rounded-full border-2 border-zinc-950 flex items-center justify-center text-[10px] font-black">A</div>
                          <div className="w-7 h-7 bg-zinc-900 rounded-full border-2 border-zinc-950 flex items-center justify-center text-[10px] font-black">B</div>
                       </div>
                       {m.authorId === user?.id && (
                        <button 
                          onClick={(e) => handleDeleteRequest(e, m.id)}
                          className="w-8 h-8 rounded-lg bg-zinc-950/50 flex items-center justify-center text-zinc-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <i className="fas fa-trash-can text-xs"></i>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmDeleteId(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-zinc-900 p-10 rounded-[3rem] border border-zinc-800 w-full max-w-md relative z-10 text-center">
               <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">
                 <i className="fas fa-triangle-exclamation"></i>
               </div>
               <h3 className="text-2xl font-black text-white mb-3">Destroy Material?</h3>
               <p className="text-zinc-500 mb-10 font-medium">This action is irreversible. All associated quiz progress and annotations will be purged.</p>
               <div className="flex gap-4">
                  <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-4 text-zinc-500 font-bold hover:text-white transition-colors">Abort</button>
                  <button 
                    onClick={() => { onDeleteModule(confirmDeleteId); setConfirmDeleteId(null); }} 
                    className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-red-600/20 hover:bg-red-500 transition-all"
                  >
                    Confirm Purge
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
