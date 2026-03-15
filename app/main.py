from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import database, routes

app = FastAPI(title="Full CRUD Blog API")

# Initialize database (creates tables automatically)
database.init_db()

# Add CORS Middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router, prefix="/api/v1")