from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import get_db
from app.db.models import Role
from app.schemas.roles import RoleCreate, RoleOut

router = APIRouter(prefix="/roles", tags=["roles"])

DEFAULT_ROLES = ["admin", "manager", "deliverer"]

def seed_roles(db: Session) -> dict:
    existing = set(
        db.scalars(select(Role.name).where(Role.name.in_(DEFAULT_ROLES))).all()
    )

    created = []
    for name in DEFAULT_ROLES:
        if name not in existing:
            db.add(Role(name=name))
            created.append(name)

    if created:
        db.commit()

    return {"created": created, "already_present": sorted(existing)}

@router.get("", response_model=list[RoleOut])
def list_roles(db: Session = Depends(get_db)):
    roles = db.scalars(select(Role).order_by(Role.name)).all()
    return roles

@router.post("", response_model=RoleOut, status_code=status.HTTP_201_CREATED)
def create_role(payload: RoleCreate, db: Session = Depends(get_db)):
    name = payload.name.strip().lower()
    if not name:
        raise HTTPException(status_code=400, detail="Role name cannot be empty")

    exists = db.scalar(select(Role).where(Role.name == name))
    if exists:
        raise HTTPException(status_code=409, detail="Role already exists")

    role = Role(name=name)
    db.add(role)
    db.commit()
    db.refresh(role)
    return role

@router.post("/seed")
def seed_default_roles(db: Session = Depends(get_db)):
    return seed_roles(db)
