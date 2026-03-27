from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.db import engine, Base
from app.routers import pins

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title="GeoVlog API", lifespan=lifespan)
app.include_router(pins.router)

@app.get("/")
async def root():
    return {"status": "ok"}

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)