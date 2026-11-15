import pytest
from app.ml.analyzer import (
    calculate_heat_level,
    format_seconds,
    classify_student_engagement,
    detect_bottlenecks,
    generate_checkin_draft
)

def test_calculate_heat_level():
    assert calculate_heat_level(0, 170) == 0
    assert calculate_heat_level(30, 170) == 0
    assert calculate_heat_level(50, 170) == 1
    assert calculate_heat_level(85, 170) == 2
    assert calculate_heat_level(120, 170) == 3
    assert calculate_heat_level(160, 170) == 4
    assert calculate_heat_level(200, 170) == 4

def test_format_seconds():
    assert format_seconds(45) == "45 s"
    assert format_seconds(60) == "1 min 0 s"
    assert format_seconds(150) == "2 min 30 s"

def test_classify_student_engagement_high():
    level, desc, needs_check = classify_student_engagement(100, 52, 4)
    assert level == "High"
    assert not needs_check

def test_classify_student_engagement_low():
    level, desc, needs_check = classify_student_engagement(35, 15, 0)
    assert level == "Low"
    assert needs_check

def test_classify_student_engagement_unusual_fast():
    level, desc, needs_check = classify_student_engagement(100, 4, 0)
    assert level == "Unusual"
    assert needs_check
    assert "Rapid" in desc

def test_classify_student_engagement_unusual_revisits():
    level, desc, needs_check = classify_student_engagement(88, 39, 14)
    assert level == "Unusual"
    assert needs_check
    assert "High revisit churn" in desc

def test_detect_bottlenecks():
    dwells = [30, 32, 28, 35, 160, 170, 165, 30, 25, 20]
    revisits = [1, 0, 1, 0, 8, 9, 7, 0, 1, 0]
    insights = detect_bottlenecks(dwells, revisits)
    assert len(insights) > 0
    assert "Pages" in insights[0]["page_range"]
    assert insights[0]["average_dwell_ratio"] > 1.5

def test_generate_checkin_draft():
    draft = generate_checkin_draft("Sana Khan", "Unusual", 4, 100)
    assert "Sana" in draft["message"]
    assert "zoomed through" in draft["message"]
