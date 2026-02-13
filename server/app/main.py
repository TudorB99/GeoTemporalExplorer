from fastapi import FastAPI
from datetime import datetime, timezone


app = FastAPI()

@app.get("/")
def root():
    now = datetime.now(timezone.utc)
    return {"status": "ok", "datetime_utc": now.isoformat()}