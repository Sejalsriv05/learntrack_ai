import React, { useState } from 'react';
import { Role } from '../types';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string, role: Role) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [role, setRole] = useState<Role>('faculty');
  const [email, setEmail] = useState<string>('name@college.edu');
  const [password, setPassword] = useState<string>('password');

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    if (newRole === 'faculty') {
      setEmail('name@college.edu');
    } else {
      setEmail('aarav@college.edu');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, role);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px] bg-surface p-8 sm:p-10 rounded-2xl border border-line shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-3 h-3 rounded-full bg-accent inline-block"></span>
          <span className="font-bold text-xl tracking-tight text-ink">
            LearnTrack <span className="text-accent">AI</span>
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-ink mb-2">
          Sign in
        </h1>
        <p className="text-muted text-sm leading-relaxed mb-6">
          See how learning material is read, without watching the reader.
        </p>

        {/* Role Segment Switcher */}
        <div className="grid grid-cols-2 p-1 bg-paper border border-line rounded-xl mb-6">
          <button
            type="button"
            onClick={() => handleRoleChange('faculty')}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              role === 'faculty'
                ? 'bg-accent text-on-accent shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            Faculty
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('student')}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              role === 'student'
                ? 'bg-accent text-on-accent shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            Student
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 bg-accent text-on-accent rounded-lg font-semibold text-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2 group"
          >
            Sign in as {role === 'faculty' ? 'Faculty' : 'Student'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-line flex items-center gap-2.5 text-xs text-muted">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Privacy Guaranteed: No video, no microphone, zero browser tracking.</span>
        </div>
      </div>
    </div>
  );
};
