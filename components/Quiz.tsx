
import React, { useState, useEffect } from 'react';
import { StudyModule, QuizQuestion } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizProps {
  module: StudyModule;
  onComplete: (score: number) => void;
  onBack: () => void;
}

const Quiz: React.FC<QuizProps> = ({ module, onComplete, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentQuestion = module.quizzes[currentIndex];

  useEffect(() => {
    if ((window as any).MathJax && (window as any).MathJax.typesetPromise) {
      (window as any).MathJax.typesetPromise();
    }
  }, [currentIndex, isAnswered]);

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < module.quizzes.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setFeedback(null);
    } else {
      setIsFinished(true);
    }
  };

  const progress = ((currentIndex + 1) / module.quizzes.length) * 100;

  if (isFinished) {
    const finalPercent = Math.round((score / module.quizzes.length) * 100);
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto w-full h-full flex items-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-zinc-900 p-8 md:p-12 rounded-3xl md:rounded-[3rem] border border-zinc-800 text-center w-full shadow-2xl"
        >
          <div className="w-16 h-16 md:w-24 md:h-24 bg-brand-500/10 text-brand-400 rounded-full flex items-center justify-center text-3xl md:text-4xl mx-auto mb-6 md:mb-8">
            <i className="fas fa-flag-checkered"></i>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">Challenge Met!</h2>
          <p className="text-zinc-500 mb-8 md:mb-10 text-sm md:text-base">Your knowledge base has been updated.</p>
          
          <div className="text-6xl md:text-8xl font-black text-brand-500 mb-2 md:mb-4 tracking-tighter">{finalPercent}%</div>
          <p className="text-zinc-400 font-bold mb-10 md:mb-12 uppercase tracking-widest text-xs">Score: {score} / {module.quizzes.length}</p>

          <button 
            onClick={() => onComplete(finalPercent)}
            className="w-full bg-brand-600 text-white py-4 md:py-5 rounded-2xl md:rounded-[2rem] font-black shadow-xl hover:bg-brand-500 transition-all"
          >
            Update Study Progress
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full h-full flex flex-col justify-center">
      <div className="mb-8 flex items-center justify-between">
        <button onClick={onBack} className="text-zinc-500 hover:text-white font-bold flex items-center gap-2">
          <i className="fas fa-times-circle"></i>
          Quit
        </button>
        <div className="bg-zinc-900 px-4 py-1.5 rounded-full border border-zinc-800 text-zinc-400 font-bold text-[10px] md:text-xs uppercase tracking-widest">
          {currentIndex + 1} / {module.quizzes.length}
        </div>
      </div>

      <div className="w-full bg-zinc-900 h-1.5 md:h-2 rounded-full mb-10 md:mb-16 relative overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="bg-brand-500 h-full rounded-full transition-all duration-700"
        />
      </div>

      <div className="bg-zinc-900 p-6 md:p-12 rounded-3xl md:rounded-[3rem] border border-zinc-800 shadow-xl">
        <h3 className="text-xl md:text-3xl font-black text-white mb-8 md:mb-12 leading-tight tracking-tight">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3 md:space-y-4">
          {currentQuestion.options.map((option, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-4 md:p-6 rounded-xl md:rounded-2xl border-2 transition-all flex items-center gap-3 md:gap-5 ${
                isAnswered
                  ? idx === currentQuestion.correctAnswer
                    ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-100'
                    : idx === selectedOption
                    ? 'border-red-500/50 bg-red-500/5 text-red-100'
                    : 'border-zinc-800 text-zinc-600'
                  : selectedOption === idx
                  ? 'border-brand-500 bg-brand-500/10 text-brand-100'
                  : 'border-zinc-800 hover:border-zinc-700 text-zinc-400'
              }`}
            >
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 border-2 font-black text-sm md:text-base ${
                isAnswered && idx === currentQuestion.correctAnswer
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'border-zinc-700'
              }`}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="font-bold text-sm md:text-lg leading-snug">{option}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {isAnswered && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-8 overflow-hidden"
            >
              <div className="p-6 md:p-8 bg-zinc-800/50 rounded-2xl md:rounded-3xl border border-zinc-700/50">
                <h4 className="font-black text-zinc-300 flex items-center gap-2 text-[10px] uppercase tracking-widest mb-3">
                  <i className="fas fa-lightbulb text-brand-400"></i>
                  Insight
                </h4>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 md:mt-12">
          {!isAnswered ? (
            <button 
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`w-full py-4 md:py-5 rounded-2xl md:rounded-[2rem] font-black shadow-lg transition-all ${selectedOption === null ? 'bg-zinc-800 text-zinc-700' : 'bg-brand-600 text-white hover:bg-brand-500'}`}
            >
              Check Answer
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="w-full bg-brand-600 text-white py-4 md:py-5 rounded-2xl md:rounded-[2rem] font-black shadow-xl hover:bg-brand-500 transition-all flex items-center justify-center gap-3"
            >
              {currentIndex < module.quizzes.length - 1 ? 'Next' : 'Results'}
              <i className="fas fa-arrow-right"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
