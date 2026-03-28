import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.db import get_db
from app.models import Pin
from app.s3 import generate_presigned_url, get_video_url

router = APIRouter(prefix="/videos", tags=["videos"])


class PresignedUrlRequest(BaseModel):
    pin_id: uuid.UUID
    filename: str


class PresignedUrlResponse(BaseModel):
    upload_url: str
    object_key: str


@router.post("/presigned-url", response_model=PresignedUrlResponse)
async def get_presigned_url(
    body: PresignedUrlRequest,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Pin).where(Pin.id == body.pin_id))
    pin = result.scalar_one_or_none()
    if not pin:
        raise HTTPException(status_code=404, detail="Pin not found")

    object_key = f"videos/{body.pin_id}/{uuid.uuid4()}.mp4"
    upload_url = generate_presigned_url(object_key)

    return PresignedUrlResponse(upload_url=upload_url, object_key=object_key)


@router.post("/confirm")
async def confirm_upload(
    pin_id: uuid.UUID,
    object_key: str,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Pin).where(Pin.id == pin_id))
    pin = result.scalar_one_or_none()
    if not pin:
        raise HTTPException(status_code=404, detail="Pin not found")

    pin.video_url = get_video_url(object_key)
    await db.commit()
    return {"video_url": pin.video_url}