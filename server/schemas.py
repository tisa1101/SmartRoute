from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OrderCreate(BaseModel):
    name: str
    priority: int
    weight: float
    delivery_coordinates: dict
    order_datetime: Optional[datetime] = None
    status: Optional[str] = 'pending'
    delivery_distance: Optional[float] = None
    estimate_delivery_time: Optional[str] = None
    delivery_window_start: Optional[datetime] = None
    delivery_window_end: Optional[datetime] = None
    customer_importance: Optional[int] = 1
    vehicle_id: Optional[int] = None
    route_id: Optional[int] = None

class OrderResponse(OrderCreate):
    id: int
    actual_delivery_time: Optional[datetime] = None

    class Config:
        orm_mode = True

class OrderRequest(BaseModel):
    order_ids: List[int]

class VehicleCreate(BaseModel):
    name: Optional[str] = "Unknown Vehicle"
    type: Optional[str] = "Van"
    capacity: float
    weight_limit: Optional[float] = 500.0
    speed_factor: Optional[float] = 1.0
    fuel_efficiency: Optional[float] = 10.0
    operating_cost: Optional[float] = 5.0
    available: Optional[bool] = True

class VehicleResponse(VehicleCreate):
    id: int

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    email: str
    password: str
    role: Optional[str] = 'user'

class UserResponse(BaseModel):
    id: int
    email: str
    role: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

