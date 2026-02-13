from logging.config import fileConfig
import os

from alembic import context
from sqlalchemy import engine_from_config, pool

# ---- EDIT THESE IMPORTS to match your project ----
# Example:
# from app.db.base import Base
# from app.db import models  # noqa: F401  (import so Base.metadata is populated)

from app.db.base import Base          # <-- change this
from app.db import models             # <-- change this (or import each model module)
# -------------------------------------------------

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Use env var if available, otherwise whatever is in alembic.ini
DATABASE_URL = os.getenv("DATABASE_URL") or "postgresql+psycopg2://appuser:change-me-very-strong@127.0.0.1:5433/appdb"
config.set_main_option("sqlalchemy.url", DATABASE_URL)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
