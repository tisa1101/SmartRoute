from worker import celery_app
from database import SessionLocal
from order_manager import OrderManager
import traceback

@celery_app.task(bind=True)
def run_order_assignment(self):
    """
    Executes the heavy Dijkstra and TSP algorithms in a background Celery worker.
    """
    db = SessionLocal()
    try:
        self.update_state(state="PROCESSING", meta={"progress": "Computing optimal routes..."})
        manager = OrderManager(db)
        manager.assign_orders()
        return {"status": "success", "message": "Routes successfully optimized via Celery"}
    except Exception as e:
        return {"status": "failed", "error": str(e), "traceback": traceback.format_exc()}
    finally:
        db.close()
