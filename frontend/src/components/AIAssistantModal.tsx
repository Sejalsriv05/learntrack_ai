import React, { useState } from 'react';
import { api } from '../services/api';
import { Sparkles, X, BookOpen, Calculator, HelpCircle, Loader2 } from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitId: number;
  pageNumber: number;
  pageTitle: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  unitId,
  pageNumber,
  pageTitle
}) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [customQuestion, setCustomQuestion] = useState('');

  if (!isOpen) return null;

  const handleAction = async (action: string, question?: string) => {
    setLoading(true);
    setResponse(null);
    try {
      const res = await api.askAssistant(unitId, pageNumber, action, question);
      setResponse(res.response);
      setFollowUps(res.follow_up_prompts || []);
    } catch {
      setResponse('Unable to fetch AI explanation. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-surface border border-line rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent/10 text-accent">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-ink">AI Reading Companion</h3>
              <p className="text-xs text-muted">Page {pageNumber}: {pageTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-muted hover:text-ink rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm flex-1">
          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleAction('explain')}
              className="px-3 py-1.5 rounded-lg border border-line bg-paper hover:bg-h0 text-xs font-medium text-ink flex items-center gap-1.5 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-accent" />
              Explain Concept
            </button>
            <button
              onClick={() => handleAction('summarize')}
              className="px-3 py-1.5 rounded-lg border border-line bg-paper hover:bg-h0 text-xs font-medium text-ink flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-accent" />
              Summarize Page
            </button>
            <button
              onClick={() => handleAction('formula_breakdown')}
              className="px-3 py-1.5 rounded-lg border border-line bg-paper hover:bg-h0 text-xs font-medium text-ink flex items-center gap-1.5 transition-colors"
            >
              <Calculator className="w-3.5 h-3.5 text-accent" />
              Break Down Math
            </button>
          </div>

          {/* Response Box */}
          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center text-muted gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-accent" />
              <span className="text-xs">Analyzing page content...</span>
            </div>
          ) : response ? (
            <div className="p-4 rounded-xl bg-paper border border-line leading-relaxed text-ink text-xs sm:text-sm whitespace-pre-line">
              {response}
            </div>
          ) : (
            <div className="p-6 text-center text-muted text-xs border border-dashed border-line rounded-xl">
              Choose an action above or ask a specific question about Page {pageNumber} below.
            </div>
          )}

          {/* Follow-up Prompts */}
          {followUps.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Suggested Deep Dives:</span>
              <div className="flex flex-col gap-1.5">
                {followUps.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAction('explain', prompt)}
                    className="text-left text-xs p-2 rounded-lg bg-surface hover:bg-paper border border-line text-accent transition-colors"
                  >
                    → {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Custom Question Input */}
        <div className="p-4 border-t border-line bg-paper flex gap-2">
          <input
            type="text"
            placeholder="Ask a clarifying question..."
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customQuestion.trim()) {
                handleAction('explain', customQuestion);
                setCustomQuestion('');
              }
            }}
            className="flex-1 px-3 py-2 rounded-lg border border-line bg-surface text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            onClick={() => {
              if (customQuestion.trim()) {
                handleAction('explain', customQuestion);
                setCustomQuestion('');
              }
            }}
            disabled={!customQuestion.trim() || loading}
            className="px-3.5 py-2 bg-accent text-on-accent text-xs font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
};
