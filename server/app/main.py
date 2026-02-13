from fastapi import FastAPI
from datetime import datetime, timezone

from app.routers.roles import router as roles_router

app = FastAPI()
app.include_router(roles_router)

@app.get("/")
def root():
    now = datetime.now(timezone.utc)
    return {"status": "ok", "datetime_utc": now.isoformat()}
