import React from 'react';
import { User, Role } from '../types';
import { ShieldCheck, Moon, Sun, LogOut } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onSignOut: () => void;
  onSwitchRole: (role: Role) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onSignOut,
  onSwitchRole,
  theme,
  onToggleTheme,
}) => {
  if (!user) return null;

  return (
    <header className="flex items-center justify-between px-4 sm:px-8 py-3.5 bg-surface border-b border-line sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-3">
        <div className="font-bold text-[17px] tracking-tight text-ink flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block"></span>
          LearnTrack <span className="text-accent">AI</span>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-3 h-3" />
          Zero Surveillance
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted">
        {/* Role toggle badge */}
        <div className="hidden sm:flex items-center bg-paper p-0.5 rounded-lg border border-line text-xs">
          <button
            onClick={() => onSwitchRole('faculty')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              user.role === 'faculty'
                ? 'bg-accent text-on-accent shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            Faculty View
          </button>
          <button
            onClick={() => onSwitchRole('student')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              user.role === 'student'
                ? 'bg-accent text-on-accent shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            Student View
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-ink font-medium text-xs sm:text-sm">
            {user.full_name}
          </span>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-accent bg-h0 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-line">
            {user.role}
          </span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-paper transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Sign out */}
        <button
          onClick={onSignOut}
          className="flex items-center gap-1 font-semibold text-accent hover:opacity-80 transition-opacity text-xs sm:text-sm"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </header>
  );
};
