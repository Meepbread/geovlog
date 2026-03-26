from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from geoalchemy2.functions import ST_X, ST_Y, ST_GeomFromText
import uuid

from app.db import get_db
from app.models import Pin
from app.schemas import PinCreate, PinResponse

router = APIRouter(prefix="/pins", tags=["pins"])


def _to_response(pin: Pin, lat: float, lng: float) -> PinResponse:
    return PinResponse(
        id=pin.id,
        title=pin.title,
        description=pin.description,
        latitude=lat,
        longitude=lng,
        video_url=pin.video_url,
        created_at=pin.created_at,
    )


@router.post("/", response_model=PinResponse, status_code=201)
async def create_pin(body: PinCreate, db: AsyncSession = Depends(get_db)):
    wkt = f"POINT({body.longitude} {body.latitude})"
    pin = Pin(
        title=body.title,
        description=body.description,
        location=ST_GeomFromText(wkt, 4326),
        video_url=body.video_url,
    )
    db.add(pin)
    await db.commit()
    await db.refresh(pin)
    return _to_response(pin, body.latitude, body.longitude)


@router.get("/", response_model=list[PinResponse])
async def list_pins(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Pin, ST_Y(Pin.location).label("lat"), ST_X(Pin.location).label("lng"))
    )
    return [_to_response(pin, lat, lng) for pin, lat, lng in result.all()]


@router.get("/{pin_id}", response_model=PinResponse)
async def get_pin(pin_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Pin, ST_Y(Pin.location).label("lat"), ST_X(Pin.location).label("lng"))
        .where(Pin.id == pin_id)
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Pin not found")
    pin, lat, lng = row
    return _to_response(pin, lat, lng)


@router.delete("/{pin_id}", status_code=204)
async def delete_pin(pin_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Pin).where(Pin.id == pin_id))
    pin = result.scalar_one_or_none()
    if not pin:
        raise HTTPException(status_code=404, detail="Pin not found")
    await db.delete(pin)
    await db.commit()