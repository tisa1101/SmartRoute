from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv
load_dotenv()

# Strictly require DATABASE_URL from environment, fallback to SQLite if missing
URL_DATABASE = os.environ.get("DATABASE_URL")
if not URL_DATABASE:
    print("WARNING: DATABASE_URL environment variable is missing. Falling back to SQLite.")
    URL_DATABASE = "sqlite:///./sql_app.db"

# Neon uses ?sslmode=require — SQLAlchemy needs connect_args for SSL
connect_args = {}
if "neon.tech" in URL_DATABASE or "sslmode=require" in URL_DATABASE:
    connect_args = {"sslmode": "require"}

engine = create_engine(URL_DATABASE, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=engine)

Base = declarative_base()
