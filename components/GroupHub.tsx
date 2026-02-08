
import React, { useState } from 'react';
import { StudyGroup, StudyModule, QuizChallenge, User } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface GroupHubProps {
  user: User;
  group: StudyGroup;
  modules: StudyModule[];
  challenges: QuizChallenge[];
  myModules: StudyModule[];
  onBack: () => void;
  onSelectModule: (m: StudyModule) => void;
  onShareModule: (id: string) => void;
}

const GroupHub: React.FC<GroupHubProps> = ({ 
  user, group, modules, challenges, myModules, onBack, onSelectModule, onShareModule 
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'sprints' | 'members' | 'feed'>('notes');
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <div className="w-full px-4 py-6 md:p-10 max-w-7xl mx-auto space-y-10 pb-32">
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-white transition-all"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-3xl font-black text-white tracking-tighter">{group.name}</h2>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${group.isPublic ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-brand-500/10 text-brand-400 border border-brand-500/20'}`}>
                {group.isPublic ? 'Public' : 'Private'}
              </span>
            </div>
            <p className="text-zinc-500 font-medium">{group.description}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="bg-zinc-900 border border-zinc-800 px-6 py-4 rounded-2xl text-center min-w-[120px]">
             <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Invite Code</p>
             <p className="text-xl font-black text-brand-400 tracking-widest">{group.inviteCode}</p>
          </div>
          <button 
            onClick={() => setShowShareModal(true)}
            className="bg-brand-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-brand-600/20 hover:bg-brand-500 transition-all flex items-center gap-3"
          >
            <i className="fas fa-share-from-square"></i>
            Share Note
          </button>
        </div>
      </header>

      <div className="flex gap-4 border-b border-zinc-900 overflow-x-auto hide-scrollbar">
        {(['notes', 'sprints', 'members', 'feed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 font-black uppercase tracking-widest text-xs transition-all border-b-2 shrink-0 ${activeTab === tab ? 'border-brand-500 text-white' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}
          >
            {tab === 'sprints' ? 'Study Sprints' : tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
           <AnimatePresence mode="wait">
             {activeTab === 'notes' && (
               <motion.div 
                 key="notes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                 className="grid grid-cols-1 md:grid-cols-2 gap-6"
               >
                 {modules.length === 0 ? (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-900 rounded-[3rem] bg-zinc-950/40">
                       <i className="fas fa-file-circle-plus text-zinc-800 text-4xl mb-4"></i>
                       <p className="text-zinc-600 font-bold italic">No notes shared in this hub yet.</p>
                    </div>
                 ) : (
                   modules.map(m => (
                    <div 
                      key={m.id} 
                      onClick={() => onSelectModule(m)}
                      className="p-6 bg-zinc-900/40 rounded-[2rem] border border-zinc-900 hover:border-brand-500/40 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center text-brand-500">
                          <i className={`fas ${m.sourceType === 'audio' ? 'fa-waveform' : 'fa-file-lines'}`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white truncate group-hover:text-brand-400">{m.title}</h4>
                          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Added by {m.authorName}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-6 pt-6 border-t border-zinc-800/50">
                        <div className="flex items-center gap-3 text-zinc-500">
                           <i className="fas fa-comment-dots text-xs"></i>
                           <span className="text-[10px] font-black uppercase tracking-widest">{m.comments?.length || 0} Discussions</span>
                        </div>
                        <span className="text-xs font-black text-brand-500">{m.progress}% Mastered</span>
                      </div>
                    </div>
                   ))
                 )}
               </motion.div>
             )}

             {activeTab === 'sprints' && (
               <motion.div 
                 key="sprints" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                 className="space-y-4"
               >
                 {challenges.length === 0 ? (
                   <div className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
                      <p className="text-zinc-600 font-bold italic">No active group sprints. Start one from any shared note!</p>
                   </div>
                 ) : (
                   challenges.map(c => (
                     <div key={c.id} className="p-8 bg-zinc-900 rounded-[2.5rem] border border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 bg-brand-500/10 text-brand-400 rounded-2xl flex items-center justify-center text-3xl">
                             <i className="fas fa-bolt"></i>
                           </div>
                           <div>
                             <h4 className="text-xl font-black text-white">{c.moduleTitle}</h4>
                             <p className="text-zinc-500 font-medium">{c.participants.length} members engaged</p>
                           </div>
                        </div>
                        <button className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-brand-600/20">Launch Sprint</button>
                     </div>
                   ))
                 )}
               </motion.div>
             )}

             {activeTab === 'members' && (
                <motion.div 
                  key="members" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {group.members.map(m => (
                    <div key={m.id} className="p-5 bg-zinc-900/50 rounded-2xl border border-zinc-900 flex items-center gap-4">
                       <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-lg font-black text-zinc-500">
                         {m.name.charAt(0)}
                       </div>
                       <div>
                         <p className="font-bold text-white">{m.name} {m.id === group.creatorId && <i className="fas fa-crown text-[10px] text-amber-500 ml-1"></i>}</p>
                         <p className="text-xs text-zinc-500 font-medium truncate max-w-[150px]">{m.email}</p>
                       </div>
                    </div>
                  ))}
                </motion.div>
             )}

             {activeTab === 'feed' && (
                <motion.div 
                  key="feed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {(group.activities || []).slice().reverse().map(act => (
                    <div key={act.id} className="flex gap-4 items-start">
                       <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-brand-500 shrink-0 mt-1">
                          <i className={`fas ${act.type === 'note_added' ? 'fa-file-export' : act.type === 'member_joined' ? 'fa-user-plus' : 'fa-trophy'}`}></i>
                       </div>
                       <div className="flex-1">
                          <p className="text-sm font-medium text-zinc-300">
                             <span className="font-black text-white">{act.userName}</span> 
                             {act.type === 'note_added' ? ` shared a new note: ${act.contentTitle}` : 
                              act.type === 'member_joined' ? ' joined the hub' : ' completed a sprint'}
                          </p>
                          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-1">
                             {new Date(act.timestamp).toLocaleDateString()} at {new Date(act.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                       </div>
                    </div>
                  ))}
                </motion.div>
             )}
           </AnimatePresence>
        </div>

        <aside className="lg:col-span-4 space-y-8">
           <div className="p-8 bg-zinc-900/50 rounded-[2.5rem] border border-zinc-900">
              <h3 className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-8">Hub Leaderboard</h3>
              <div className="space-y-6">
                 {group.members.slice(0, 5).sort((a,b) => Math.random() - 0.5).map((m, i) => (
                   <div key={m.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <span className="text-xs font-black text-zinc-700">#{i+1}</span>
                         <span className="font-bold text-zinc-300">{m.name}</span>
                      </div>
                      <span className="text-[10px] font-black text-brand-500">{(1200 - i * 150).toLocaleString()} XP</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-8 bg-zinc-900 rounded-[2.5rem] border border-zinc-800">
              <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Hub Metadata</h4>
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-zinc-500">Total Materials</span>
                    <span className="text-zinc-200">{modules.length} Notes</span>
                 </div>
                 <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-zinc-500">Active Sprints</span>
                    <span className="text-zinc-200">{challenges.length} Live</span>
                 </div>
              </div>
           </div>
        </aside>
      </div>

      {/* Share Note Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowShareModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-zinc-900 p-10 rounded-[3rem] border border-zinc-800 w-full max-w-2xl relative z-10">
               <h3 className="text-3xl font-black text-white mb-8">Share Knowledge</h3>
               <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {myModules.length === 0 ? (
                    <p className="text-zinc-500 italic text-center py-10">You don't have any private notes to share yet.</p>
                  ) : (
                    myModules.map(m => (
                      <button 
                        key={m.id} 
                        onClick={() => { onShareModule(m.id); setShowShareModal(false); }}
                        className="w-full p-6 bg-zinc-950 hover:bg-brand-600 rounded-[2rem] flex items-center gap-6 transition-all group text-left border border-zinc-800 hover:border-brand-500"
                      >
                         <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-brand-400 group-hover:text-white">
                            <i className={`fas ${m.sourceType === 'audio' ? 'fa-waveform' : 'fa-file-lines'}`}></i>
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="font-bold text-zinc-300 group-hover:text-white truncate">{m.title}</p>
                           <p className="text-[10px] text-zinc-600 group-hover:text-brand-200 font-black uppercase tracking-widest">{new Date(m.timestamp).toLocaleDateString()}</p>
                         </div>
                      </button>
                    ))
                  )}
               </div>
               <div className="mt-10 pt-6 border-t border-zinc-800">
                 <button onClick={() => setShowShareModal(false)} className="w-full py-4 text-zinc-500 font-bold hover:text-white transition-colors">Close</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroupHub;
