import React, { useState } from 'react';
import { StudyModule, FileData, User } from '../types';
import { generateStudyNotes, generateQuiz } from '../services/gemini';

interface FileUploadProps {
  user: User;
  onComplete: (module: StudyModule) => void;
  onCancel: () => void;
}

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'audio/mpeg',
  'audio/wav',
  'audio/mp3',
  'audio/m4a',
  'audio/ogg',
  'audio/webm'
];

const FileUpload: React.FC<FileUploadProps> = ({ user, onComplete, onCancel }) => {
  const [file, setFile] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [title, setTitle] = useState('');
  const [quizCount, setQuizCount] = useState(5);
  const [error, setError] = useState<string | null>(null);

  const validateAndSetFile = (f: File) => {
    setError(null);
    
    // Check if the file type is in our allowed list or if it's a simple .txt/PDF/Image
    const isAllowed = ALLOWED_MIME_TYPES.includes(f.type) || 
                      f.name.toLowerCase().endsWith('.txt') || 
                      f.name.toLowerCase().endsWith('.pdf') ||
                      f.name.toLowerCase().endsWith('.docx') ||
                      f.name.toLowerCase().endsWith('.doc');

    if (!isAllowed) {
      setError(`File type "${f.type || f.name.split('.').pop()}" is not supported. Please use PDF, Word, Text, or Images.`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      setFile({
        base64,
        mimeType: f.type || 'application/octet-stream',
        name: f.name
      });
      if (!title) setTitle(f.name.split('.')[0]);
    };
    reader.onerror = () => setError("Failed to read file. Please try again.");
    reader.readAsDataURL(f);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) validateAndSetFile(f);
  };

  const handleProcess = async () => {
    if (!file) return;
    setLoading(true);
    setStatus('Decoding materials with Gemini Multimodal...');

    try {
      const { notes, keyConcepts } = await generateStudyNotes(file);
      setStatus(`Synthesizing ${quizCount} adaptive quiz questions...`);
      const quizzes = await generateQuiz(notes, quizCount);

      const newModule: StudyModule = {
        id: Math.random().toString(36).substring(7),
        title: title || file.name,
        timestamp: Date.now(),
        notes,
        keyConcepts,
        quizzes,
        sourceType: file.mimeType.startsWith('audio') ? 'audio' : (file.mimeType.startsWith('image') ? 'image' : 'text'),
        progress: 0,
        authorId: user.id,
        authorName: user.name
      };

      onComplete(newModule);
    } catch (error) {
      console.error(error);
      setError('Failed to process file. The AI might be having trouble with this specific document format.');
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (mime: string) => {
    if (mime.includes('pdf')) return 'fa-file-pdf';
    if (mime.includes('word') || mime.includes('officedocument')) return 'fa-file-word';
    if (mime.includes('text')) return 'fa-file-lines';
    if (mime.startsWith('audio')) return 'fa-microphone-lines';
    if (mime.startsWith('image')) return 'fa-file-image';
    return 'fa-file';
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto w-full min-h-full flex items-center justify-center">
      <div className="bg-zinc-900 p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-zinc-800 shadow-2xl w-full">
        <div className="flex items-center gap-4 mb-8">
           <div className="w-12 h-12 md:w-14 md:h-14 bg-brand-500/10 text-brand-400 rounded-2xl flex items-center justify-center text-xl md:text-2xl">
              <i className="fas fa-wand-magic-sparkles"></i>
           </div>
           <div>
              <h2 className="text-xl md:text-2xl font-black text-white leading-none">Smart Upload</h2>
              <p className="text-zinc-500 text-sm mt-1">PDF, Word, Text, and Media supported.</p>
           </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-xs font-bold flex items-center gap-3">
              <i className="fas fa-circle-exclamation text-lg"></i>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Module Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Molecular Biology - Unit 4"
                className="w-full px-5 py-4 bg-zinc-800/50 border border-zinc-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 flex justify-between">
                <span>Quiz Questions</span>
                <span className="text-brand-400">{quizCount}</span>
              </label>
              <div className="px-2 py-4 flex items-center h-[56px] bg-zinc-800/30 rounded-2xl border border-zinc-700/50">
                <input 
                  type="range"
                  min="3"
                  max="15"
                  step="1"
                  value={quizCount}
                  onChange={(e) => setQuizCount(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>
            </div>
          </div>

          <div 
            className={`relative group border-2 border-dashed rounded-[2rem] p-8 md:p-12 flex flex-col items-center justify-center transition-all duration-300 ${file ? 'border-brand-500/50 bg-brand-500/5' : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/30'}`}
          >
            {file ? (
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-800 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg mx-auto mb-4 text-brand-400 text-2xl md:text-3xl">
                  <i className={`fas ${getFileIcon(file.mimeType)}`}></i>
                </div>
                <p className="font-bold text-white mb-1 truncate max-w-[200px]">{file.name}</p>
                <button 
                  onClick={() => setFile(null)}
                  className="mt-4 text-xs font-black text-red-400 uppercase tracking-widest hover:text-red-300"
                >
                  Change File
                </button>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500 group-hover:text-brand-400 mb-4 transition-all">
                  <i className="fas fa-cloud-arrow-up text-xl"></i>
                </div>
                <p className="text-zinc-400 text-center font-medium text-sm md:text-base">
                  Select PDF, Word, TXT, or Image
                </p>
                <p className="text-[9px] text-zinc-600 font-black uppercase mt-2">Max 20MB per file</p>
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,image/*,audio/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
              </>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={handleProcess}
              disabled={!file || loading}
              className={`w-full py-4 text-white font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 ${!file || loading ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-500 active:scale-95'}`}
            >
              {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-brain-circuit"></i>}
              {loading ? 'Processing...' : 'Start Learning'}
            </button>
            {/* Fixed the reference error by using the existing 'onCancel' prop instead of undefined 'onBack' */}
            <button 
              onClick={onCancel}
              className="w-full py-4 text-zinc-500 font-bold hover:text-zinc-300 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
          
          {loading && (
            <div className="flex flex-col items-center gap-2 py-2">
               <div className="flex gap-1">
                  <div className="w-1 h-1 bg-brand-500 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1 h-1 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
               </div>
               <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest text-center">{status}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;