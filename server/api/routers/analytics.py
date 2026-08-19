from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Order, Vehicle

router = APIRouter(prefix="/analytics", tags=["analytics"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/dashboard-stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_orders = db.query(Order).count()
    pending_orders = db.query(Order).filter(Order.status == "pending").count()
    total_vehicles = db.query(Vehicle).count()
    vehicles_with_in_process_orders = (
        db.query(Vehicle)
        .join(Order, Vehicle.id == Order.vehicle_id)
        .filter(Order.status == "in-process")
        .distinct()
        .count()
    )

    return {
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "total_vehicles": total_vehicles,
        "vehicles_with_in_process_orders": vehicles_with_in_process_orders
    }
