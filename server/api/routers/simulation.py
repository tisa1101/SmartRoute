from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/simulation", tags=["simulation"])

class SimulationRequest(BaseModel):
    num_vehicles: int
    vehicle_capacity: float
    num_deliveries: int
    traffic_level: str
    weather_condition: str
    priority_orders: int
    max_delivery_time: int

@router.post("/what-if")
def run_simulation(req: SimulationRequest):
    # This is a stub for the What-If Simulator.
    # It would normally:
    # 1. Generate `num_deliveries` synthetic orders based on the request constraints.
    # 2. Run VRPOptimizer and TSPOptimizer over them.
    # 3. Apply traffic and weather penalties to ETA.
    # 4. Compute cost, fuel, and optimization scores.
    
    total_distance = req.num_deliveries * 3.5 # simulated average
    total_eta = total_distance * 1.5
    
    if req.traffic_level == "Heavy":
        total_eta *= 1.5
    if req.weather_condition == "Rain":
        total_eta *= 1.2
        
    optimization_score = 100 - (req.num_vehicles * 5) + (req.priority_orders * 2)
    optimization_score = max(0, min(100, optimization_score)) # Clamp to 0-100
    
    return {
        "scenario_summary": {
            "vehicles": req.num_vehicles,
            "deliveries": req.num_deliveries,
            "traffic": req.traffic_level,
            "weather": req.weather_condition
        },
        "results": {
            "total_distance_km": round(total_distance, 2),
            "total_eta_minutes": int(total_eta),
            "vehicles_used": req.num_vehicles,
            "estimated_fuel_liters": round(total_distance / 10.0, 2),
            "delivery_success_rate": 98.5 if req.num_deliveries <= req.num_vehicles * req.vehicle_capacity else 75.0,
            "optimization_score": int(optimization_score)
        }
    }
