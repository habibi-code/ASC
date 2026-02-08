
import React, { useState } from 'react';
import { StudyGroup, User } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface CollaborativeSpaceProps {
  user: User;
  groups: StudyGroup[];
  onJoinGroup: (id: string) => void;
  onJoinByCode: (code: string) => boolean;
  onCreateGroup: (name: string, description: string, isPublic: boolean) => void;
  onOpenGroup: (g: StudyGroup) => void;
}

const CollaborativeSpace: React.FC<CollaborativeSpaceProps> = ({ 
  user, groups, onJoinGroup, onJoinByCode, onCreateGroup, onOpenGroup 
}) => {
  const [activeTab, setActiveTab] = useState<'my_groups' | 'discover'>('my_groups');
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [newGroup, setNewGroup] = useState({ name: '', description: '', isPublic: true });
  const [error, setError] = useState('');

  const myGroups = groups.filter(g => g.members.some(m => m.id === user.id));
  const publicGroups = groups.filter(g => g.isPublic && !g.members.some(m => m.id === user.id));

  const handleJoinByCode = () => {
    setError('');
    const success = onJoinByCode(joinCode.toUpperCase());
    if (success) {
      setIsJoining(false);
      setJoinCode('');
    } else {
      setError('Invalid invite code. Please try again.');
    }
  };

  const handleCreate = () => {
    if (!newGroup.name.trim()) return;
    onCreateGroup(newGroup.name, newGroup.description, newGroup.isPublic);
    setIsCreating(false);
    setNewGroup({ name: '', description: '', isPublic: true });
  };

  return (
    <div className="w-full px-4 py-6 md:p-10 max-w-7xl mx-auto space-y-8 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter">Collaborative Hub</h2>
          <p className="text-zinc-500 font-medium">Find your tribe and master your courses together.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsJoining(true)}
            className="bg-zinc-900 text-zinc-400 border border-zinc-800 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-white hover:bg-zinc-800 transition-all"
          >
            Join with Code
          </button>
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-brand-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-brand-600/20 hover:bg-brand-500 transition-all flex items-center gap-3"
          >
            <i className="fas fa-plus"></i>
            Create Group
          </button>
        </div>
      </header>

      <div className="flex gap-4 border-b border-zinc-900">
        <button
          onClick={() => setActiveTab('my_groups')}
          className={`px-6 py-4 font-black uppercase tracking-widest text-xs transition-all border-b-2 ${activeTab === 'my_groups' ? 'border-brand-500 text-white' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}
        >
          My Study Groups
        </button>
        <button
          onClick={() => setActiveTab('discover')}
          className={`px-6 py-4 font-black uppercase tracking-widest text-xs transition-all border-b-2 ${activeTab === 'discover' ? 'border-brand-500 text-white' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}
        >
          Discover Public Groups
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {activeTab === 'my_groups' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myGroups.length === 0 ? (
                <div className="col-span-full py-24 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
                   <i className="fas fa-user-group text-zinc-800 text-4xl mb-4"></i>
                   <p className="text-zinc-600 font-bold italic">You haven't joined any groups yet.</p>
                   <button onClick={() => setActiveTab('discover')} className="text-brand-500 font-black text-xs uppercase tracking-widest mt-4 hover:underline">Browse Public Groups</button>
                </div>
              ) : (
                myGroups.map(g => (
                  <motion.div 
                    key={g.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => onOpenGroup(g)}
                    className="p-8 bg-zinc-900/50 rounded-[2.5rem] border border-zinc-900 flex flex-col hover:border-brand-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-brand-500/10 text-brand-400 rounded-2xl flex items-center justify-center text-xl">
                        <i className={`fas ${g.isPublic ? 'fa-globe-americas' : 'fa-lock'}`}></i>
                      </div>
                      <div className="flex -space-x-3">
                        {g.members.slice(0, 4).map((m, i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-400">
                             {m.name.charAt(0)}
                          </div>
                        ))}
                        {g.members.length > 4 && (
                          <div className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-zinc-900 flex items-center justify-center text-[8px] font-black text-zinc-600">
                            +{g.members.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                    <h4 className="text-xl font-black text-white mb-2 group-hover:text-brand-400 transition-colors">{g.name}</h4>
                    <p className="text-zinc-500 text-sm font-medium line-clamp-2 mb-6 flex-1">{g.description}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{g.members.length} Members</span>
                      <span className="text-xs font-black text-brand-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                        Enter Hub <i className="fas fa-arrow-right ml-1"></i>
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === 'discover' && (
            <div className="grid grid-cols-1 gap-4">
              {publicGroups.length === 0 ? (
                <div className="py-24 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
                   <p className="text-zinc-600 font-bold italic">No new public groups found. Create one yourself!</p>
                </div>
              ) : (
                publicGroups.map(g => (
                  <div key={g.id} className="p-6 bg-zinc-900/40 rounded-3xl border border-zinc-900 flex items-center gap-6 hover:bg-zinc-900 transition-all">
                    <div className="w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center text-brand-500 shrink-0">
                      <i className="fas fa-users-viewfinder"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white truncate">{g.name}</h4>
                      <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest line-clamp-1">{g.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase mb-2">{g.members.length} Members</p>
                      <button 
                        onClick={() => onJoinGroup(g.id)}
                        className="bg-brand-600/10 text-brand-400 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-brand-500/20 hover:bg-brand-600 hover:text-white transition-all"
                      >
                        Join Group
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <aside className="space-y-8">
           <div className="p-8 bg-zinc-900/50 rounded-[2.5rem] border border-zinc-900">
              <h3 className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-8">Scholastic Standings</h3>
              <div className="space-y-8">
                 {[
                   { name: 'Alpha Study', pts: '14.2k', rank: 1, color: 'text-amber-400' },
                   { name: 'Bio Warriors', pts: '12.8k', rank: 2, color: 'text-zinc-400' },
                   { name: 'The Archivists', pts: '9.4k', rank: 3, color: 'text-orange-400' }
                 ].map((g, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <span className={`w-5 font-black ${g.color}`}>#{g.rank}</span>
                         <span className="font-bold text-zinc-300">{g.name}</span>
                      </div>
                      <span className="text-xs font-black text-zinc-500">{g.pts} XP</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-8 bg-gradient-to-br from-indigo-600 to-brand-700 rounded-[2.5rem] text-white shadow-xl">
              <i className="fas fa-award text-3xl mb-4 text-brand-200"></i>
              <h4 className="text-xl font-black mb-2 tracking-tight">Collaboration Bonus</h4>
              <p className="text-brand-100 text-sm font-medium mb-8">Group members earn +20% XP for every shared note they study from.</p>
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                 <div className="h-full bg-white w-2/3"></div>
              </div>
           </div>
        </aside>
      </div>

      {/* Join Code Modal */}
      <AnimatePresence>
        {isJoining && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsJoining(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-zinc-900 p-10 rounded-[3rem] border border-zinc-800 w-full max-w-md relative z-10 text-center">
              <h3 className="text-3xl font-black text-white mb-2">Join Private Circle</h3>
              <p className="text-zinc-500 mb-10 font-medium">Enter the 6-digit invite code provided by a group member.</p>
              <input 
                type="text" 
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="XXXXXX"
                className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-3xl py-6 text-4xl font-black text-white tracking-[0.4em] text-center focus:outline-none focus:border-brand-500 mb-4 uppercase"
              />
              {error && <p className="text-red-500 text-xs font-bold mb-6">{error}</p>}
              <div className="flex gap-4">
                <button onClick={() => setIsJoining(false)} className="flex-1 py-4 text-zinc-500 font-bold">Cancel</button>
                <button onClick={handleJoinByCode} className="flex-1 bg-brand-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-brand-600/20">Sync Group</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Group Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreating(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-zinc-900 p-10 rounded-[3rem] border border-zinc-800 w-full max-w-xl relative z-10">
              <h3 className="text-3xl font-black text-white mb-8">Establish Hub</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">Group Name</label>
                  <input 
                    type="text" 
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                    placeholder="e.g. Advanced Thermodynamics"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">Description</label>
                  <textarea 
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                    placeholder="Briefly explain what this group studies..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white font-medium outline-none focus:border-brand-500 min-h-[120px]"
                  />
                </div>
                <div className="flex items-center justify-between p-6 bg-zinc-950 rounded-2xl border border-zinc-800">
                   <div>
                     <p className="font-bold text-zinc-200">Public Discovery</p>
                     <p className="text-xs text-zinc-500">Allow others to find and join this group without a code.</p>
                   </div>
                   <button 
                     onClick={() => setNewGroup({...newGroup, isPublic: !newGroup.isPublic})}
                     className={`w-14 h-8 rounded-full p-1 transition-all flex ${newGroup.isPublic ? 'bg-brand-600 justify-end' : 'bg-zinc-800 justify-start'}`}
                   >
                     <div className="w-6 h-6 bg-white rounded-full shadow-md"></div>
                   </button>
                </div>
              </div>
              <div className="flex gap-4 mt-10">
                <button onClick={() => setIsCreating(false)} className="flex-1 py-4 text-zinc-500 font-bold">Cancel</button>
                <button onClick={handleCreate} className="flex-1 bg-brand-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-brand-600/20">Launch Hub</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollaborativeSpace;
