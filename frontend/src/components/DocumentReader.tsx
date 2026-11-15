import React, { useState, useEffect } from 'react';
import { UnitPage } from '../types';
import { api } from '../services/api';
import { useReadingTelemetry } from '../hooks/useReadingTelemetry';
import { PrivacyCard } from './PrivacyCard';
import { AIAssistantModal } from './AIAssistantModal';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Sparkles,
  BookOpen,
  PauseCircle,
  PlayCircle
} from 'lucide-react';

interface DocumentReaderProps {
  unitId: number;
  unitTitle: string;
  totalPages: number;
  initialPage?: number;
  onBack: () => void;
}

export const DocumentReader: React.FC<DocumentReaderProps> = ({
  unitId,
  unitTitle,
  totalPages,
  initialPage = 1,
  onBack,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [zoom, setZoom] = useState<number>(1.0);
  const [pages, setPages] = useState<UnitPage[]>([]);
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Active Telemetry Hook
  const { log, isPaused, activeDwellSeconds } = useReadingTelemetry({
    unitId,
    currentPage,
    totalPages,
    isOpen: true
  });

  useEffect(() => {
    api.getUnitPages(unitId).then(res => setPages(res));
  }, [unitId]);

  const activePageData = pages.find(p => p.page_number === currentPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const handleZoomIn = () => setZoom(z => Math.min(1.4, z + 0.1));
  const handleZoomOut = () => setZoom(z => Math.max(0.75, z - 0.1));

  const progressPct = Math.round((currentPage / totalPages) * 100);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-3 rounded-xl border border-line sticky top-16 z-20 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-lg border border-line bg-paper hover:bg-h0 text-xs font-semibold text-ink flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to list
          </button>
          <span className="text-xs text-muted hidden sm:inline">|</span>
          <span className="text-xs font-medium text-ink hidden sm:inline">
            {unitTitle}
          </span>
        </div>

        {/* Navigation & Paging */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage <= 1}
            aria-label="Previous page"
            className="p-1.5 rounded-lg border border-line bg-paper hover:bg-h0 text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold tabular-nums text-ink px-2">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
            className="p-1.5 rounded-lg border border-line bg-paper hover:bg-h0 text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom & AI Tools */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-line rounded-lg overflow-hidden bg-paper">
            <button
              onClick={handleZoomOut}
              aria-label="Zoom out"
              className="p-1.5 hover:bg-h0 text-ink transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-semibold px-2 text-muted tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              aria-label="Zoom in"
              className="p-1.5 hover:bg-h0 text-ink transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsAIOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-accent text-on-accent text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Ask AI
          </button>
        </div>
      </div>

      {/* Main Grid: Document Stage + Telemetry Aside */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
        {/* Stage */}
        <div className="space-y-4">
          <div className="bg-h0/60 dark:bg-slate-900/40 rounded-2xl p-4 sm:p-8 flex justify-center overflow-auto min-h-[620px] border border-line">
            <article
              className="bg-surface rounded-sm shadow-md transition-all duration-150 p-8 sm:p-12 text-ink flex flex-col justify-between"
              style={{
                width: `${Math.round(440 * zoom)}px`,
                minHeight: `${Math.round(580 * zoom)}px`
              }}
            >
              {/* Document Page Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[11px] font-semibold text-muted uppercase tracking-wider border-b border-line pb-2">
                  <span>CS3104 Machine Learning</span>
                  <span>Page {currentPage}</span>
                </div>

                {activePageData ? (
                  <div className="space-y-4">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
                      {activePageData.title}
                    </h1>

                    {activePageData.key_concept && (
                      <div className="text-xs font-semibold text-accent bg-h0 dark:bg-slate-800 px-2.5 py-1 rounded-md inline-block border border-line">
                        Focus: {activePageData.key_concept}
                      </div>
                    )}

                    <div className="text-xs sm:text-sm text-ink leading-relaxed whitespace-pre-line space-y-3 font-normal">
                      {activePageData.content}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-line rounded w-3/4"></div>
                    <div className="space-y-2 pt-4">
                      <div className="h-2.5 bg-line rounded"></div>
                      <div className="h-2.5 bg-line rounded w-5/6"></div>
                      <div className="h-2.5 bg-line rounded w-4/6"></div>
                      <div className="h-2.5 bg-line rounded w-3/4"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Document Page Footer */}
              <div className="pt-8 border-t border-line text-[11px] text-muted flex items-center justify-between">
                <span>Unit 3: Regularization</span>
                <span>{currentPage} / {totalPages}</span>
              </div>
            </article>
          </div>

          {/* Reading Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted">
              <span>Progress in this unit</span>
              <span className="font-semibold text-ink">{progressPct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-h0 overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Aside: Privacy Pledge & Live Telemetry Feed */}
        <aside className="space-y-5">
          <PrivacyCard />

          {/* Real-time Session Activity Log */}
          <div className="bg-surface rounded-xl border border-line p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent" />
                <h3 className="font-semibold text-sm text-ink">Session Telemetry</h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted">
                {isPaused ? (
                  <span className="flex items-center gap-1 text-amber-600 font-medium">
                    <PauseCircle className="w-3.5 h-3.5" /> Paused (Inactive)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <PlayCircle className="w-3.5 h-3.5" /> Active ({activeDwellSeconds}s)
                  </span>
                )}
              </div>
            </div>

            <p className="text-[11px] text-muted leading-relaxed">
              Transparent live log of navigation events recorded for this session:
            </p>

            <ul className="divide-y divide-line font-mono text-[11px] text-muted max-h-48 overflow-y-auto">
              {log.length === 0 ? (
                <li className="py-2 text-center text-muted">No events yet</li>
              ) : (
                log.slice(0, 8).map((item, idx) => (
                  <li key={idx} className="py-1.5 flex items-center justify-between">
                    <span>{item.timestamp}</span>
                    <b className="text-ink font-semibold">{item.event}</b>
                    <span className="text-accent">p.{item.page}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </aside>
      </div>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        unitId={unitId}
        pageNumber={currentPage}
        pageTitle={activePageData?.title || `Page ${currentPage}`}
      />
    </div>
  );
};
