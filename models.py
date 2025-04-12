from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float
from sqlalchemy.orm import relationship
from config import Base
from sqlalchemy.sql import func
from sqlalchemy import DateTime

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    rol = Column(String, default="mesero")

class Mesa(Base):
    __tablename__ = "mesas"

    id = Column(Integer, primary_key=True, index=True)
    numero = Column(Integer, unique=True, index=True)
    ocupada = Column(Boolean, default=False)

class Pedido(Base):
    __tablename__ = "pedidos"
    id = Column(Integer, primary_key=True, index=True)
    mesa_id = Column(Integer, index=True)
    items = Column(String, nullable=False)
    estado = Column(String, default="pendiente")
    total = Column(Float, nullable=False)
    created_at = Column(DateTime, server_default=func.now())  # Nueva columna

class Producto(Base):
    __tablename__ = "productos"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    categoria = Column(String, index=True)  # Campo para la categoría del producto
    precio = Column(Float, nullable=False)

class Bebida(Base):
    __tablename__ = "bebidas"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    marca = Column(String)
    tamaño = Column(String)  # lata, litro, medio litro
    precio = Column(Float)

class Pizza(Base):
    __tablename__ = "pizzas"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    tamaño = Column(String)  # 8 pulgadas, 12 pulgadas
    precio = Column(Float)