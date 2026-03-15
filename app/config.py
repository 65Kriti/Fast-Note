import os
from dotenv import load_dotenv

load_dotenv()

# Defaults to local SQLite if DATABASE_URL is not found in the .env file
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")