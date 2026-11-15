import React, { useState, useEffect } from 'react';
import { StudentCourseProgress } from '../types';
import { api } from '../services/api';
import { CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';

interface StudentDashboardProps {
  onOpenUnit: (unitId: number, title: string, totalPages: number, initialPage: number) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onOpenUnit }) => {
  const [units, setUnits] = useState<StudentCourseProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStudentProgress()
      .then(res => setUnits(res))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-muted text-sm">Loading course library...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink mb-1.5">
          Your reading
        </h1>
        <p className="text-muted text-sm">
          Material assigned to you in CS3104 Machine Learning.
        </p>
      </div>

      {/* Course Units List */}
      <div className="space-y-4">
        {units.map((unit) => {
          const isComplete = unit.completion_percentage === 100;
          const initialPage = unit.viewed_pages > 0 && unit.viewed_pages < unit.total_pages
            ? unit.viewed_pages + 1
            : 1;

          return (
            <div
              key={unit.unit_id}
              className="p-5 sm:p-6 bg-surface rounded-2xl border border-line shadow-xs hover:border-accent/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-semibold text-ink">
                    {unit.title}
                  </h2>
                  {isComplete && (
                    <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle className="w-3 h-3" />
                      Completed
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-muted">
                  {unit.viewed_pages} of {unit.total_pages} pages viewed
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="w-28 sm:w-36 h-2 rounded-full bg-h0 overflow-hidden inline-block">
                    <i
                      className="block h-full bg-accent transition-all duration-300"
                      style={{ width: `${unit.completion_percentage}%` }}
                    ></i>
                  </span>
                  <span className="text-xs sm:text-sm font-semibold tabular-nums text-ink">
                    {unit.completion_percentage}%
                  </span>
                </div>

                <button
                  onClick={() => onOpenUnit(unit.unit_id, unit.title, unit.total_pages, initialPage)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isComplete
                      ? 'bg-paper text-ink border border-line hover:bg-h0'
                      : 'bg-accent text-on-accent hover:opacity-95 shadow-xs'
                  }`}
                >
                  {unit.status}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transparency Note */}
      <div className="p-4 rounded-xl bg-paper border border-line flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Zero Surveillance: Reading progress tracks document view time only. No video or screen recording.</span>
        </div>
      </div>
    </div>
  );
};
