from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.db.session import get_db
from app.db.models import User, Role

router = APIRouter(prefix="/users", tags=["users"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DEFAULT_USERS = [
    # admin
    {
        "name": "John Doe",
        "email": "john.doe@local",
        "password": "johndoe",
        "role": "admin",
    },
    # managers
    {
        "name": "Manager One",
        "email": "manager1@local",
        "password": "manager1",
        "role": "manager",
    },
    {
        "name": "Manager Two",
        "email": "manager2@local",
        "password": "manager2",
        "role": "manager",
    },
    # deliverers
    {
        "name": "Deliverer One",
        "email": "deliverer1@local",
        "password": "deliverer1",
        "role": "deliverer",
    },
    {
        "name": "Deliverer Two",
        "email": "deliverer2@local",
        "password": "deliverer2",
        "role": "deliverer",
    },
    {
        "name": "Deliverer Three",
        "email": "deliverer3@local",
        "password": "deliverer3",
        "role": "deliverer",
    },
    {
        "name": "Deliverer Four",
        "email": "deliverer4@local",
        "password": "deliverer4",
        "role": "deliverer",
    },
]

DEFAULT_ROLES = ["admin", "manager", "deliverer"]


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def ensure_roles(db: Session) -> dict[str, int]:
    # Create missing roles (safe/idempotent)
    existing_roles = db.scalars(select(Role).where(Role.name.in_(DEFAULT_ROLES))).all()
    by_name = {r.name: r for r in existing_roles}

    created = False
    for name in DEFAULT_ROLES:
        if name not in by_name:
            r = Role(name=name)
            db.add(r)
            by_name[name] = r
            created = True

    if created:
        db.commit()
        # refresh to get ids
        for r in by_name.values():
            db.refresh(r)

    return {name: role.id for name, role in by_name.items()}


@router.post("/seed")
def seed_users(db: Session = Depends(get_db)):
    role_ids = ensure_roles(db)

    created_emails: list[str] = []
    skipped_emails: list[str] = []

    for u in DEFAULT_USERS:
        email = u["email"].strip().lower()
        name = u["name"].strip()
        role_name = u["role"].strip().lower()

        if role_name not in role_ids:
            raise HTTPException(status_code=500, detail=f"Missing role: {role_name}")

        exists = db.scalar(select(User).where(User.email == email))
        if exists:
            skipped_emails.append(email)
            continue

        user = User(
            name=name,
            email=email,
            hashed_password=hash_password(u["password"]),
            role_id=role_ids[role_name],
        )
        db.add(user)
        created_emails.append(email)

    if created_emails:
        db.commit()

    return {
        "created": created_emails,
        "skipped": skipped_emails,
        "note": "Passwords for seeded users are set in code; change/remove this endpoint for production.",
    }


@router.get("")
def list_users(db: Session = Depends(get_db)):
    users = db.scalars(select(User).order_by(User.id)).all()
    return [
        {"id": u.id, "name": u.name, "email": u.email, "role_id": u.role_id}
        for u in users
    ]
