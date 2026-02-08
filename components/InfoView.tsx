
import React from 'react';
import { motion } from 'framer-motion';

const InfoView: React.FC = () => {
  const roadmap = [
    { title: 'Mobile Support', desc: 'On-the-go studying with responsive native layouts.', status: 'completed' },
    { title: 'Collaborative Study', desc: 'Shared material vaults and group hub interactions.', status: 'completed' },
    { title: 'Native Audio Studio', desc: 'Real-time voice interactions with Gemini Live API.', status: 'completed' },
    { title: 'Real-time Transcription', desc: 'Live lecture processing as you record audio.', status: 'upcoming' },
    { title: 'Advanced Analytics', desc: 'Deep-dive mastery heatmaps and trend analysis.', status: 'concept' },
    { title: 'Accessibility Suite', desc: 'WCAG 2.1 compliant high-contrast & screen-reader modes.', status: 'concept' },
  ];

  const techStack = [
    { name: 'Gemini 3 Pro', cat: 'AI Core', icon: 'fa-brain-circuit', color: 'text-brand-400' },
    { name: 'Gemini Live API', cat: 'Real-time', icon: 'fa-microphone-lines', color: 'text-rose-400' },
    { name: 'React 19', cat: 'Frontend', icon: 'fa-react', color: 'text-blue-400' },
    { name: 'Tailwind CSS', cat: 'Styling', icon: 'fa-wind', color: 'text-sky-400' },
    { name: 'Framer Motion', cat: 'Animation', icon: 'fa-sparkles', color: 'text-pink-500' },
    { name: 'MathJax 3', cat: 'LaTeX', icon: 'fa-square-root-variable', color: 'text-orange-400' },
    { name: 'Recharts', cat: 'Analytics', icon: 'fa-chart-column', color: 'text-indigo-400' },
    { name: 'LocalStorage', cat: 'Database', icon: 'fa-database', color: 'text-amber-500' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full pb-32">
      <header className="mb-10 md:mb-16">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4"
        >
          <i className="fas fa-code-branch text-brand-500"></i>
          v2.4.0 Production Build
        </motion.div>
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">Project Hub</h2>
        <p className="text-zinc-500 mt-4 text-lg md:text-xl font-medium max-w-2xl">The architecture and future vision of the AI Study Companion ecosystem.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        <motion.section 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-7 space-y-6 md:space-y-8"
        >
          <div className="bg-zinc-900 p-8 md:p-10 rounded-[2.5rem] border border-zinc-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <i className="fas fa-rocket text-9xl"></i>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-500/10 text-brand-400 rounded-xl flex items-center justify-center text-base">
                <i className="fas fa-lightbulb"></i>
              </div>
              The ASC Vision
            </h3>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed font-medium">
              ASC was engineered to solve the "Passive Learning" problem. By converting static lecture materials into dynamic, interactive environments, we enable students to move from simple memorization to deep conceptual mastery through AI-driven synthesis and collaborative validation.
            </p>
          </div>

          <div className="bg-zinc-900 p-8 md:p-10 rounded-[2.5rem] border border-zinc-800 shadow-2xl">
            <h3 className="text-xl md:text-2xl font-black text-white mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-500/10 text-brand-400 rounded-xl flex items-center justify-center text-base">
                <i className="fas fa-layer-group"></i>
              </div>
              Technology Stack
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {techStack.map((tech, i) => (
                <div key={i} className="bg-zinc-950/50 p-5 rounded-[1.5rem] flex items-center gap-4 border border-zinc-800/50 hover:border-zinc-700 transition-all group">
                  <div className={`w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform ${tech.color}`}>
                    <i className={`fas ${tech.icon}`}></i>
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-white text-sm truncate">{tech.name}</p>
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{tech.cat}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-5 bg-zinc-900 p-8 md:p-10 rounded-[2.5rem] border border-zinc-800 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-500/10 text-brand-400 rounded-xl flex items-center justify-center text-base">
                <i className="fas fa-map"></i>
              </div>
              Development Roadmap
            </h3>
            <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
              Updated Today
            </div>
          </div>
          
          <div className="space-y-10 relative">
            <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-zinc-800"></div>
            {roadmap.map((item, i) => (
              <div key={i} className="relative pl-16">
                <div className={`absolute left-4 top-1 w-6 h-6 rounded-full border-4 flex items-center justify-center z-10 ${
                  item.status === 'completed' 
                    ? 'bg-emerald-500 border-zinc-900 text-white' 
                    : item.status === 'upcoming' 
                    ? 'bg-brand-500 border-zinc-900 text-white' 
                    : 'bg-zinc-800 border-zinc-900 text-zinc-600'
                }`}>
                  {item.status === 'completed' && <i className="fas fa-check text-[10px]"></i>}
                </div>
                <h4 className={`font-black text-base md:text-lg tracking-tight ${item.status === 'completed' ? 'text-white' : 'text-zinc-400'}`}>
                  {item.title}
                </h4>
                <p className="text-zinc-500 text-xs md:text-sm mt-1 leading-relaxed font-medium">{item.desc}</p>
                <div className="mt-3">
                  <span className={`inline-block text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
                    item.status === 'completed' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : item.status === 'upcoming' 
                      ? 'bg-brand-500/10 text-brand-400 border-brand-500/20' 
                      : 'bg-zinc-800/50 text-zinc-600 border-zinc-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      <footer className="mt-20 pt-10 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">ASC Project Documentation</p>
        <div className="flex gap-6">
           <i className="fab fa-github text-xl"></i>
           <i className="fab fa-discord text-xl"></i>
           <i className="fas fa-envelope text-xl"></i>
        </div>
      </footer>
    </div>
  );
};

export default InfoView;
