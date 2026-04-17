from db.database import Base
from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
import uuid

class File(Base):
    __tablename__ = 'files'

    id = Column(String, primary_key=True, unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    key = Column(String, nullable=False, unique=True)
    content_type = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
