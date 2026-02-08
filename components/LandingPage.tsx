
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const previewData = [
    { day: 'Mon', score: 65 },
    { day: 'Tue', score: 82 },
    { day: 'Wed', score: 78 },
    { day: 'Thu', score: 95 },
    { day: 'Fri', score: 88 },
  ];

  const avatars = [
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100&h=100",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100&h=100",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100",
  ];

  const features = [
    { 
      icon: 'fa-file-lines', 
      title: 'AI Note Generator', 
      desc: 'Instantly transform lecture images or audio recordings into structured Markdown notes with full LaTeX support for complex math.',
      color: 'from-emerald-500 to-emerald-700'
    },
    { 
      icon: 'fa-vial-circle-check', 
      title: 'Quiz Generator', 
      desc: 'Auto-generate adaptive multiple-choice questions from your notes to test retention and identify knowledge gaps.',
      color: 'from-brand-500 to-brand-700'
    },
    { 
      icon: 'fa-wand-magic-sparkles', 
      title: 'AI Note Enhancer', 
      desc: 'Not happy with your notes? Use AI to simplify concepts, expand on details, or reorganize everything into clean bullet points.',
      color: 'from-teal-500 to-teal-700'
    },
    { 
      icon: 'fa-users-between-lines', 
      title: 'Collaborative Groups', 
      desc: 'Create study circles, share material vaults, and compete on leaderboards for a more engaging social learning experience.',
      color: 'from-emerald-600 to-teal-800'
    },
    { 
      icon: 'fa-robot', 
      title: 'Live Assistant', 
      desc: 'Chat with a 24/7 AI tutor that has full context of your specific lecture materials to answer any confusing questions.',
      color: 'from-emerald-400 to-brand-600'
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-brand-500/30 overflow-x-hidden scroll-smooth">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center text-white text-lg shadow-lg shadow-brand-600/30">
            <i className="fas fa-brain"></i>
          </div>
          <span className="text-2xl font-black tracking-tight">ASC</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={onGetStarted} className="hidden md:block text-sm font-bold text-zinc-400 hover:text-white transition-colors">How it Works</button>
          <button 
            onClick={onGetStarted}
            className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2.5 rounded-xl font-black transition-all text-sm shadow-lg shadow-brand-600/20 active:scale-95"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        {/* Background Student Banner Image */}
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full -z-20 opacity-20 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
            alt="Students studying" 
            className="w-full h-full object-cover mask-gradient-to-left"
          />
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="text-center lg:text-left flex-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600/10 border border-brand-500/20 rounded-full text-xs font-black uppercase tracking-[0.2em] text-brand-400 mb-8"
            >
              <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></span>
              The Ultimate AI Study Companion
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-white"
            >
              Master Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-teal-500">Lectures Faster.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400 text-xl md:text-2xl max-w-2xl mx-auto lg:mx-0 mb-12 font-medium leading-relaxed"
            >
              ASC is an AI-powered collaborative platform that transforms raw academic material into structured notes, adaptive quizzes, and interactive tutoring.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
            >
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-10 py-5 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-black text-xl shadow-2xl shadow-brand-600/30 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                Join for Free
                <i className="fas fa-arrow-right"></i>
              </button>
              
              <div className="flex items-center -space-x-3 ml-4">
                {avatars.map((url, i) => (
                  <img key={i} src={url} alt="Student" className="w-11 h-11 rounded-full border-2 border-zinc-950 object-cover shadow-lg" />
                ))}
                <div className="pl-6 text-zinc-500 text-xs font-black uppercase tracking-widest text-left leading-tight">
                  Trusted by <br /><span className="text-white">5,000+ Students</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 hidden lg:block"
          >
             <div className="relative">
                <div className="absolute -inset-4 bg-brand-600/20 blur-3xl rounded-full"></div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-4 shadow-3xl relative overflow-hidden">
                   <img 
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000" 
                    alt="Study Setup" 
                    className="w-full h-[450px] object-cover rounded-[2.5rem]"
                   />
                   <div className="absolute bottom-10 left-10 right-10 bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
                      <div className="flex items-center gap-4 mb-3">
                         <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
                            <i className="fas fa-sparkles text-white"></i>
                         </div>
                         <div>
                            <p className="text-sm font-black text-white leading-none">Smart Processing</p>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Analyzing Lecture Content...</p>
                         </div>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 2, repeat: Infinity }} className="h-full bg-brand-500"></motion.div>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Purpose Section */}
      <section className="py-32 px-6 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Designed for the <br /> <span className="text-brand-500">Modern Learner.</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed font-medium">
              We know the struggle of keeping up with fast-paced lectures. ASC acts as your second brain, capturing every detail and organizing it so you can focus on true comprehension instead of frantic note-taking.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-4xl font-black text-white mb-1">10x</p>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Faster Study Setup</p>
              </div>
              <div>
                <p className="text-4xl font-black text-white mb-1">94%</p>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Retention Rate</p>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full aspect-video rounded-[3rem] overflow-hidden border border-zinc-800 relative shadow-2xl">
             <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" 
              alt="Collaboration" 
              className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
             <div className="absolute bottom-8 left-8">
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-[10px] font-black uppercase tracking-widest">
                  Collaborative Learning
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
           <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.3em]">Core Ecosystem</p>
           <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Everything you need to <span className="text-zinc-600">Ace it.</span></h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, i) => (
            <motion.div 
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 bg-zinc-900/50 rounded-[3rem] border border-zinc-900 hover:border-brand-500/30 transition-all group flex flex-col"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feat.color} text-white rounded-[1.5rem] flex items-center justify-center text-2xl mb-8 shadow-xl shadow-brand-900/10 group-hover:scale-110 transition-transform`}>
                <i className={`fas ${feat.icon}`}></i>
              </div>
              <h3 className="text-2xl font-black mb-4 text-white">{feat.title}</h3>
              <p className="text-zinc-500 leading-relaxed font-medium mb-8 flex-1">{feat.desc}</p>
              <div className="flex items-center gap-2 text-brand-400 font-black text-[10px] uppercase tracking-widest cursor-pointer group-hover:text-brand-300 transition-colors">
                Learn more <i className="fas fa-arrow-right ml-1 group-hover:translate-x-1 transition-transform"></i>
              </div>
            </motion.div>
          ))}
          
          {/* CTA Card in Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-10 bg-brand-600 rounded-[3rem] text-white flex flex-col justify-center items-center text-center shadow-2xl shadow-brand-600/20"
          >
             <h3 className="text-3xl font-black mb-6 leading-tight">Ready to boost your grades?</h3>
             <button 
              onClick={onGetStarted}
              className="px-10 py-4 bg-white text-brand-600 rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all"
             >
               Try ASC Now
             </button>
          </motion.div>
        </div>
      </section>

      {/* Visual Analytics Proof */}
      <section className="py-32 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-none">
              Data Driven <br /> <span className="text-zinc-700">Progression.</span>
            </h2>
            <p className="text-zinc-500 text-xl leading-relaxed max-w-xl font-medium">
              We track your quiz scores and study duration to create a "Mastery Heatmap". Identify exactly which parts of the course need more attention.
            </p>
            <div className="space-y-6">
               {[
                 { icon: 'fa-chart-pie', label: 'Topic Breakdown', val: 'Identify high-impact concepts' },
                 { icon: 'fa-bolt', label: 'Focus Sprints', val: 'Maximize retention in short bursts' }
               ].map((item, idx) => (
                 <div key={idx} className="flex gap-6 items-center p-6 bg-zinc-900/50 rounded-3xl border border-zinc-800">
                   <div className="w-14 h-14 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center text-brand-400 text-xl">
                     <i className={`fas ${item.icon}`}></i>
                   </div>
                   <div>
                     <p className="font-black text-white text-lg leading-tight">{item.label}</p>
                     <p className="text-zinc-500 text-sm font-medium">{item.val}</p>
                   </div>
                 </div>
               ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-zinc-900 p-10 rounded-[4rem] border border-zinc-800 shadow-3xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-brand-600/5 group-hover:bg-brand-600/10 transition-colors"></div>
            <div className="relative space-y-8">
               <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Student Performance</p>
                    <h3 className="text-3xl font-black">92% Avg Mastery</h3>
                  </div>
                  <div className="text-emerald-400 font-black text-sm flex items-center gap-2">
                    <i className="fas fa-caret-up text-xl"></i>
                    +12% vs Manual Notes
                  </div>
               </div>
               <div className="h-64 w-full bg-zinc-950/50 rounded-3xl border border-zinc-800 p-6">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={previewData}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10, fontWeight: 'bold'}} />
                        <Tooltip 
                          cursor={{fill: '#27272a'}}
                          contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'}}
                          itemStyle={{ color: '#10b981' }}
                        />
                        <Bar dataKey="score" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-40 px-6">
         <div className="max-w-5xl mx-auto relative rounded-[4rem] overflow-hidden bg-brand-600 p-16 md:p-24 text-center shadow-3xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
               <img src="https://images.unsplash.com/photo-1543269664-56d93c1b41a6?auto=format&fit=crop&q=80&w=1200" alt="Students cheering" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 space-y-10">
               <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">Stop Stressing. <br /> Start Mastering.</h2>
               <p className="text-brand-100 text-xl font-medium max-w-2xl mx-auto">Join thousands of students who have reclaimed their time and improved their performance with ASC.</p>
               <button 
                onClick={onGetStarted}
                className="bg-white text-brand-600 px-12 py-5 rounded-2xl font-black text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
               >
                 Get Started Today
               </button>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-zinc-900 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
           <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white text-xs">
                  <i className="fas fa-brain"></i>
                </div>
                <span className="text-xl font-black tracking-tight">ASC</span>
              </div>
              <p className="text-zinc-500 font-medium max-w-xs leading-relaxed">The intelligent study companion that scales your knowledge, not your workload.</p>
           </div>
           <div>
              <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6">Platform</h4>
              <ul className="space-y-4 text-zinc-500 font-bold text-sm">
                 <li className="hover:text-brand-400 cursor-pointer transition-colors">Features</li>
                 <li className="hover:text-brand-400 cursor-pointer transition-colors">Collaboration</li>
                 <li className="hover:text-brand-400 cursor-pointer transition-colors">Privacy</li>
              </ul>
           </div>
           <div>
              <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6">Connect</h4>
              <ul className="space-y-4 text-zinc-500 font-bold text-sm">
                 <li className="hover:text-brand-400 cursor-pointer transition-colors">Project Hub</li>
                 <li className="hover:text-brand-400 cursor-pointer transition-colors">Contact Support</li>
                 <li className="hover:text-brand-400 cursor-pointer transition-colors">Community</li>
              </ul>
           </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">© 2024 AI Study Companion (ASC)</p>
          <div className="flex gap-8 text-zinc-500 text-sm">
             <i className="fab fa-twitter hover:text-white cursor-pointer"></i>
             <i className="fab fa-github hover:text-white cursor-pointer"></i>
             <i className="fab fa-discord hover:text-white cursor-pointer"></i>
          </div>
        </div>
      </footer>
      
      {/* Visual Helpers for background elements */}
      <style>{`
        .mask-gradient-to-left {
          mask-image: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
          -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
        }
      `}</style>
    </div>
  );
};

export default LandingPage;