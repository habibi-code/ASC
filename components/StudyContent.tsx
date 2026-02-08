
import React, { useEffect, useState } from 'react';
import { StudyModule, User, StudyGroup } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { enhanceNoteContent } from '../services/gemini';

interface StudyContentProps {
  module: StudyModule;
  user: User;
  groups: StudyGroup[];
  onUpdateNotes: (id: string, text: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onDeleteNote: (id: string) => void;
  onGoToQuiz: () => void;
  onBack: () => void;
  onToggleShare: (id: string) => void;
  onShareToGroup: (id: string, groupId: string) => void;
  onAddComment: (id: string, text: string) => void;
}

const StudyContent: React.FC<StudyContentProps> = ({ 
  module, user, groups, onUpdateNotes, onUpdateTitle, onDeleteNote, onGoToQuiz, onBack, onToggleShare, onShareToGroup, onAddComment 
}) => {
  const [commentInput, setCommentInput] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(module.title);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // AI Enhancement State
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showAIOptions, setShowAIOptions] = useState(false);
  const [enhancedPreview, setEnhancedPreview] = useState<string | null>(null);
  const [enhancementMode, setEnhancementMode] = useState('');

  const isOwner = module.authorId === user.id;

  useEffect(() => {
    if ((window as any).MathJax && (window as any).MathJax.typesetPromise) {
      (window as any).MathJax.typesetPromise();
    }
  }, [module.notes, enhancedPreview]);

  useEffect(() => {
    setTempTitle(module.title);
  }, [module.title]);

