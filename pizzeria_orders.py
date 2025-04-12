from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from routes import router
from websocket import router as websocket_router
from auth import router as auth_router

app = FastAPI(title="Pizzería Orders API")

# 🔥 Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Cambia esto según tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(auth_router)
app.include_router(websocket_router)

@app.get("/")
def home():
    return {"message": "Bienvenido a Pizzería Orders API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
