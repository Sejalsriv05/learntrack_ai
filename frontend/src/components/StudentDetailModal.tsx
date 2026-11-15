import React, { useState, useEffect } from 'react';
import { StudentRosterItem, CheckInRecommendation } from '../types';
import { api } from '../services/api';
import { X, Mail, Check, Copy, AlertTriangle, Clock, RotateCcw } from 'lucide-react';

interface StudentDetailModalProps {
  student: StudentRosterItem | null;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, onClose }) => {
  const [draft, setDraft] = useState<CheckInRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (student) {
      setLoading(true);
      setCopied(false);
      api.getCheckinDraft(student.student_id)
        .then(res => setDraft(res))
        .finally(() => setLoading(false));
    }
  }, [student]);

  if (!student) return null;

  const handleCopy = () => {
    if (!draft) return;
    const text = `Subject: ${draft.suggested_email_subject}\n\n${draft.suggested_message}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-surface border border-line rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <div>
            <h3 className="font-bold text-base text-ink">{student.name}</h3>
            <p className="text-xs text-muted">{student.email}</p>
          </div>
          <button onClick={onClose} className="p-1 text-muted hover:text-ink rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-paper rounded-xl border border-line">
              <span className="text-[11px] font-semibold text-muted uppercase">Completion</span>
              <p className="text-xl font-bold text-ink mt-0.5">{student.completion_percentage}%</p>
            </div>
            <div className="p-3 bg-paper rounded-xl border border-line">
              <span className="text-[11px] font-semibold text-muted uppercase flex items-center gap-1">
                <Clock className="w-3 h-3 text-muted" /> Time
              </span>
              <p className="text-xl font-bold text-ink mt-0.5">{student.active_minutes} min</p>
            </div>
            <div className="p-3 bg-paper rounded-xl border border-line">
              <span className="text-[11px] font-semibold text-muted uppercase flex items-center gap-1">
                <RotateCcw className="w-3 h-3 text-muted" /> Revisits
              </span>
              <p className="text-xl font-bold text-ink mt-0.5">{student.revisits}</p>
            </div>
          </div>

          {/* Engagement Diagnostic */}
          <div className="p-4 rounded-xl border border-line bg-paper space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted uppercase">Engagement Profile</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                student.engagement_level === 'High' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                student.engagement_level === 'Moderate' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                student.engagement_level === 'Low' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
              }`}>
                {student.engagement_level === 'Unusual' ? 'Unusual pattern' : student.engagement_level}
              </span>
            </div>
            <p className="text-xs text-ink leading-relaxed">
              {student.pattern_description}
            </p>
          </div>

          {/* AI Check-in Draft */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-accent" />
                AI Suggested Check-in Message
              </label>
              {draft && (
                <button
                  onClick={handleCopy}
                  className="text-xs font-semibold text-accent hover:opacity-80 flex items-center gap-1 transition-opacity"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied to clipboard' : 'Copy Draft'}
                </button>
              )}
            </div>

            {loading ? (
              <div className="p-6 text-center text-xs text-muted">Generating personalized check-in...</div>
            ) : draft ? (
              <div className="p-4 rounded-xl border border-line bg-surface space-y-2 text-xs">
                <div className="font-semibold text-ink border-b border-line pb-1.5">
                  Subject: {draft.suggested_email_subject}
                </div>
                <div className="whitespace-pre-line text-muted leading-relaxed font-sans">
                  {draft.suggested_message}
                </div>
              </div>
            ) : null}
          </div>

          <div className="text-[11px] text-muted flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>AI check-ins are designed to be supportive, formative, and non-evaluative.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-paper border-t border-line flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-surface hover:bg-h0 border border-line rounded-lg text-xs font-semibold text-ink transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
