from pydantic import BaseModel, field_validator
import uuid
from datetime import datetime

class PinCreate(BaseModel):
    title: str
    description: str | None = None
    latitude: float
    longitude: float
    video_url: str | None = None

class PinResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: str | None
    latitude: float
    longitude: float
    video_url: str | None
    created_at: datetime

    model_config = {"from_attributes": True}