from fastapi import APIRouter, UploadFile, Depends, HTTPException, File
from core.config import R2_BUCKET, R2_ENDPOINT, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
from botocore.client import Config
from sqlalchemy.orm import Session
from db.db import get_db, save_file, get_file_by_id
from fastapi.responses import JSONResponse
from schemas.schemas import DownloadResponse, UploadResponse
import boto3
import pathlib
import uuid
import logging

router = APIRouter()

s3 = boto3.client(
    's3',
    endpoint_url=R2_ENDPOINT,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    config=Config(signature_version='s3v4')
)

logger = logging.getLogger(__name__)

@router.put(
    '/uploads',
    status_code=201,
    response_model=UploadResponse,
    summary='File upload',
    description='Upload a file to Cloudflare R2 and save it to the database'
)
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        ext = pathlib.Path(file.filename).suffix
        file_key = f'{uuid.uuid4()}{ext}'

        s3.upload_fileobj(
            Fileobj=file.file,
            Bucket=R2_BUCKET,
            Key=file_key,
            ExtraArgs={ 'ContentType': file.content_type or 'application/octet-stream' }
        )

        db_file = save_file(
            db,
            name=file.filename,
            key=file_key,
            content_type=file.content_type or 'application/octet-stream',
        )

        return JSONResponse(status_code=201, content={ 'file_id': db_file.id })
    except Exception as e:
        logger.error(f'Upload failed: {e}')
        raise HTTPException(status_code=500, detail=f'Upload failed: {e}')

@router.get(
    '/downloads/{file_id}',
    status_code=200,
    response_model=DownloadResponse,
    summary='Generate download URL',
    description='Generates a temporary URL to download a file'
)
async def get_download_url(file_id: str, db: Session = Depends(get_db)):
    db_file = get_file_by_id(db, file_id)

    if not db_file:
        raise HTTPException(status_code=404, detail=f'File not found: {file_id}')

    try:
        signed_url = s3.generate_presigned_url(
            ClientMethod='get_object',
            Params={
                'Bucket': R2_BUCKET,
                'Key': db_file.key
            },
            ExpiresIn=600
        )

        return JSONResponse(status_code=200, content={ 'download_url': signed_url })
    except Exception as e:
        logger.error(f'Generate download URL failed: {e}')
        raise HTTPException(status_code=500, detail=f'Generate download URL failed: {e}')
