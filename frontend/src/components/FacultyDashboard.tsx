import React, { useState, useEffect } from 'react';
import { UnitAnalyticsOverview, StudentRosterItem, CourseBottleneckInsight } from '../types';
import { api } from '../services/api';
import { StudentDetailModal } from './StudentDetailModal';
import { Sparkles, Search, Lightbulb, Users, Clock, AlertCircle } from 'lucide-react';

export const FacultyDashboard: React.FC = () => {
  const [data, setData] = useState<UnitAnalyticsOverview | null>(null);
  const [bottlenecks, setBottlenecks] = useState<CourseBottleneckInsight[]>([]);
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [readout, setReadout] = useState<string>('Select a page to see its average time and revisits.');
  const [selectedStudent, setSelectedStudent] = useState<StudentRosterItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [engagementFilter, setEngagementFilter] = useState<string>('All');

  useEffect(() => {
    api.getUnitAnalytics().then(res => setData(res));
    api.getBottlenecks().then(res => setBottlenecks(res));
  }, []);

  if (!data) {
    return (
      <div className="py-20 text-center text-muted text-sm">
        Loading analytics for Unit 3: Regularization...
      </div>
    );
  }

  const handlePageHover = (pageNumber: number) => {
    const stat = data.heatmap.find(p => p.page_number === pageNumber);
    if (stat) {
      setSelectedPage(pageNumber);
      const conceptPart = stat.key_concept ? ` (${stat.key_concept})` : '';
      setReadout(`Page ${pageNumber}${conceptPart}: average ${stat.formatted_dwell}, revisited by ${stat.revisit_count} students.`);
    }
  };

  const filteredStudents = data.students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = engagementFilter === 'All' || s.engagement_level === engagementFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title & Metadata */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink mb-1.5">
          {data.unit_title}
        </h1>
        <p className="text-muted text-sm max-w-2xl">
          {data.course_code} {data.course_name}, {data.section}. Assigned {data.assigned_date}, {data.total_pages} pages, {data.students.length} of {data.enrolled_count} students shown.
        </p>
      </div>

      {/* KPI Facts Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border-y border-line divide-y sm:divide-y-0 sm:divide-x divide-line">
        <div className="py-4 sm:py-5 px-4 sm:px-6">
          <div className="flex items-center gap-1.5 text-muted text-xs font-medium mb-1">
            <Users className="w-3.5 h-3.5" />
            Average completion
          </div>
          <b className="text-3xl font-bold tracking-tight text-ink">{data.average_completion}%</b>
        </div>
        <div className="py-4 sm:py-5 px-4 sm:px-6">
          <div className="flex items-center gap-1.5 text-muted text-xs font-medium mb-1">
            <Clock className="w-3.5 h-3.5" />
            Average active reading time
          </div>
          <b className="text-3xl font-bold tracking-tight text-ink">{data.average_active_minutes} min</b>
        </div>
        <div className="py-4 sm:py-5 px-4 sm:px-6">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-medium mb-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Students to check in with
          </div>
          <b className="text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
            {data.check_in_count}
          </b>
        </div>
      </div>

      {/* AI Bottlenecks Insight Banner */}
      {bottlenecks.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-indigo-950/40 border border-blue-200/80 dark:border-blue-900/50 space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-accent text-on-accent">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-accent dark:text-indigo-400">
              AI Cohort Bottleneck Detected: {bottlenecks[0].page_range}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink leading-relaxed">
            {bottlenecks[0].pedagogical_recommendation}
          </p>
          <div className="pt-1 flex flex-wrap gap-4 text-xs text-muted">
            <span>Dwell velocity: <b className="text-ink">{bottlenecks[0].average_dwell_ratio}x baseline</b></span>
            <span>Revisit frequency: <b className="text-ink">{bottlenecks[0].revisit_frequency} revisits</b></span>
            <span>Impacted cohort: <b className="text-ink">{bottlenecks[0].cohort_impact_pct}% of students</b></span>
          </div>
        </div>
      )}

      {/* Page Heatmap Section */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-ink">Where attention went, page by page</h2>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>Less time</span>
            <div className="flex items-center gap-1">
              <i className="w-4 h-2.5 rounded-xs inline-block bg-h0 border border-line"></i>
              <i className="w-4 h-2.5 rounded-xs inline-block bg-h1"></i>
              <i className="w-4 h-2.5 rounded-xs inline-block bg-h2"></i>
              <i className="w-4 h-2.5 rounded-xs inline-block bg-h3"></i>
              <i className="w-4 h-2.5 rounded-xs inline-block bg-h4"></i>
            </div>
            <span>More time</span>
          </div>
        </div>

        {/* Heatmap Strip */}
        <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-25 gap-1.5 py-2">
          {data.heatmap.map((page) => {
            const levelClass =
              page.heat_level === 0 ? 'bg-h0 text-ink' :
              page.heat_level === 1 ? 'bg-h1 text-ink' :
              page.heat_level === 2 ? 'bg-h2 text-ink' :
              page.heat_level === 3 ? 'bg-h3 text-white dark:text-slate-900' :
              'bg-h4 text-white dark:text-slate-900';

            const isSelected = selectedPage === page.page_number;

            return (
              <button
                key={page.page_number}
                type="button"
                onMouseEnter={() => handlePageHover(page.page_number)}
                onFocus={() => handlePageHover(page.page_number)}
                onClick={() => handlePageHover(page.page_number)}
                aria-label={`Page ${page.page_number}, average ${page.formatted_dwell}`}
                className={`aspect-square flex items-center justify-center rounded-md text-xs font-semibold tabular-nums transition-all ${levelClass} ${
                  isSelected ? 'ring-2 ring-accent scale-105 z-10' : 'hover:scale-105'
                }`}
              >
                {page.page_number}
              </button>
            );
          })}
        </div>

        {/* Live Readout */}
        <div className="min-h-[28px] font-medium text-xs sm:text-sm text-ink bg-surface border border-line rounded-lg px-3.5 py-2 flex items-center gap-2" aria-live="polite">
          <Lightbulb className="w-4 h-4 text-accent shrink-0" />
          <span>{readout}</span>
        </div>
      </section>

      {/* Student Roster Section */}
      <section className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">Students ({filteredStudents.length})</h2>
          
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-line bg-surface text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            {/* Filter */}
            <select
              value={engagementFilter}
              onChange={(e) => setEngagementFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg border border-line bg-surface text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="All">All Engagement</option>
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
              <option value="Unusual">Unusual</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border-t border-line">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-line text-muted font-semibold text-xs">
                <th className="py-3 pr-4">Student</th>
                <th className="py-3 px-4">Completion</th>
                <th className="py-3 px-4">Active time</th>
                <th className="py-3 px-4">Revisits</th>
                <th className="py-3 px-4">Engagement</th>
                <th className="py-3 pl-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredStudents.map((st) => (
                <tr
                  key={st.student_id}
                  onClick={() => setSelectedStudent(st)}
                  className="hover:bg-surface cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 pr-4 font-medium text-ink">
                    <div>{st.name}</div>
                    <div className="text-[11px] text-muted">{st.email}</div>
                  </td>
                  <td className="py-3.5 px-4 tabular-nums">
                    <div className="flex items-center gap-2">
                      <span className="w-20 sm:w-24 h-1.5 rounded-full bg-h0 overflow-hidden inline-block">
                        <i
                          className="block h-full bg-accent transition-all"
                          style={{ width: `${st.completion_percentage}%` }}
                        ></i>
                      </span>
                      <span>{st.completion_percentage}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 tabular-nums">{st.active_minutes} min</td>
                  <td className="py-3.5 px-4 tabular-nums">{st.revisits}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 font-semibold text-xs ${
                      st.engagement_level === 'High' ? 'text-high' :
                      st.engagement_level === 'Moderate' ? 'text-mod' :
                      st.engagement_level === 'Low' ? 'text-low' :
                      'text-unu'
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      {st.engagement_level === 'Unusual' ? 'Unusual pattern' : st.engagement_level}
                    </span>
                  </td>
                  <td className="py-3.5 pl-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStudent(st);
                      }}
                      className={`text-xs px-2.5 py-1 rounded-md font-medium border transition-colors ${
                        st.needs_check_in
                          ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100'
                          : 'border-line bg-surface text-ink hover:bg-paper'
                      }`}
                    >
                      {st.needs_check_in ? 'Check in' : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Note */}
        <p className="text-xs text-muted leading-relaxed pt-2">
          Engagement levels estimate how a student interacted with this document. They do not measure attention, intelligence, or conceptual understanding.
        </p>
      </section>

      {/* Student Detail Modal */}
      <StudentDetailModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
};
