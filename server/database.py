from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv
load_dotenv()

# Use DATABASE_URL env var (Neon/Render) or fall back to local Docker DB
URL_DATABASE = os.getenv(
    "DATABASE_URL",
    "postgresql://myuser:mypassword@db:5432/mydatabase"
)

# Neon uses ?sslmode=require — SQLAlchemy needs connect_args for SSL
connect_args = {}
if "neon.tech" in URL_DATABASE or "sslmode=require" in URL_DATABASE:
    connect_args = {"sslmode": "require"}

engine = create_engine(URL_DATABASE, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=engine)

Base = declarative_base()
