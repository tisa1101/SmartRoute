from fastapi.testclient import TestClient
from main import app
from database import Base, engine, SessionLocal
import pytest

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_register_and_login():
    # Register
    res = client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "password123",
        "role": "admin"
    })
    assert res.status_code == 200
    assert res.json()["email"] == "test@example.com"
    
    # Login
    res = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert res.status_code == 200
    assert "access_token" in res.json()
