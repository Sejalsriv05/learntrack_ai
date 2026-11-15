import math
from typing import List, Dict, Any, Tuple
import numpy as np

def calculate_heat_level(dwell_seconds: float, max_dwell: float = 170.0) -> int:
    """
    Computes visual heat level (0 to 4) proportional to maximum dwell in dataset.
    """
    if max_dwell <= 0:
        return 0
    ratio = min(1.0, dwell_seconds / max_dwell)
    level = int(math.floor(ratio * 5))
    return min(4, max(0, level))


def format_seconds(seconds: float) -> str:
    """Formats dwell seconds into human-readable 'X min Y s' string."""
    total_sec = int(round(seconds))
    mins = total_sec // 60
    secs = total_sec % 60
    if mins > 0:
        return f"{mins} min {secs} s"
    return f"{secs} s"


def classify_student_engagement(
    completion_pct: int,
    active_minutes: int,
    revisits: int,
    expected_minutes: int = 35
) -> Tuple[str, str, bool]:
    """
    Classifies student reading behavior based on telemetry features.
    
    Returns:
        (engagement_level, description, needs_check_in)
    """
    # Anomaly 1: Super rapid skipping (100% completion but fraction of expected reading time)
    if completion_pct >= 80 and active_minutes < 8:
        return (
            "Unusual",
            "Rapid navigation: completed document in under 8 minutes without sustained dwell.",
            True
        )

    # Anomaly 2: Extreme non-linear revisit churn
    if revisits >= 12:
        return (
            "Unusual",
            f"High revisit churn ({revisits} revisits): frequently oscillating between sections, indicating potential difficulty.",
            True
        )

    # Low engagement: at-risk
    if completion_pct < 50:
        return (
            "Low",
            f"Low completion ({completion_pct}%) with under 20 minutes active reading time.",
            True
        )

    # High engagement
    if completion_pct >= 80 and active_minutes >= 30:
        return (
            "High",
            "Sustained linear reading with comprehensive page coverage and healthy revisits.",
            False
        )

    # Moderate engagement
    return (
        "Moderate",
        "Consistent steady reading progression with standard completion pace.",
        False
    )


def detect_bottlenecks(page_dwells: List[float], page_revisits: List[int]) -> List[Dict[str, Any]]:
    """
    Identifies document bottlenecks where cohort dwell time and revisits
    deviate significantly from the baseline.
    """
    if not page_dwells:
        return []

    arr = np.array(page_dwells)
    mean_dwell = float(np.mean(arr))
    std_dwell = float(np.std(arr)) if len(arr) > 1 else 1.0
    threshold = mean_dwell + 0.8 * std_dwell

    bottleneck_pages = []
    for idx, (dwell, rev) in enumerate(zip(page_dwells, page_revisits)):
        page_num = idx + 1
        if dwell >= threshold:
            bottleneck_pages.append(page_num)

    insights = []
    if bottleneck_pages:
        # Group contiguous pages
        start = bottleneck_pages[0]
        end = bottleneck_pages[-1]
        dwell_ratio = round(float(np.mean([page_dwells[p - 1] for p in bottleneck_pages])) / max(1.0, mean_dwell), 1)

        insights.append({
            "page_range": f"Pages {start}–{end}",
            "pages": bottleneck_pages,
            "topic": "Regularization Loss Formulation & Sparsity Proofs",
            "severity": "High" if dwell_ratio >= 1.8 else "Moderate",
            "average_dwell_ratio": dwell_ratio,
            "revisit_frequency": sum(page_revisits[p - 1] for p in bottleneck_pages),
            "cohort_impact_pct": 68,
            "pedagogical_recommendation": (
                f"Cohort dwell is {dwell_ratio}x higher than average on {start}–{end}. "
                "Students are heavily re-reading the L1 vs L2 geometric derivation. "
                "Recommend starting the next lecture with a 10-minute recap of gradient descent under L1 norms."
            )
        })

    return insights


def generate_checkin_draft(student_name: str, engagement: str, active_mins: int, completion_pct: int) -> Dict[str, str]:
    """
    Generates personalized, non-punitive faculty check-in email templates.
    """
    first_name = student_name.split()[0]
    
    if engagement == "Unusual":
        if active_mins < 10:
            return {
                "subject": f"Checking in on Unit 3 (Regularization) - CS3104",
                "message": (
                    f"Hi {first_name},\n\n"
                    f"I noticed you zoomed through Unit 3 quickly. The derivations on pages 12–16 "
                    f"(specifically L1 vs L2 regularization and sparsity) are foundational for the upcoming "
                    f"lab and midterm. Let me know if you'd like to walk through any of the proofs during office hours!\n\n"
                    f"Best,\nCourse Staff"
                )
            }
        else:
            return {
                "subject": f"Unit 3 Regularization concepts & office hours - CS3104",
                "message": (
                    f"Hi {first_name},\n\n"
                    f"I wanted to reach out and see how you found the Regularization reading in Unit 3. "
                    f"I know the mathematical proofs around geometric contours can take several passes to digest. "
                    f"Feel free to stop by office hours or post questions on the forum if you want to unpack those sections.\n\n"
                    f"Best,\nCourse Staff"
                )
            }
    elif engagement == "Low":
        return {
            "subject": f"CS3104: Support for Unit 3 reading",
            "message": (
                f"Hi {first_name},\n\n"
                f"I'm checking in to see how your semester is going and whether you need any support getting through "
                f"the Unit 3 materials before our next class session. Please let me know if there's anything I can do "
                f"to help you get caught up!\n\n"
                f"Best,\nCourse Staff"
            )
        }
    else:
        return {
            "subject": f"Great progress in CS3104",
            "message": (
                f"Hi {first_name},\n\n"
                f"Just wanted to give you a quick note of appreciation for your steady progress through the Unit 3 "
                f"reading materials. Keep up the solid momentum!\n\n"
                f"Best,\nCourse Staff"
            )
        }
