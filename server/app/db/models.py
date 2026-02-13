from datetime import datetime
from sqlalchemy import ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base


class Role(Base):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, index=True)

    users: Mapped[list["User"]] = relationship(
        back_populates="role",
        lazy="selectin",
    )


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    name: Mapped[str] = mapped_column(String(120), nullable=False)

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)

    role_id: Mapped[int] = mapped_column(
        ForeignKey("roles.id", ondelete="RESTRICT"),
        index=True,
        nullable=False,
    )

    role: Mapped["Role"] = relationship(
        back_populates="users",
        lazy="selectin",
    )

    deliveries: Mapped[list["Delivery"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class Delivery(Base):
    __tablename__ = "deliveries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)

    status: Mapped[str] = mapped_column(String(30), default="pending", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    user: Mapped["User"] = relationship(back_populates="deliveries")
