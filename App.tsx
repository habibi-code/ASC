import React, { useState, useEffect, useMemo } from 'react';
import { View, StudyModule, User, StudyGroup, QuizChallenge } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FileUpload from './components/FileUpload';
import StudyContent from './components/StudyContent';
import Quiz from './components/Quiz';
import AIChat from './components/AIChat';
import InfoView from './components/InfoView';
import LiveAssistant from './components/LiveAssistant';
import CollaborativeSpace from './components/CollaborativeSpace';
import GroupHub from './components/GroupHub';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  
  // Simulated Backend "Database"
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]); 
  const [allModules, setAllModules] = useState<StudyModule[]>([]);
  const [allGroups, setAllGroups] = useState<StudyGroup[]>([]);
  const [allChallenges, setAllChallenges] = useState<QuizChallenge[]>([]);
  
  const [activeModule, setActiveModule] = useState<StudyModule | null>(null);
  const [activeGroup, setActiveGroup] = useState<StudyGroup | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const savedUsers = localStorage.getItem('asc_registered_users');
    const savedCurrentUser = localStorage.getItem('asc_user');
    const savedModules = localStorage.getItem('asc_modules');
    const savedGroups = localStorage.getItem('asc_groups');
    const savedChallenges = localStorage.getItem('asc_challenges');
    
    if (savedUsers) setRegisteredUsers(JSON.parse(savedUsers));
    
    if (savedCurrentUser) {
      setUser(JSON.parse(savedCurrentUser));
      setCurrentView(View.DASHBOARD);
    }
    
    if (savedModules) setAllModules(JSON.parse(savedModules));
    if (savedGroups) setAllGroups(JSON.parse(savedGroups));
    if (savedChallenges) setAllChallenges(JSON.parse(savedChallenges));
    
    setInitialized(true);
  }, []);

  const syncModules = (updated: StudyModule[]) => {
    setAllModules(updated);
    localStorage.setItem('asc_modules', JSON.stringify(updated));
  };

  const syncGroups = (updated: StudyGroup[]) => {
    setAllGroups(updated);
    localStorage.setItem('asc_groups', JSON.stringify(updated));
    if (activeGroup) {
      const current = updated.find(g => g.id === activeGroup.id);
      if (current) setActiveGroup(current);
    }
  };

  const syncChallenges = (updated: QuizChallenge[]) => {
    setAllChallenges(updated);
    localStorage.setItem('asc_challenges', JSON.stringify(updated));
  };

  const handleRegister = (newUser: any) => {
    const updated = [...registeredUsers, newUser];
    setRegisteredUsers(updated);
    localStorage.setItem('asc_registered_users', JSON.stringify(updated));
    const userSession: User = { id: newUser.id, email: newUser.email, name: newUser.name };
    setUser(userSession);
    localStorage.setItem('asc_user', JSON.stringify(userSession));
    setCurrentView(View.DASHBOARD);
  };

  const handleLoginSuccess = (foundUser: any) => {
    const userSession: User = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
    setUser(userSession);
    localStorage.setItem('asc_user', JSON.stringify(userSession));
    setCurrentView(View.DASHBOARD);
  };

  const handleLogout = () => {
    localStorage.removeItem('asc_user');
    setUser(null);
    setCurrentView(View.LANDING);
    setIsChatOpen(false);
    setActiveModule(null);
    setActiveGroup(null);
  };

  const handleAddModule = (module: StudyModule) => {
    if (!user) return;
    const newModule = { ...module, authorId: user.id, authorName: user.name };
    const updated = [newModule, ...allModules];
    syncModules(updated);
    setActiveModule(newModule);
    setCurrentView(View.STUDY);
    setIsSidebarOpen(false);
  };

  const handleUpdateNotes = (moduleId: string, newContent: string) => {
    if (!user) return;
    const target = allModules.find(m => m.id === moduleId);
    if (!target || target.authorId !== user.id) return;

    const updated = allModules.map(m => m.id === moduleId ? { ...m, notes: newContent } : m);
    syncModules(updated);
    if (activeModule?.id === moduleId) setActiveModule({ ...activeModule, notes: newContent });
  };

  const handleUpdateModuleTitle = (moduleId: string, newTitle: string) => {
    if (!user) return;
    const target = allModules.find(m => m.id === moduleId);
    if (!target || target.authorId !== user.id) return;

    const updated = allModules.map(m => m.id === moduleId ? { ...m, title: newTitle } : m);
    syncModules(updated);
    if (activeModule?.id === moduleId) setActiveModule({ ...activeModule, title: newTitle });
  };

  const handleDeleteModule = (moduleId: string) => {
    if (!user) return;
    const target = allModules.find(m => m.id === moduleId);
    if (!target || target.authorId !== user.id) return;

    const updated = allModules.filter(m => m.id !== moduleId);
    syncModules(updated);
    
    if (activeModule?.id === moduleId) setActiveModule(null);
    setCurrentView(View.DASHBOARD);
  };

  const handleCreateGroup = (name: string, description: string, isPublic: boolean) => {
    if (!user) return;
    const newGroup: StudyGroup = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      inviteCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
      creatorId: user.id,
      members: [user],
      isPublic,
      activities: [{
        id: Math.random().toString(36).substr(2, 9),
        type: 'member_joined',
        userName: user.name,
        timestamp: Date.now()
      }]
    };
    syncGroups([...allGroups, newGroup]);
    setActiveGroup(newGroup);
    setCurrentView(View.GROUP_HUB);
  };

  const handleJoinGroup = (groupId: string) => {
    if (!user) return;
    const updated = allGroups.map(g => {
      if (g.id === groupId && !g.members.some(m => m.id === user.id)) {
        return { 
          ...g, 
          members: [...g.members, user],
          activities: [...(g.activities || []), {
            id: Math.random().toString(36).substr(2, 9),
            type: 'member_joined' as const,
            userName: user.name,
            timestamp: Date.now()
          }]
        };
      }
      return g;
    });
    syncGroups(updated);
    const joined = updated.find(g => g.id === groupId);
    if (joined) {
      setActiveGroup(joined);
      setCurrentView(View.GROUP_HUB);
    }
  };

  const handleJoinByCode = (code: string) => {
    const group = allGroups.find(g => g.inviteCode === code);
    if (group) {
      handleJoinGroup(group.id);
      return true;
    }
    return false;
  };

  const handleShareToGroup = (moduleId: string, groupId: string) => {
    const module = allModules.find(m => m.id === moduleId);
    const group = allGroups.find(g => g.id === groupId);
    if (!module || !group || !user) return;

    const updatedModules = allModules.map(m => m.id === moduleId ? { ...m, groupId, isShared: false } : m);
    syncModules(updatedModules);

    const updatedGroups = allGroups.map(g => g.id === groupId ? {
      ...g,
      activities: [...(g.activities || []), {
        id: Math.random().toString(36).substr(2, 9),
        type: 'note_added' as const,
        userName: user.name,
        contentTitle: module.title,
        timestamp: Date.now()
      }]
    } : g);
    syncGroups(updatedGroups);
  };

  const userModules = useMemo(() => {
    if (!user) return [];
    return allModules.filter(m => {
      const isAuthor = m.authorId === user.id;
      const isInMyGroup = m.groupId && allGroups.some(g => g.id === m.groupId && g.members.some(mem => mem.id === user.id));
      const isPubliclyShared = m.isShared;
      return isAuthor || isInMyGroup || isPubliclyShared;
    });
  }, [allModules, allGroups, user]);

  const userGroups = useMemo(() => {
    if (!user) return [];
    return allGroups.filter(g => g.members.some(m => m.id === user.id));
  }, [allGroups, user]);

  const renderContent = () => {
    if (!user) {
      if (currentView === View.AUTH) {
        return <Auth onRegister={handleRegister} onLoginSuccess={handleLoginSuccess} registeredUsers={registeredUsers} onBack={() => setCurrentView(View.LANDING)} />;
      }
      return <LandingPage onGetStarted={() => setCurrentView(View.AUTH)} />;
    }

    switch (currentView) {
      case View.DASHBOARD:
        return (
          <Dashboard 
            user={user}
            modules={userModules}
            groups={userGroups}
            onSelectModule={(m) => { setActiveModule(m); setCurrentView(View.STUDY); }}
            onDeleteModule={handleDeleteModule}
            onStartNew={() => setCurrentView(View.UPLOAD)}
          />
        );
      case View.COLLABORATION:
        return (
          <CollaborativeSpace 
            user={user}
            groups={allGroups}
            onJoinGroup={handleJoinGroup}
            onJoinByCode={handleJoinByCode}
            onCreateGroup={handleCreateGroup}
            onOpenGroup={(g) => { setActiveGroup(g); setCurrentView(View.GROUP_HUB); }}
          />
        );
      case View.GROUP_HUB:
        return activeGroup ? (
          <GroupHub 
            user={user}
            group={activeGroup}
            modules={allModules.filter(m => m.groupId === activeGroup.id)}
            challenges={allChallenges.filter(c => c.groupId === activeGroup.id)}
            onBack={() => setCurrentView(View.COLLABORATION)}
            onSelectModule={(m) => { setActiveModule(m); setCurrentView(View.STUDY); }}
            onShareModule={(moduleId) => handleShareToGroup(moduleId, activeGroup.id)}
            myModules={allModules.filter(m => m.authorId === user.id && !m.groupId)}
          />
        ) : null;
      case View.UPLOAD:
        return <FileUpload user={user} onComplete={handleAddModule} onCancel={() => setCurrentView(View.DASHBOARD)} />;
      case View.STUDY:
        return activeModule ? (
          <StudyContent 
            module={activeModule} 
            user={user}
            groups={userGroups}
            onUpdateNotes={handleUpdateNotes}
            onUpdateTitle={handleUpdateModuleTitle}
            onDeleteNote={handleDeleteModule}
            onGoToQuiz={() => setCurrentView(View.QUIZ)}
            onBack={() => activeModule.groupId ? setCurrentView(View.GROUP_HUB) : setCurrentView(View.DASHBOARD)}
            onToggleShare={(id) => syncModules(allModules.map(m => m.id === id ? { ...m, isShared: !m.isShared } : m))}
            onShareToGroup={handleShareToGroup}
            onAddComment={(id, text) => {
              const newComment = { id: Math.random().toString(36).substr(2, 9), userId: user.id, userName: user.name, text, timestamp: Date.now() };
              syncModules(allModules.map(m => m.id === id ? { ...m, comments: [...(m.comments || []), newComment] } : m));
            }}
          />
        ) : null;
      case View.QUIZ:
        return activeModule ? (
          <Quiz 
            module={activeModule} 
            onComplete={(score) => {
              const progress = Math.max(activeModule.progress, score);
              syncModules(allModules.map(m => m.id === activeModule.id ? { ...m, progress } : m));
              setCurrentView(View.DASHBOARD);
            }} 
            onBack={() => setCurrentView(View.STUDY)}
          />
        ) : null;
      case View.LIVE:
        return <LiveAssistant />;
      case View.INFO:
        return <InfoView />;
      default:
        return (
          <Dashboard 
            user={user} 
            modules={userModules} 
            groups={userGroups} 
            onSelectModule={(m) => { setActiveModule(m); setCurrentView(View.STUDY); }} 
            onDeleteModule={handleDeleteModule}
            onStartNew={() => setCurrentView(View.UPLOAD)} 
          />
        );
    }
  };

  if (!initialized) return null;

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans selection:bg-brand-500/30 selection:text-brand-200">
      {user && (
        <>
          {/* Mobile Overlay */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] md:hidden"
              />
            )}
          </AnimatePresence>

          <Sidebar 
            currentView={currentView} 
            setView={(v) => { setCurrentView(v); setIsSidebarOpen(false); }} 
            activeModule={activeModule}
            onSelectModule={(m) => { setActiveModule(m); setCurrentView(View.STUDY); setIsSidebarOpen(false); }}
            modules={userModules}
            onLogout={handleLogout}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        </>
      )}
      <main className={`flex-1 flex flex-col h-full relative overflow-y-auto hide-scrollbar bg-zinc-950 ${!user ? 'w-full' : ''}`}>
        {/* Mobile Header */}
        {user && (
          <header className="md:hidden flex items-center justify-between p-4 border-b border-zinc-900 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-[40]">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open Sidebar"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 text-zinc-400 active:scale-95 transition-all"
            >
              <i className="fas fa-bars"></i>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white text-xs">
                <i className="fas fa-brain"></i>
              </div>
              <span className="text-lg font-black tracking-tight text-white">ASC</span>
            </div>
            <div className="w-10 h-10"></div> {/* Spacer for alignment */}
          </header>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={currentView} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex-1">
            {renderContent()}
          </motion.div>
        </AnimatePresence>

        {user && (
          <>
            <AnimatePresence>
              {isChatOpen && (
                <AIChat 
                  activeModule={activeModule} 
                  availableModules={userModules} 
                  onClose={() => setIsChatOpen(false)} 
                  onSelectModule={(m) => setActiveModule(m)} 
                />
              )}
            </AnimatePresence>

            {/* Persistent Floating Chat Toggle Button */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl z-[80] group transition-colors duration-300 ${
                isChatOpen ? 'bg-zinc-800 text-zinc-400 border border-zinc-700' : 'bg-brand-600 text-white shadow-brand-600/40'
              }`}
            >
              <AnimatePresence mode="wait">
                <motion.i 
                  key={isChatOpen ? 'close' : 'chat'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`fas ${isChatOpen ? 'fa-times' : 'fa-robot'} text-2xl`}
                ></motion.i>
              </AnimatePresence>
              {!isChatOpen && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 border-2 border-zinc-950 rounded-full flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                </div>
              )}
            </motion.button>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
