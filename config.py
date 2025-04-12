from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 🔥 URL de la base de datos Neon PostgreSQL (con SSL)
DATABASE_URL = "postgresql://neondb_owner:npg_ayc4PdNuOqD1@ep-steep-cherry-a4e6n5of-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

# 🚀 Crear motor de la base de datos
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# 🛠 Configurar sesión de SQLAlchemy
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 📦 Base para modelos ORM
Base = declarative_base()
