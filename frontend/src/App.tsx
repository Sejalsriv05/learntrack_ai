import React, { useState, useEffect } from 'react';
import { User, Role } from './types';
import { api } from './services/api';
import { Header } from './components/Header';
import { LoginView } from './components/LoginView';
import { FacultyDashboard } from './components/FacultyDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { DocumentReader } from './components/DocumentReader';

type ViewMode = 'login' | 'faculty' | 'student' | 'reader';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewMode>('login');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [activeUnit, setActiveUnit] = useState<{
    unitId: number;
    title: string;
    totalPages: number;
    initialPage: number;
  } | null>(null);

  // Initialize theme
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  };

  const handleLogin = async (email: string, role: Role) => {
    const loggedUser = await api.login(email, role);
    setUser(loggedUser);
    setView(role);
  };

  const handleSignOut = () => {
    setUser(null);
    setActiveUnit(null);
    setView('login');
  };

  const handleSwitchRole = (newRole: Role) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      role: newRole,
      full_name: newRole === 'faculty' ? 'Prof. Sarah Jenkins' : 'Sejal Srivastava',
      email: newRole === 'faculty' ? 'name@college.edu' : 'sejalsriv2005@gmail.com'
    };
    setUser(updatedUser);
    setView(newRole);
  };

  const handleOpenUnit = (unitId: number, title: string, totalPages: number, initialPage: number) => {
    setActiveUnit({ unitId, title, totalPages, initialPage });
    setView('reader');
  };

  const handleBackToLibrary = () => {
    setActiveUnit(null);
    setView('student');
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans transition-colors">
      {user && (
        <Header
          user={user}
          onSignOut={handleSignOut}
          onSwitchRole={handleSwitchRole}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {view === 'login' && <LoginView onLogin={handleLogin} />}

        {view === 'faculty' && <FacultyDashboard />}

        {view === 'student' && (
          <StudentDashboard onOpenUnit={handleOpenUnit} />
        )}

        {view === 'reader' && activeUnit && (
          <DocumentReader
            unitId={activeUnit.unitId}
            unitTitle={activeUnit.title}
            totalPages={activeUnit.totalPages}
            initialPage={activeUnit.initialPage}
            onBack={handleBackToLibrary}
          />
        )}
      </main>
    </div>
  );
};

export default App;
