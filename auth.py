# auth.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from pydantic import BaseModel
from datetime import datetime, timedelta
import jwt
from config import SessionLocal
from models import Usuario
from fastapi import APIRouter, HTTPException, Depends, Response
from fastapi.middleware.cors import CORSMiddleware

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuración para JWT
SECRET_KEY = "supersecreto"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Define el modelo para la petición
class UserCreate(BaseModel):
    nombre: str
    password: str
    rol: str = "mesero"

class LoginData(BaseModel):
    nombre: str
    password: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_jwt_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Asegúrate de que estás usando el modelo Pydantic como cuerpo de la petición
@router.post("/register/")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = pwd_context.hash(user.password)
    usuario = Usuario(nombre=user.nombre, hashed_password=hashed_password, rol=user.rol)

    db.add(usuario)
    db.commit()
    return {"message": "Usuario registrado"}

@router.post("/login/")
async def login_user(login_data: LoginData, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.nombre == login_data.nombre).first()
    if not usuario or not pwd_context.verify(login_data.password, usuario.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    token = create_jwt_token(
        {"sub": usuario.nombre, "rol": usuario.rol},
        timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": token, "token_type": "bearer"}