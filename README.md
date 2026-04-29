# 🚀 File upload API
A Restful API for file upload and download built with FastAPI, using Cloudflare R2 (S3 compatible storage) and SQLite for metadata persistence.

## 📌 Features
- Upload files to Cloudflare R2
- Generate secure pre-signed download URLs
- Store file metadata in database
- Fast and async API with FastAPI
- Auto-generate API docs (Swagger & ReDoc)

## 🛠️ Technologies
- **FastAPI** - Web framework
- **SQLAlchemy** - ORM
- **Boto3** - S3 Integration
- **Cloudflare R2** - Object storage
- **SQLite** - Database
- **Python-dotenv** - Environment variables

## 🗂️ Project structure
```md
file-upload/
    - app/
        - api/      # API routes
        - core/     # Configurations
        - db/       # Database setup
        - models/   # Database models
        - schemas/  # Pydantic schemas
        - main.py   # App entrypoint
```

## ⚙️ Setup
1. Clone repository
```bash
git clone https://github.com/fellipe27/file-upload.git
cd file-upload
```

2. Create virtual environment
```bash
python -m venv .venv
source .venv/bin/activate    # Linux/Mac
.venv\Scripts\Activate       # Windows
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Environment variables
Create a .env file based on .env.example:
```bash
R2_BUCKET=your-bucket-name
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
DATABASE_URL=sqlite:///./database.db
```

## ▶️ Running the app
```bash
py app/main.py
```

## 📚 API documentation
- [Swagger UI](http://127.0.0.1:8000/docs)
- [ReDoc](http://127.0.0.1:8000/redoc)

### Upload file
Endpoint:
```bash
PUT /uploads

Request:
Form-data -> file

Response:
{
    "file_id": "uuid"
}
```

### Download file
Endpoint:
```bash
GET /downloads/{file_id}

Response:
{
    "download_url": "signed-url"
}
```

## 🔐 Security
- Environment variables are stored in .env
- Sensitive data is not committed
- Download links are time-limited (presigned URLs)

## 📄 License
MIT

## 👨‍💻 Author
Developed by **Paulo Fellipe**
