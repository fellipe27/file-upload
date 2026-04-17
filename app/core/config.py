from dotenv import load_dotenv
import os

load_dotenv()

R2_BUCKET = os.getenv('R2_BUCKET')
R2_ENDPOINT = os.getenv('R2_ENDPOINT')
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
DATABASE_URL = os.getenv('DATABASE_URL')
