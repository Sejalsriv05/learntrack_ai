import {
  UnitAnalyticsOverview,
  StudentCourseProgress,
  CourseBottleneckInsight,
  CheckInRecommendation,
  User,
  Role,
  UnitPage
} from '../types';
import { INITIAL_PROGRESS, UNIT_3_PAGES } from '../data/courses';

const API_BASE = '/api';

export const api = {
  // Authentication
  async login(email: string, role: Role): Promise<User> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'password', role })
      });
      if (res.ok) {
        const data = await res.json();
        return {
          id: data.user_id,
          email: data.email,
          full_name: data.full_name,
          role: data.role as Role,
          token: data.access_token
        };
      }
    } catch {
      // Fallback
    }
    return {
      id: role === 'faculty' ? 1 : 2,
      email,
      full_name: role === 'faculty' ? 'Prof. Sarah Jenkins' : 'Aarav Mehta',
      role
    };
  },

  // Faculty Analytics
  async getUnitAnalytics(unitId: number = 2): Promise<UnitAnalyticsOverview> {
    try {
      const res = await fetch(`${API_BASE}/analytics/unit/${unitId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    // Return high-fidelity fallback matching the prototype
    const dwell = [40, 52, 36, 30, 58, 46, 50, 66, 80, 92, 104, 150, 162, 158, 170, 144, 138, 132, 70, 56, 32, 26, 20, 24, 16];
    const people = [
      ["Aarav Mehta", 100, 52, 4, "High"],
      ["Diya Sharma", 96, 47, 6, "High"],
      ["Kabir Nair", 84, 41, 3, "High"],
      ["Ishita Rao", 72, 36, 2, "Moderate"],
      ["Rohan Verma", 68, 33, 1, "Moderate"],
      ["Ananya Iyer", 64, 30, 3, "Moderate"],
      ["Vihaan Gupta", 40, 18, 0, "Low"],
      ["Meera Joshi", 32, 12, 0, "Low"],
      ["Arjun Singh", 28, 9, 1, "Low"],
      ["Sana Khan", 100, 4, 0, "Unusual"],
      ["Dev Patel", 88, 39, 14, "Unusual"],
      ["Riya Das", 76, 35, 2, "Moderate"]
    ] as const;

    const heatmap = dwell.map((d, i) => {
      const p = i + 1;
      const lvl = Math.min(4, Math.floor(d / 170 * 5));
      const mins = Math.floor(d / 60);
      const secs = d % 60;
      const fmt = mins > 0 ? `${mins} min ${secs} s` : `${secs} s`;
      return {
        page_number: p,
        average_dwell_seconds: d,
        formatted_dwell: fmt,
        revisit_count: (i * 5 + 3) % 9,
        heat_level: lvl,
        key_concept: UNIT_3_PAGES[i]?.key_concept || `Concept Page ${p}`,
        is_bottleneck: lvl >= 3 && [12, 13, 14, 15, 16].includes(p)
      };
    });

    const students = people.map((p, idx) => ({
      student_id: idx + 2,
      name: p[0],
      email: `${p[0].toLowerCase().replace(' ', '.')}@college.edu`,
      completion_percentage: p[1],
      active_minutes: p[2],
      revisits: p[3],
      engagement_level: p[4] as 'High' | 'Moderate' | 'Low' | 'Unusual',
      pattern_description: p[4] === 'Unusual' ? 'Anomalous navigation velocity or high revisit churn' : `${p[4]} consistent progress`,
      needs_check_in: p[4] === 'Low' || p[4] === 'Unusual'
    }));

    return {
      unit_id: 2,
      course_name: "Machine Learning",
      course_code: "CS3104",
      section: "section A",
      unit_title: "Unit 3: Regularization",
      assigned_date: "12 Sep",
      total_pages: 25,
      enrolled_count: 42,
      active_students_count: 12,
      average_completion: 76,
      average_active_minutes: 38,
      check_in_count: 3,
      heatmap,
      students
    };
  },

  // Student Progress
  async getStudentProgress(): Promise<StudentCourseProgress[]> {
    try {
      const res = await fetch(`${API_BASE}/courses/my-progress`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return INITIAL_PROGRESS;
  },

  // Course Unit Pages
  async getUnitPages(unitId: number): Promise<UnitPage[]> {
    try {
      const res = await fetch(`${API_BASE}/courses/units/${unitId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.pages && data.pages.length > 0) {
          return data.pages;
        }
      }
    } catch {
      // Fallback
    }
    return UNIT_3_PAGES;
  },

  // Telemetry event ingestion
  async sendTelemetry(unitId: number, sessionId: number | null, events: Array<{ event_type: string; page_number: number; dwell_delta_seconds?: number }>) {
    try {
      await fetch(`${API_BASE}/telemetry/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unit_id: unitId,
          session_id: sessionId,
          events
        })
      });
    } catch {
      // Silent telemetry dispatch
    }
  },

  // AI Bottleneck Insights
  async getBottlenecks(unitId: number = 2): Promise<CourseBottleneckInsight[]> {
    try {
      const res = await fetch(`${API_BASE}/insights/unit/${unitId}/bottlenecks`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return [
      {
        page_range: 'Pages 12–16',
        pages: [12, 13, 14, 15, 16],
        topic: 'L1 Diamond vs L2 Sphere Contours & Sparsity Proofs',
        severity: 'High',
        average_dwell_ratio: 2.3,
        revisit_frequency: 38,
        cohort_impact_pct: 68,
        pedagogical_recommendation:
          'Cohort dwell is 2.3x higher on Pages 12–16 with frequent cross-revisits. Students are heavily re-reading the geometric intersection proofs. Recommend opening next lecture with a 10-minute recap of gradient descent under L1 contour corners.'
      }
    ];
  },

  // AI Check-in recommendation draft
  async getCheckinDraft(studentId: number): Promise<CheckInRecommendation> {
    try {
      const res = await fetch(`${API_BASE}/insights/student/${studentId}/checkin`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return {
      student_id: studentId,
      student_name: 'Student',
      engagement_level: 'Low',
      status_summary: 'Stalled session under 20% completion.',
      suggested_email_subject: 'CS3104: Support for Unit 3 reading',
      suggested_message: 'Hi,\n\nChecking in to see if you need any support getting through Unit 3. Let me know if you would like to review during office hours!\n\nBest,\nCourse Staff'
    };
  },

  // AI In-Reader Assistant
  async askAssistant(unitId: number, pageNumber: number, action: string, question?: string) {
    try {
      const res = await fetch(`${API_BASE}/assistant/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unit_id: unitId,
          page_number: pageNumber,
          action,
          question
        })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return {
      page_number: pageNumber,
      concept: `Page ${pageNumber} Theory`,
      response: `This page covers foundational regularization dynamics. Regularization introduces an inductive bias penalizing large parameter magnitudes, preventing overfitting to observational noise and ensuring numerical stability during optimization.`,
      follow_up_prompts: [
        'Summarize this page in 2 sentences',
        'Show the difference between L1 and L2 penalties',
        'How does this prevent overfitting?'
      ]
    };
  }
};
