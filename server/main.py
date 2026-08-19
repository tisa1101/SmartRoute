from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base

# Import modular routers
from api.routers import vehicles, orders, routes, analytics, predictions, simulation

# Create all tables (or update them during development)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="RouteX - Intelligent Fleet Optimization Platform")

origins = [
    "*",
    "http://localhost:3000",
    "http://localhost:3005",
    "https://*.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Allow all for deployment; restrict to your Vercel URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "SmartRoute Backend"}


# Include routers
app.include_router(vehicles.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(routes.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(predictions.router, prefix="/api")
app.include_router(simulation.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to RouteX API"}
