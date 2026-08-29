from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import SessionLocal
from models import Order
from schemas import OrderCreate, OrderResponse, OrderRequest
from order_manager import OrderManager
from datetime import datetime

router = APIRouter(prefix="/orders", tags=["orders"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=OrderResponse)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    if order.order_datetime is None:
        order.order_datetime = datetime.utcnow()

    db_order = Order(
        name=order.name,
        priority=order.priority,
        weight=order.weight,
        delivery_coordinates=order.delivery_coordinates,
        order_datetime=order.order_datetime,
        status=order.status,
        estimate_delivery_time=order.estimate_delivery_time,
        delivery_window_start=order.delivery_window_start,
        delivery_window_end=order.delivery_window_end,
        customer_importance=order.customer_importance,
        vehicle_id=order.vehicle_id,
        route_id=order.route_id
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    import os
    # If REDIS_URL is set (meaning we are running with Celery), use the background task.
    # Otherwise, fallback to synchronous execution so it doesn't crash on free-tier Render.
    if os.environ.get("REDIS_URL"):
        from tasks import run_order_assignment
        run_order_assignment.delay()
    else:
        try:
            manager = OrderManager(db)
            manager.assign_orders()
        except Exception as e:
            print(f"Failed to auto-assign: {e}")

    return db_order

@router.get("/", response_model=List[OrderResponse])
def get_orders(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Order).offset(skip).limit(limit).all()

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@router.post("/list/", response_model=List[OrderResponse])
def get_orders_list(order_request: OrderRequest, db: Session = Depends(get_db)):
    order_ids = order_request.order_ids
    orders = db.query(Order).filter(Order.id.in_(order_ids)).all()
    order_dict = {order.id: order for order in orders}
    missing_ids = [oid for oid in order_ids if oid not in order_dict]
    if missing_ids:
        raise HTTPException(status_code=404, detail=f"Orders not found for IDs: {missing_ids}")
    return [order_dict[oid] for oid in order_ids]
