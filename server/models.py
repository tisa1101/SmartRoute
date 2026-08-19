from sqlalchemy import Column, Integer, Float, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    priority = Column(Integer, nullable=False)  # e.g., 5=Emergency, 1=Low
    name = Column(String, nullable=False)
    weight = Column(Float, nullable=False)
    delivery_coordinates = Column(String, nullable=False)
    order_datetime = Column(DateTime, nullable=False, default=datetime.utcnow)
    status = Column(String, default='pending')
    delivery_distance = Column(Float, nullable=True) 
    estimate_delivery_time = Column(String, nullable=True)
    
    # New Fields for RouteX
    delivery_window_start = Column(DateTime, nullable=True)
    delivery_window_end = Column(DateTime, nullable=True)
    customer_importance = Column(Integer, default=1)
    actual_delivery_time = Column(DateTime, nullable=True)

    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=True)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=True)
    
    def __lt__(self, other):
        return self.priority < other.priority 
    
    def __repr__(self):
        return f"Order(id={self.id}, name={self.name}, weight={self.weight}, status={self.status})"

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="Unknown Vehicle")
    type = Column(String, default="Van")  # Bike, Car, Van, Truck, Electric Van
    capacity = Column(Float, nullable=False) # Package count capacity or generic capacity
    
    # New Fields for RouteX
    weight_limit = Column(Float, default=500.0)
    speed_factor = Column(Float, default=1.0)
    fuel_efficiency = Column(Float, default=10.0) # km per liter or kWh
    operating_cost = Column(Float, default=5.0) # cost per km
    available = Column(Boolean, default=True)

    assigned_orders = relationship("Order", backref="vehicle")
    assigned_routes = relationship("Route", backref="vehicle")

    def __repr__(self):
        return f"Vehicle(id={self.id}, type={self.type}, capacity={self.capacity}, available={self.available})"

class Route(Base):
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, index=True)
    assigned_orders = Column(String, nullable=False)
    route = Column(String, nullable=False)  # JSON or comma-separated list of warehouse & delivery coordinates
    full_route = Column(String, nullable=False)  # JSON or comma-separated list of all coordinates
    route_distance = Column(Float, nullable=False)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=True)
    
    def __repr__(self):
        return f"Route(id={self.id}, vehicle_id={self.vehicle_id})"

class OptimizationRun(Base):
    __tablename__ = "optimization_runs"
    
    id = Column(Integer, primary_key=True, index=True)
    run_datetime = Column(DateTime, default=datetime.utcnow)
    algorithm_used = Column(String, nullable=False)
    total_distance = Column(Float, nullable=False)
    total_eta_minutes = Column(Float, nullable=False)
    vehicles_used = Column(Integer, nullable=False)
    optimization_score = Column(Float, nullable=True)

class AlgorithmBenchmark(Base):
    __tablename__ = "algorithm_benchmarks"
    
    id = Column(Integer, primary_key=True, index=True)
    algorithm = Column(String, nullable=False) # Dijkstra, A*, TSP, VRP
    dataset_size = Column(Integer, nullable=False)
    execution_time_ms = Column(Float, nullable=False)
    route_distance = Column(Float, nullable=False)
    nodes_explored = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class DeliveryHistory(Base):
    __tablename__ = "delivery_history"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, nullable=False)
    vehicle_id = Column(Integer, nullable=False)
    route_id = Column(Integer, nullable=False)
    distance = Column(Float, nullable=False)
    eta = Column(String, nullable=False)
    actual_delivery_time = Column(DateTime, nullable=True)
    status = Column(String, nullable=False)
    algorithm = Column(String, nullable=False)
    optimization_score = Column(Float, nullable=True)
