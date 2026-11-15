export type Role = 'faculty' | 'student';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: Role;
  token?: string;
}

export interface HeatmapPageStat {
  page_number: number;
  average_dwell_seconds: number;
  formatted_dwell: string;
  revisit_count: number;
  heat_level: number; // 0 to 4
  key_concept?: string;
  is_bottleneck: boolean;
}

export interface StudentRosterItem {
  student_id: number;
  name: string;
  email: string;
  completion_percentage: number;
  active_minutes: number;
  revisits: number;
  engagement_level: 'High' | 'Moderate' | 'Low' | 'Unusual';
  pattern_description: string;
  needs_check_in: boolean;
}

export interface UnitAnalyticsOverview {
  unit_id: number;
  course_name: string;
  course_code: string;
  section: string;
  unit_title: string;
  assigned_date: string;
  total_pages: number;
  enrolled_count: number;
  active_students_count: number;
  average_completion: number;
  average_active_minutes: number;
  check_in_count: number;
  heatmap: HeatmapPageStat[];
  students: StudentRosterItem[];
}

export interface CourseBottleneckInsight {
  page_range: string;
  pages: number[];
  topic: string;
  severity: 'High' | 'Moderate';
  average_dwell_ratio: number;
  revisit_frequency: number;
  cohort_impact_pct: number;
  pedagogical_recommendation: string;
}

export interface CheckInRecommendation {
  student_id: number;
  student_name: string;
  engagement_level: string;
  status_summary: string;
  suggested_email_subject: string;
  suggested_message: string;
}

export interface StudentCourseProgress {
  unit_id: number;
  title: string;
  total_pages: number;
  viewed_pages: number;
  completion_percentage: number;
  status: 'Start reading' | 'Continue reading' | 'Review';
}

export interface UnitPage {
  id: number;
  page_number: number;
  title: string;
  content: string;
  key_concept?: string;
  estimated_reading_sec: number;
}

export interface TelemetryLogEntry {
  timestamp: string;
  event: string;
  page: number;
}