  const handleTitleSubmit = () => {
    if (tempTitle.trim() && tempTitle !== module.title) {
      onUpdateTitle(module.id, tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleAIEnhance = async (mode: string) => {
    setIsEnhancing(true);
    setShowAIOptions(false);
    setEnhancementMode(mode);
    try {
      const result = await enhanceNoteContent(module.notes, mode);
      setEnhancedPreview(result);
    } catch (error) {
      console.error(error);
      alert("Failed to generate AI enhancement.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const applyEnhancement = () => {
    if (enhancedPreview) {
      onUpdateNotes(module.id, enhancedPreview);
      setEnhancedPreview(null);
      setIsEditingNotes(false);
    }
  };

  const submitComment = () => {
    if (!commentInput.trim()) return;
    onAddComment(module.id, commentInput);
    setCommentInput('');
  };

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-3xl md:text-4xl font-black text-white mb-8 mt-10 tracking-tight">{line.substring(2)}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl md:text-2xl font-bold text-zinc-100 mb-4 mt-8 flex items-center gap-3"><div className="w-1 h-6 bg-brand-500 rounded-full shrink-0"></div>{line.substring(3)}</h2>;
      if (line.startsWith('* ') || line.startsWith('- ')) return (
        <li key={i} className="ml-5 mb-3 text-zinc-400 flex gap-3 items-start text-base md:text-lg font-medium">
          <i className="fas fa-circle text-[6px] mt-2.5 text-brand-500/60 shrink-0"></i>
          <span>{line.substring(2)}</span>
        </li>
      );
      if (line.trim() === '') return <div key={i} className="h-4" />;
      return <p key={i} className="mb-4 text-zinc-400 leading-relaxed text-base md:text-lg font-medium">{line}</p>;
    });
  };

  const aiModes = [
    { id: 'Clarify', label: 'Polish & Structure', icon: 'fa-wand-magic-sparkles' },
    { id: 'Summarize', label: 'Concise Summary', icon: 'fa-compress' },
    { id: 'Simplify', label: 'Explain Like I\'m 5', icon: 'fa-baby' },
    { id: 'Expand', label: 'Deep Academic Dive', icon: 'fa-microscope' },
    { id: 'Bullets', label: 'Convert to List', icon: 'fa-list-ul' }
  ];

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto w-full pb-32">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4 min-w-0 flex-1">
           <button onClick={onBack} className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white transition-all shrink-0">
             <i className="fas fa-arrow-left"></i>
           </button>
           
           <div className="min-w-0">
              {isEditingTitle && isOwner ? (
                <input 
                  autoFocus
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                  className="bg-transparent text-xl font-black text-white border-b border-brand-500 outline-none w-full"
                />
              ) : (
                <div className="flex items-center gap-2 group">
                  <h2 
                    onClick={() => isOwner && setIsEditingTitle(true)}
                    className={`text-xl font-black text-white truncate max-w-[300px] ${isOwner ? 'cursor-pointer hover:text-brand-400' : ''}`}
                  >
                    {module.title}
                  </h2>
                  {isOwner && <i className="fas fa-pen text-[10px] text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity"></i>}
                </div>
              )}
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-0.5">
                {module.groupId ? 'Collaborative Note' : 'Private Vault'} • {isOwner ? 'Owner' : `Shared by ${module.authorName}`}
              </p>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isOwner && (
            <div className="relative">
              <button 
                onClick={() => setShowAIOptions(!showAIOptions)}
                className="bg-brand-600/10 text-brand-400 border border-brand-500/30 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-brand-600 hover:text-white transition-all flex items-center gap-2"
              >
                <i className={`fas fa-sparkles ${isEnhancing ? 'animate-spin' : ''}`}></i>
                AI Enhance
              </button>
              
              <AnimatePresence>
                {showAIOptions && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-64 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-2 z-[100] overflow-hidden"
                  >
                    {aiModes.map(mode => (
                      <button 
                        key={mode.id}
                        onClick={() => handleAIEnhance(mode.id)}
                        className="w-full text-left px-5 py-3 rounded-2xl flex items-center gap-3 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all group"
                      >
                        <i className={`fas ${mode.icon} text-brand-500 group-hover:scale-110 transition-transform`}></i>
                        <span className="text-xs font-bold">{mode.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {isOwner && (
            <button 
              onClick={() => setShowDeleteConfirm(true)} 
              className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 hover:text-red-500 transition-all"
              title="Delete Note"
            >
              <i className="fas fa-trash-can text-sm"></i>
            </button>
          )}

          {module.groupId ? (
            <div className="bg-indigo-500/10 border border-indigo-500/30 px-4 py-2 rounded-xl flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-widest shrink-0">
               <i className="fas fa-users"></i> Syncing
            </div>
          ) : (
            isOwner && (
              <button onClick={() => setShowShareModal(true)} className="bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-2xl text-xs font-black text-zinc-500 hover:text-white transition-all flex items-center gap-2 shrink-0">
                <i className="fas fa-share-nodes"></i> Share
              </button>
            )
          )}
          
          <button onClick={onGoToQuiz} className="bg-brand-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-brand-600/20 hover:bg-brand-500 transition-all flex items-center gap-2 shrink-0">
            <i className="fas fa-bolt"></i> Sprint
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-zinc-900/50 rounded-[3rem] border border-zinc-900 shadow-xl min-h-[600px] relative">
             <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
                {isOwner && (
                  <button 
                    onClick={() => setIsEditingNotes(!isEditingNotes)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isEditingNotes ? 'bg-brand-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                  >
                    {isEditingNotes ? 'Finish Editing' : 'Manual Edit'}
                  </button>
                )}
                <div className="flex -space-x-2">
                   <div className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-emerald-500 text-[10px] font-black flex items-center justify-center">You</div>
                </div>
             </div>

             <div className="p-10 md:p-16">
                {isEditingNotes && isOwner ? (
                  <textarea 
                    value={module.notes}
                    onChange={(e) => onUpdateNotes(module.id, e.target.value)}
                    className="w-full min-h-[500px] bg-transparent text-zinc-300 font-mono text-lg leading-relaxed focus:outline-none resize-none border-l-2 border-zinc-800 pl-6"
                    placeholder="Enter study notes in Markdown..."
                    autoFocus
                  />
                ) : (
                  <div onDoubleClick={() => isOwner && setIsEditingNotes(true)} className="prose prose-invert max-w-none cursor-text">
                    {renderMarkdown(module.notes)}
                  </div>
                )}
             </div>

             {/* AI Enhancement Loading Overlay */}
             <AnimatePresence>
                {isEnhancing && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md z-30 flex flex-col items-center justify-center rounded-[3rem]"
                  >
                    <div className="w-20 h-20 bg-brand-600/10 text-brand-400 rounded-3xl flex items-center justify-center text-3xl mb-6 relative">
                       <i className="fas fa-sparkles animate-pulse"></i>
                       <div className="absolute inset-0 border-2 border-brand-500/50 rounded-3xl animate-ping opacity-30"></div>
                    </div>
                    <h3 className="text-xl font-black text-white mb-2">Refining with Gemini...</h3>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Optimizing for mode: {enhancementMode}</p>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-8">
           <div className="p-8 bg-zinc-900/50 rounded-[2.5rem] border border-zinc-900 h-[500px] flex flex-col shadow-xl">
              <h3 className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-6 flex justify-between">
                <span>Discussion Thread</span>
                <span>{module.comments?.length || 0}</span>
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-6 mb-6 hide-scrollbar">
                 {(module.comments || []).length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                     <i className="fas fa-comments text-3xl mb-3"></i>
                     <p className="text-xs font-bold uppercase tracking-widest">No annotations yet</p>
                   </div>
                 ) : (
                   module.comments?.map(c => (
                     <div key={c.id} className="group flex gap-3">
                        <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-[10px] font-black text-zinc-500 shrink-0">
                           {c.userName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-black text-zinc-300">{c.userName}</span>
                              <span className="text-[9px] text-zinc-700 font-bold">{new Date(c.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                           </div>
                           <p className="text-sm text-zinc-500 font-medium leading-relaxed">{c.text}</p>
                        </div>
                     </div>
                   ))
                 )}
              </div>

              <div className="relative">
                 <input 
                   type="text" 
                   value={commentInput}
                   onChange={(e) => setCommentInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                   placeholder="Add a suggestion..."
                   className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-brand-500/50 outline-none pr-12 transition-all shadow-lg"
                 />
                 <button onClick={submitComment} className="absolute right-3 top-3 w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center hover:bg-brand-500 transition-all">
                   <i className="fas fa-paper-plane-top text-xs"></i>
                 </button>
              </div>
           </div>

           <div className="p-8 bg-zinc-900 rounded-[2.5rem] border border-zinc-800 shadow-xl">
              <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Note Insights</h4>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500 font-medium">Topic Authority</span>
                    <span className="text-sm text-brand-400 font-bold">{isOwner ? 'You (Creator)' : module.authorName}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500 font-medium">Mastery Level</span>
                    <span className="text-sm text-zinc-300 font-bold">{module.progress}%</span>
                 </div>
              </div>
           </div>
        </aside>
      </div>

      {/* AI Preview Modal */}
      <AnimatePresence>
        {enhancedPreview && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEnhancedPreview(null)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              className="bg-zinc-900 border border-zinc-800 rounded-[3.5rem] w-full max-w-5xl max-h-[90vh] flex flex-col relative z-10 shadow-3xl overflow-hidden"
            >
               <header className="p-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-brand-600/10 text-brand-400 rounded-2xl flex items-center justify-center text-xl">
                        <i className="fas fa-sparkles"></i>
                     </div>
                     <div>
                        <h3 className="text-2xl font-black text-white leading-tight">AI Improvement Preview</h3>
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Applying refinement: {enhancementMode}</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <button onClick={() => setEnhancedPreview(null)} className="px-6 py-3 text-zinc-500 font-black uppercase tracking-widest text-xs hover:text-white transition-colors">Discard</button>
                     <button onClick={applyEnhancement} className="bg-brand-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-brand-600/20 hover:bg-brand-500 transition-all">Apply Changes</button>
                  </div>
               </header>
               <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                  <div className="prose prose-invert max-w-none">
                     {renderMarkdown(enhancedPreview)}
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowShareModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-zinc-900 p-8 rounded-[3rem] border border-zinc-800 w-full max-w-md relative z-10">
               <h3 className="text-2xl font-black text-white mb-6">Select Study Group</h3>
               <div className="space-y-3 mb-8">
                  {groups.length === 0 ? (
                    <p className="text-center py-6 text-zinc-500 italic text-sm">Join a group from the Collaborative Hub first.</p>
                  ) : (
                    groups.map(g => (
                      <button key={g.id} onClick={() => { onShareToGroup(module.id, g.id); setShowShareModal(false); }} className="w-full p-4 bg-zinc-800 hover:bg-brand-600 rounded-2xl flex items-center gap-4 transition-all group text-left">
                         <i className="fas fa-users-rectangle text-zinc-500 group-hover:text-white"></i>
                         <span className="font-bold text-zinc-300 group-hover:text-white">{g.name}</span>
                      </button>
                    ))
                  )}
               </div>
               <button onClick={() => setShowShareModal(false)} className="w-full py-4 text-zinc-500 font-bold hover:text-white transition-colors">Cancel</button>
            </motion.div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-zinc-900 p-10 rounded-[3rem] border border-zinc-800 w-full max-w-md relative z-10 text-center">
               <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">
                 <i className="fas fa-trash-can"></i>
               </div>
               <h3 className="text-2xl font-black text-white mb-3">Permanent Deletion?</h3>
               <p className="text-zinc-500 mb-10 font-medium">This note will be permanently removed from your vault and any group hubs it was shared with.</p>
               <div className="flex gap-4">
                  <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-4 text-zinc-500 font-bold hover:text-white transition-colors">Abort</button>
                  <button 
                    onClick={() => { onDeleteNote(module.id); setShowDeleteConfirm(false); }} 
                    className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-red-600/20 hover:bg-red-500 transition-all"
                  >
                    Confirm Delete
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudyContent;
