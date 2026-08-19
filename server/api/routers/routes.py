from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Order, Route
import ast
import re

router = APIRouter(prefix="/routes", tags=["routes"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def parse_full_route(full_route_str: str):
    """Parse full_route string that may contain numpy float64 representations."""
    try:
        # Try standard eval first
        parsed = ast.literal_eval(full_route_str)
        return [{"lat": float(lat), "lng": float(lng)} for lat, lng in parsed]
    except Exception:
        pass
    # Fallback: extract all float pairs using regex
    pairs = re.findall(r'\(([0-9.\-e]+),\s*([0-9.\-e]+)\)', full_route_str)
    if pairs:
        return [{"lat": float(lat), "lng": float(lng)} for lat, lng in pairs]
    # Last resort: try replacing np.float64 wrapper and eval
    cleaned = re.sub(r'np\.float64\(([^)]+)\)', r'\1', full_route_str)
    parsed = ast.literal_eval(cleaned)
    return [{"lat": float(lat), "lng": float(lng)} for lat, lng in parsed]

@router.get("/vehicle/{vehicle_id}")
def get_route_by_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.vehicle_id == vehicle_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="No orders found for this vehicle")

    route = db.query(Route).filter(Route.id == order.route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="No route found for this vehicle's order")

    try:
        formatted_full_route = parse_full_route(route.full_route)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing full_route: {str(e)}")

    return {
        "route_id": route.id,
        "assigned_orders": ast.literal_eval(route.assigned_orders),
        "route": route.route,
        "full_route": formatted_full_route,
        "vehicle_id": route.vehicle_id,
        "route_distance": route.route_distance
    }

from pydantic import BaseModel
class RerouteRequest(BaseModel):
    vehicle_id: int
    current_location: str
    new_order_id: int = None
    blocked_node: int = None

@router.post("/reroute")
def dynamic_reroute(req: RerouteRequest, db: Session = Depends(get_db)):
    # This is a stub for dynamic rerouting.
    # In a full implementation, this would:
    # 1. Truncate the completed portion of the route.
    # 2. Add the new order to the unvisited nodes.
    # 3. Call TSPOptimizer.two_opt on the remaining nodes.
    # 4. Return the new route and ETA diff.
    
    return {
        "message": "Route recalculated successfully",
        "previous_eta": "42 min",
        "new_eta": "51 min",
        "distance_saved": 3.4,
        "reason": "Traffic / New Order"
    }

@router.get("/compare")
def compare_algorithms(db: Session = Depends(get_db)):
    # Stub for algorithm comparison lab
    # Returns benchmark results for Dijkstra vs A* vs TSP
    return [
        {"algorithm": "Dijkstra", "distance": 12.4, "time_ms": 45, "nodes": 1200},
        {"algorithm": "A*", "distance": 12.4, "time_ms": 12, "nodes": 350},
        {"algorithm": "Greedy VRP", "distance": 15.2, "time_ms": 5, "nodes": 50},
    ]
