import pytest
from starlette.testclient import TestClient
from app.main import app

@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c

def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_login_faculty(client):
    response = client.post("/api/auth/login", json={
        "email": "name@college.edu",
        "password": "password",
        "role": "faculty"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "faculty"

def test_login_student(client):
    response = client.post("/api/auth/login", json={
        "email": "aarav@college.edu",
        "password": "password",
        "role": "student"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "student"

def test_courses_listing(client):
    response = client.get("/api/courses/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["code"] == "CS3104"

def test_student_progress(client):
    response = client.get("/api/courses/my-progress")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3

def test_telemetry_batch(client):
    response = client.post("/api/telemetry/batch", json={
        "unit_id": 2,
        "events": [
            {
                "event_type": "PAGE_ENTER",
                "page_number": 1,
                "dwell_delta_seconds": 15.0
            }
        ]
    })
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_assistant_query(client):
    response = client.post("/api/assistant/query", json={
        "unit_id": 2,
        "page_number": 12,
        "action": "explain"
    })
    assert response.status_code == 200
    data = response.json()
    assert "concept" in data
    assert "response" in data

def test_insights_bottlenecks(client):
    response = client.get("/api/insights/unit/2/bottlenecks")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "Pages" in data[0]["page_range"]
