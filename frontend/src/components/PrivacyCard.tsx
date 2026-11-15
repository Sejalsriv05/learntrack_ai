import React from 'react';
import { EyeOff, CheckCircle2, XCircle, Shield } from 'lucide-react';

export const PrivacyCard: React.FC = () => {
  return (
    <div className="bg-surface rounded-xl border border-line p-5 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-line">
        <Shield className="w-4 h-4 text-accent" />
        <h3 className="font-semibold text-sm text-ink">Privacy-First Guarantee</h3>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          What is tracked
        </h4>
        <ul className="text-xs text-muted space-y-1.5 pl-5 list-disc">
          <li>Which pages you open and how long each stays in active view</li>
          <li>When you start, pause (tab blur/idle), and finish reading</li>
        </ul>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          What is NEVER tracked
        </h4>
        <ul className="text-xs text-muted space-y-1.5 pl-5 list-disc">
          <li>No webcam, camera, or facial expression analysis</li>
          <li>No microphone or background audio</li>
          <li>No keystrokes, clipboard, or screen recording</li>
          <li>No cross-tab, search history, or outside apps tracking</li>
        </ul>
      </div>

      <div className="pt-3 border-t border-line text-[11px] text-muted flex items-start gap-1.5">
        <EyeOff className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
        <span>Only you and the faculty of CS3104 can see aggregated reading activity.</span>
      </div>
    </div>
  );
};
