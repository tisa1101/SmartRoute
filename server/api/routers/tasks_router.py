from fastapi import APIRouter
from celery.result import AsyncResult

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/{task_id}")
def get_task_status(task_id: str):
    task_result = AsyncResult(task_id)
    response = {
        "task_id": task_id,
        "status": task_result.status,
    }
    
    if task_result.status == "SUCCESS":
        response["result"] = task_result.result
    elif task_result.status == "FAILURE":
        response["error"] = str(task_result.info)
    elif task_result.status == "PROCESSING":
        response["meta"] = task_result.info

    return response
