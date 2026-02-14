from fastapi import FastAPI
from datetime import datetime, timezone

from app.routers.roles import router as roles_router
from app.routers.users import router as users_router
from app.routers.auth import router as auth_router

app = FastAPI()
app.include_router(roles_router)
app.include_router(users_router)
app.include_router(auth_router)

@app.get("/")
def root():
    now = datetime.now(timezone.utc)
    return {"status": "ok", "datetime_utc": now.isoformat()}
