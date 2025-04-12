from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
import logging

# Configurar el logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()
active_connections: List[WebSocket] = []

@router.websocket("/ws/admin")
async def websocket_admin(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    logger.info(f"New WebSocket connection accepted. Total connections: {len(active_connections)}")
    try:
        while True:
            try:
                await websocket.receive_text()  # Mantiene la conexión abierta
            except WebSocketDisconnect:
                logger.info("WebSocket disconnected")
                break
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        active_connections.remove(websocket)
        logger.info(f"WebSocket connection closed. Remaining connections: {len(active_connections)}")

async def notify_admin(message: str):
    for connection in active_connections:
        try:
            await connection.send_text(message)
        except Exception as e:
            logger.error(f"Error sending message to WebSocket: {e}")
