
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';

interface AuthProps {
  onRegister: (user: any) => void;
  onLoginSuccess: (user: any) => void;
  registeredUsers: any[];
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ onRegister, onLoginSuccess, registeredUsers, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Simulate network delay
    setTimeout(() => {
      if (isLogin) {
        // LOGIN LOGIC
        const foundUser = registeredUsers.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
        
        if (!foundUser) {
          setError("No account found with this email. Please register first.");
          setLoading(false);
          return;
        }

        if (foundUser.password !== formData.password) {
          setError("Invalid password. Please try again.");
          setLoading(false);
          return;
        }

        onLoginSuccess(foundUser);
      } else {
        // REGISTRATION LOGIC
        const emailTaken = registeredUsers.some(u => u.email.toLowerCase() === formData.email.toLowerCase());
        
        if (emailTaken) {
          setError("This email is already registered. Please login instead.");
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters.");
          setLoading(false);
          return;
        }

        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          email: formData.email,
          password: formData.password,
          name: formData.name || formData.email.split('@')[0]
        };

        onRegister(newUser);
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/10 blur-[150px] -z-10 rounded-full"></div>

      <motion.button 
        onClick={onBack}
        className="absolute top-8 left-8 text-zinc-500 hover:text-white flex items-center gap-2 font-bold transition-all"
      >
        <i className="fas fa-arrow-left"></i>
        Landing
      </motion.button>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-6 shadow-2xl shadow-brand-600/30"
          >
            <i className="fas fa-brain"></i>
          </motion.div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-zinc-500 mt-2 font-medium">
            {isLogin ? 'Enter your credentials to continue.' : 'Join ASC and start mastering lectures.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-bold flex items-center gap-3"
              >
                <i className="fas fa-circle-exclamation text-lg"></i>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block ml-1">Full Name</label>
              <input 
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-brand-500 outline-none transition-all text-white font-medium"
                placeholder="John Doe"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block ml-1">Email Address</label>
            <input 
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-brand-500 outline-none transition-all text-white font-medium"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block ml-1">Password</label>
            <input 
              type="password"
              required
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-brand-500 outline-none transition-all text-white font-medium"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-500 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-brand-600/20 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-8 text-zinc-500 font-medium">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-brand-400 font-bold hover:text-brand-300 transition-colors"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
