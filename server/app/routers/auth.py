from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.db.models import User
from app.schemas.auth import LoginRequest, TokenResponse
from app.core.security import verify_password, create_access_token, JWT_SECRET, JWT_ALGORITHM

router = APIRouter(prefix="/auth", tags=["auth"])
bearer_scheme = HTTPBearer(auto_error=False)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()

    # ensure role is available
    stmt = select(User).options(selectinload(User.role)).where(User.email == email)
    user = db.scalar(stmt)

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(
        subject=str(user.id),
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role.name,
        role_id=user.role_id,
    )
    return TokenResponse(access_token=token)


def get_current_user_claims(
    creds: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> dict:
    if creds is None or creds.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    try:
        return jwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.get("/me")
def me(claims: dict = Depends(get_current_user_claims)):
    return {
        "sub": claims.get("sub"),
        "id": claims.get("id"),
        "name": claims.get("name"),
        "email": claims.get("email"),
        "role": claims.get("role"),
        "role_id": claims.get("role_id"),
        "iat": claims.get("iat"),
        "exp": claims.get("exp"),
    }
