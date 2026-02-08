
import React, { useState, useRef, useEffect } from 'react';
import { StudyModule, ChatMessage } from '../types';
import { chatWithAI } from '../services/gemini';
import { motion, AnimatePresence } from 'framer-motion';

interface AIChatProps {
  activeModule: StudyModule | null;
  availableModules?: StudyModule[];
  onClose: () => void;
  onSelectModule?: (m: StudyModule) => void;
}

const AIChat: React.FC<AIChatProps> = ({ activeModule, availableModules = [], onClose, onSelectModule }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModuleSelector, setShowModuleSelector] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeModule) {
      setMessages([
        { role: 'model', text: `Support online for **${activeModule.title}**. How can I help you master this material?` }
      ]);
    } else if (availableModules.length > 0) {
      setMessages([
        { role: 'model', text: "Hello! I'm your ASC Support Bot. Which topic would you like to discuss? Select one below or ask a general study question." }
      ]);
      setShowModuleSelector(true);
    } else {
      setMessages([
        { role: 'model', text: "Support online. You haven't uploaded any materials yet. Upload a lecture to start chatting!" }
      ]);
    }
  }, [activeModule?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
    if ((window as any).MathJax && (window as any).MathJax.typesetPromise) {
      (window as any).MathJax.typesetPromise();
    }
  }, [messages, loading]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = textToSend;
    if (!customMessage) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const contextNotes = activeModule?.notes || "No specific lecture selected yet. User is browsing the dashboard.";
      const aiResponse = await chatWithAI(history, userMsg, contextNotes);
      setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to my knowledge base. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    if (!activeModule) {
      setMessages(prev => [...prev, { role: 'model', text: "Please select a topic from the library first so I can assist you better." }]);
      setShowModuleSelector(true);
      return;
    }

    let prompt = "";
    switch (action) {
      case 'summarize': prompt = "Can you provide a concise summary of these notes?"; break;
      case 'key_points': prompt = "What are the most critical key points I need to remember from this lecture?"; break;
      case 'explain': prompt = "Can you explain the most complex concept in these notes in simple terms?"; break;
      case 'quiz': prompt = "Ask me a challenging question based on these notes to test my understanding."; break;
    }
    handleSend(prompt);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 md:inset-auto md:bottom-24 md:right-6 md:w-[480px] md:h-[720px] bg-zinc-950 md:rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] flex flex-col border border-zinc-800/50 z-[70] overflow-hidden"
    >
      <header className="p-6 bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-800/50 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-teal-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-brand-500/20">
              <i className="fas fa-robot-astromech"></i>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-zinc-900 rounded-full"></div>
          </div>
          <div>
            <h3 className="font-black tracking-tight leading-none text-white">AI Assistant</h3>
            <button 
              onClick={() => setShowModuleSelector(!showModuleSelector)}
              className="flex items-center gap-1.5 mt-1 text-zinc-500 hover:text-zinc-300 transition-colors group"
            >
              <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[180px]">
                {activeModule ? activeModule.title : 'General Discussion'}
              </span>
              <i className={`fas fa-chevron-down text-[8px] transition-transform ${showModuleSelector ? 'rotate-180' : ''}`}></i>
            </button>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all active:scale-90"
          aria-label="Close Chat"
        >
          <i className="fas fa-times"></i>
        </button>
      </header>

      <div className="flex-1 relative flex flex-col overflow-hidden">
        <AnimatePresence>
          {showModuleSelector && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute inset-x-0 top-0 bg-zinc-900 border-b border-zinc-800 p-4 z-20 shadow-2xl overflow-y-auto max-h-[40%]"
            >
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 px-2">Knowledge Base Context</p>
              <div className="space-y-1">
                {availableModules.map(m => (
                  <button 
                    key={m.id}
                    onClick={() => { onSelectModule?.(m); setShowModuleSelector(false); }}
                    className={`w-full text-left px-4 py-3 rounded-2xl flex items-center gap-3 transition-all ${activeModule?.id === m.id ? 'bg-brand-600 text-white' : 'hover:bg-zinc-800 text-zinc-400'}`}
                  >
                    <i className={`fas ${m.sourceType === 'audio' ? 'fa-waveform' : 'fa-file-lines'} opacity-60`}></i>
                    <span className="text-sm font-bold truncate flex-1">{m.title}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
          {messages.map((m, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex items-end gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs shadow-md ${
                m.role === 'user' ? 'bg-zinc-800 text-zinc-400' : 'bg-brand-600 text-white'
              }`}>
                <i className={`fas ${m.role === 'user' ? 'fa-user' : 'fa-robot'}`}></i>
              </div>
              <div className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                m.role === 'user' 
                  ? 'bg-zinc-800 text-zinc-100 rounded-br-none' 
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-bl-none'
              }`}>
                {m.text}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs animate-pulse">
                <i className="fas fa-robot"></i>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl rounded-bl-none flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-4 bg-zinc-900/30">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
           {[
             { id: 'summarize', icon: 'fa-align-left', label: 'Summarize' },
             { id: 'key_points', icon: 'fa-key', label: 'Key Points' },
             { id: 'explain', icon: 'fa-wand-sparkles', label: 'Explain' },
             { id: 'quiz', icon: 'fa-vial', label: 'Quick Quiz' }
           ].map(action => (
             <button 
               key={action.id}
               onClick={() => handleQuickAction(action.id)}
               className="whitespace-nowrap bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-zinc-800 transition-all flex items-center gap-2"
             >
               <i className={`fas ${action.icon} text-brand-500`}></i>
               {action.label}
             </button>
           ))}
        </div>
      </div>

      <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-md">
        <div className="relative flex items-center gap-3">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question..."
            className="flex-1 bg-zinc-800/80 border border-zinc-700/50 rounded-[1.5rem] px-6 py-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all font-medium"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${!input.trim() || loading ? 'bg-zinc-800 text-zinc-600' : 'bg-brand-600 text-white shadow-lg shadow-brand-500/20 active:scale-95'}`}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AIChat;
