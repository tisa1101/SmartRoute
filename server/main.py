from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from database import engine, Base
import os
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Import modular routers
from api.routers import vehicles, orders, routes, analytics, predictions, simulation, auth, tasks_router

# Create all tables (or update them during development)
Base.metadata.create_all(bind=engine)

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="RouteX - Intelligent Fleet Optimization Platform")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Exception handlers for standard JSON format
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": True, "message": exc.detail, "details": []},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": True, "message": "Internal Server Error", "details": [str(exc)]},
    )

allowed_origins = os.environ.get(
    "ALLOWED_ORIGINS", 
    "http://localhost:3000,http://localhost:3005,https://smart-route-sigma-gold.vercel.app"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
@limiter.limit(os.environ.get("RATE_LIMIT", "100/minute"))
def health_check(request: Request):
    return {"status": "healthy", "service": "SmartRoute Backend"}


# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(vehicles.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(routes.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(predictions.router, prefix="/api")
app.include_router(simulation.router, prefix="/api")
app.include_router(tasks_router.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to RouteX API"}
