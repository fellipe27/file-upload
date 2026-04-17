from db.database import SessionLocal
from sqlalchemy.orm import Session
from typing import Generator
from models import models

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

def save_file(db: Session, name: str, key: str, content_type: str) -> models.File:
    db_file = models.File(name=name, key=key, content_type=content_type)

    db.add(db_file)
    db.commit()
    db.refresh(db_file)

    return db_file

def get_file_by_id(db: Session, file_id: str) -> models.File:
    return db.query(models.File).filter(models.File.id == file_id).first()
