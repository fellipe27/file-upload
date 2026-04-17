from fastapi import FastAPI
from uvicorn import run
from db.database import engine
from api.routes import router
from models import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title='File upload API',
    description='API for uploading files using FastAPI and Cloudflare R2',
    version='1.0.0'
)

app.include_router(router)

if __name__ == '__main__':
    run('main:app', host='127.0.0.1', port=8000, reload=True)
