# LearnTrack AI

<div align="center">

![LearnTrack AI Banner](https://img.shields.io/badge/LearnTrack-AI-2440C8?style=for-the-badge&logo=googlegemini&logoColor=white)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

<p align="center">
  <b>Privacy-preserving reading telemetry & AI comprehension intelligence for higher education.</b><br>
  <i>See how learning material is read, without watching the reader.</i>
</p>

</div>

---

## 📌 Executive Summary

Traditional education platforms force institutions into a false dilemma:
1. **Total Ignorance**: Traditional LMSs (Canvas, Blackboard, Moodle) only record coarse timestamps like *"Last accessed 3 days ago"*, leaving instructors blind to whether students actually understood the reading or where they struggled.
2. **Invasive Surveillance**: Proctoring and surveillance software invasively monitor webcams, track room audio, record keystrokes, and monitor outside browser tabs—creating anxiety, compliance liabilities, and severe privacy violations.

**LearnTrack AI** introduces a third way: **Passive, Zero-Invasive Document Telemetry paired with Cohort-Level AI Intelligence**. By measuring non-invasive viewport interaction signals (page dwell times, non-linear revisit frequencies, reading velocity, and visibility states), LearnTrack AI surfaces critical curriculum bottlenecks and struggling students without ever accessing student webcams, microphones, or off-tab activity.

---

## 🚀 Key Features

### 🎓 For Faculty & Instructors
- **Cohort Attention Heatmap**: Interactive, page-by-page visual dwell spectrum ($L_0$ to $L_4$) showing where students spent active reading time and which pages required repeated revisits.
- **AI Bottleneck Detection**: Automatic statistical anomaly detection flagging dense, confusing, or poorly paced sections (e.g., *"Pages 12–16 show 2.3x expected dwell and 38 revisits across 68% of the cohort"*).
- **Pedagogical Lecture Interventions**: Concrete, AI-generated curriculum suggestions (e.g., *"Open next lecture with a 10-minute recap of gradient descent under L1 contour corners"*).
- **Non-Punitive Student Roster**: Categorizes engagement into healthy archetypes (`High`, `Moderate`, `Low / At-Risk`, `Unusual Pattern`) with 1-click tailored check-in drafts.

### 📖 For Students
- **Zero Surveillance Pledge**: Clear, transparent in-app disclosure detailing exactly what is tracked (active page dwell) and what is **never** tracked (no video, no audio, no keystrokes, no off-tab snooping).
- **Live Session Telemetry Feed**: Real-time inspectable audit log of every event emitted during the reading session (`OPEN`, `PAGE_ENTER`, `DWELL_TICK`, `BLUR`, `FOCUS`, `CLOSE`).
- **In-Reader AI Study Companion**: On-demand contextual tutor offering intuitive concept explanations, formula breakdowns, and page summaries directly within the reading workflow.
- **Smart Idle & Blur Throttling**: Automatically pauses timers when switching tabs or when inactive for >60 seconds, ensuring reading statistics remain fair and accurate.

---

## 🧠 Architectural Design

```
learntrack_ai/
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated CI pipeline for backend & frontend
├── backend/
│   ├── app/
│   │   ├── api/                 # REST routes: auth, courses, telemetry, analytics, insights, assistant
│   │   ├── ml/                  # ML heuristics: engagement scoring, anomaly & bottleneck detection
│   │   ├── models/              # SQLAlchemy SQLite models (Users, Units, Pages, Telemetry)
│   │   ├── schemas/             # Pydantic validation schemas
│   │   ├── config.py            # Environment configuration
│   │   ├── database.py          # Async SQLite session engine
│   │   ├── main.py              # FastAPI initialization, CORS & lifespan
│   │   └── seed.py              # High-fidelity realistic seed data generator
│   ├── tests/                   # Pytest test suite (16 tests, 100% pass)
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/          # FacultyDashboard, StudentDashboard, DocumentReader, PrivacyCard
│   │   ├── hooks/               # useReadingTelemetry (Visibility API, idle throttling)
│   │   ├── services/            # API client layer with resilient fallbacks
│   │   ├── data/                # High-fidelity CS3104 Machine Learning syllabus content
│   │   ├── types/               # TypeScript type definitions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml           # Unified multi-container orchestration
├── run_dev.sh                   # Single-command development runner
├── ARCHITECTURE.md              # In-depth technical architecture guide
└── README.md
```

---

## 📊 Telemetry & ML Scoring Formulations

### 1. Dwell Normalization & Heatmap Levels ($L_0$ to $L_4$)
Let $t_p$ be the average active dwell time in seconds for page $p \in [1, N]$, and $t_{\max}$ be the maximum expected baseline dwell:
$$\text{Level}(p) = \min\left(4, \left\lfloor \frac{t_p}{t_{\max}} \times 5 \right\rfloor\right)$$

- **Level 0 (Very Light)**: $0 \le t_p < 0.20 \times t_{\max}$
- **Level 1 (Light)**: $0.20 \times t_{\max} \le t_p < 0.40 \times t_{\max}$
- **Level 2 (Moderate)**: $0.40 \times t_{\max} \le t_p < 0.60 \times t_{\max}$
- **Level 3 (Intensive)**: $0.60 \times t_{\max} \le t_p < 0.80 \times t_{\max}$
- **Level 4 (Peak / Bottleneck)**: $t_p \ge 0.80 \times t_{\max}$

### 2. Bottleneck Detection Algorithm
A contiguous set of pages $P_B$ is flagged as a curriculum bottleneck if:
$$\bar{t}_{P_B} \ge \mu_{\text{dwell}} + 0.8 \cdot \sigma_{\text{dwell}} \quad \text{and} \quad \sum_{p \in P_B} R_p \ge \theta_{\text{revisit}}$$
Where $R_p$ denotes the total revisit frequency and $\bar{t}_{P_B}$ is the mean dwell time over pages $P_B$.

### 3. Engagement & Telemetry Anomaly Classifications
- **High Deep Reading**: Completion $\ge 80\%$, Active time $\ge 30\text{ min}$, balanced revisits.
- **Moderate Progression**: Steady linear progression with standard completion pace.
- **Low / At-Risk**: Completion $< 50\%$ with $< 20\text{ min}$ active reading time.
- **Unusual Pattern**:
  - *Velocity Anomaly*: Completion $\ge 80\%$ in $< 8\text{ min}$ (automated page flipping / bot skimming).
  - *Oscillation Anomaly*: Revisits $\ge 12$ across small page clusters (severe conceptual confusion or technical friction).

---

## ⚡ Quickstart Guide

### Option 1: Docker Compose (Recommended)
Launch both services with a single command:
```bash
docker compose up --build
```
- **Frontend Application**: `http://localhost:5173`
- **Backend API & Swagger**: `http://localhost:8000/docs`

---

### Option 2: Local Development Runner
You can start both frontend and backend using the root script:
```bash
./run_dev.sh
```

---

### Option 3: Manual Step-by-Step Setup

#### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run migrations and seed sample data
python3 -m app.seed

# Start FastAPI development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Testing & Verification

The backend includes a comprehensive Pytest test suite covering ML algorithms, anomaly detection, telemetry ingestion, and API endpoints:

```bash
cd backend
source venv/bin/activate
pytest -v tests/
```

**Results**:
```
tests/test_analytics.py::test_calculate_heat_level PASSED
tests/test_analytics.py::test_format_seconds PASSED
tests/test_analytics.py::test_classify_student_engagement_high PASSED
tests/test_analytics.py::test_classify_student_engagement_low PASSED
tests/test_analytics.py::test_classify_student_engagement_unusual_fast PASSED
tests/test_analytics.py::test_classify_student_engagement_unusual_revisits PASSED
tests/test_analytics.py::test_detect_bottlenecks PASSED
tests/test_analytics.py::test_generate_checkin_draft PASSED
tests/test_api.py::test_health_check PASSED
tests/test_api.py::test_login_faculty PASSED
tests/test_api.py::test_login_student PASSED
tests/test_api.py::test_courses_listing PASSED
tests/test_api.py::test_student_progress PASSED
tests/test_api.py::test_telemetry_batch PASSED
tests/test_api.py::test_assistant_query PASSED
tests/test_api.py::test_insights_bottlenecks PASSED
======================== 16 passed in 0.27s ========================
```

---

## 🌐 API Reference Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate Faculty or Student and retrieve JWT session |
| `GET` | `/api/auth/me` | Fetch active profile |
| `GET` | `/api/courses/` | List enrolled courses and syllabus units |
| `GET` | `/api/courses/units/{id}` | Retrieve unit page contents and theoretical materials |
| `GET` | `/api/courses/my-progress` | Retrieve student progress across syllabus units |
| `POST` | `/api/telemetry/sessions/start` | Start reading telemetry session |
| `POST` | `/api/telemetry/batch` | Batch ingest passive viewport events (`PAGE_ENTER`, `DWELL_TICK`, `BLUR`, `FOCUS`) |
| `GET` | `/api/analytics/unit/{id}` | Fetch faculty dashboard KPIs, attention heatmap, and student roster |
| `GET` | `/api/insights/unit/{id}/bottlenecks` | Detect learning bottlenecks and cohort drop-off sections |
| `GET` | `/api/insights/student/{id}/checkin` | Generate AI-personalized supportive faculty check-in drafts |
| `POST` | `/api/assistant/query` | In-reader AI tutor explanation, math breakdown, or page summary |

Interactive Swagger documentation is available at `http://localhost:8000/docs`.

---

## 🔒 Privacy & Compliance Manifesto

LearnTrack AI is engineered from the ground up to respect student autonomy and maintain strict compliance with global privacy regulations:

- **FERPA Compliance**: Student learning analytics are strictly restricted to enrolled course instructors and verified educational personnel.
- **GDPR Article 22 Compliance**: The platform strictly avoids automated negative evaluations. All AI suggestions are advisory, formative, and human-in-the-loop.
- **Data Minimization Principle**: Telemetry captures only aggregated dwell seconds and page sequence transitions. Zero biometric, video, audio, or cross-site tracking data is ever acquired or stored.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
