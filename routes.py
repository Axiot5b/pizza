from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config import SessionLocal
from models import Mesa, Pedido, Bebida, Pizza, Producto
from websocket import notify_admin
from pydantic import BaseModel
import logging
from sqlalchemy import func
from datetime import date

# Configurar el logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class BebidaCreate(BaseModel):
    nombre: str
    marca: str
    tamaño: str
    precio: float

class PizzaCreate(BaseModel):
    nombre: str
    tamaño: str
    precio: float

class PedidoCreate(BaseModel):
    mesa_id: int
    items: list
    total: float

class ProductoCreate(BaseModel):
    nombre: str
    categoria: str
    precio: float

class PagarPedidoRequest(BaseModel):
    pedido_id: int


@router.post("/productos/")
def crear_producto(producto: ProductoCreate, db: Session = Depends(get_db)):
    db_producto = Producto(**producto.dict())
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    return db_producto

@router.get("/productos/")
def obtener_productos(db: Session = Depends(get_db)):
    productos = db.query(Producto).all()
    return productos

@router.post("/bebidas/")
def crear_bebida(bebida: BebidaCreate, db: Session = Depends(get_db)):
    db_bebida = Bebida(**bebida.dict())
    db.add(db_bebida)
    db.commit()
    db.refresh(db_bebida)
    return db_bebida

@router.post("/pizzas/")
def crear_pizza(pizza: PizzaCreate, db: Session = Depends(get_db)):
    db_pizza = Pizza(**pizza.dict())
    db.add(db_pizza)
    db.commit()
    db.refresh(db_pizza)
    return db_pizza

@router.get("/mesas/")
def obtener_mesas(db: Session = Depends(get_db)):
    mesas = db.query(Mesa).all()
    return mesas

@router.get("/pedidos/")
def obtener_pedidos(db: Session = Depends(get_db)):
    pedidos = db.query(Pedido).all()
    return pedidos

@router.get("/ventas/")
def obtener_ventas(db: Session = Depends(get_db)):
    ventas = (
        db.query(
            func.date(Pedido.created_at).label("fecha"),
            func.sum(Pedido.total).label("total")
        )
        .filter(Pedido.estado == "pagado")
        .group_by(func.date(Pedido.created_at))
        .all()
    )
    return [{"fecha": str(v[0]), "total": v[1]} for v in ventas]

@router.post("/pagar_pedido/")
def pagar_pedido(request: PagarPedidoRequest, db: Session = Depends(get_db)):
    pedido = db.query(Pedido).filter(Pedido.id == request.pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    # Aquí puedes agregar la lógica para procesar el pago
    # Por ejemplo, cambiar el estado del pedido a "pagado"
    pedido.estado = "pagado"
    db.commit()
    db.refresh(pedido)

    return {"message": "Pedido pagado con éxito", "pedido": pedido}

@router.post("/pedidos/")
async def crear_pedido(pedido: PedidoCreate, db: Session = Depends(get_db)):
    try:
        # Verificar que items sea una lista
        if not isinstance(pedido.items, list):
            raise HTTPException(status_code=400, detail="Items debe ser una lista")

        items_str = ",".join(pedido.items)  # Convertir la lista de ítems en una cadena de texto
        db_pedido = Pedido(mesa_id=pedido.mesa_id, items=items_str, total=pedido.total)
        db.add(db_pedido)
        db.commit()
        db.refresh(db_pedido)

        # Notificar al administrador
        await notify_admin(f"🔔 Nuevo pedido en Mesa {pedido.mesa_id} - Items: {items_str} - Total: {pedido.total}")

        return db_pedido
    except Exception as e:
        logger.error(f"Error al crear pedido: {e}")
        raise HTTPException(status_code=500, detail=str(e))
