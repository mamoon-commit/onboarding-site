import uvicorn
from bson import ObjectId
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import users_collection, db, client
from app.models.user import UserCreate, UserResponse, LoginRequest, UpdateRole
from app.core.security import hash_password, verify_password, create_access_token, verify_token
from app.api import auth, users, document

# Create FastAPI app
app = FastAPI()

# Add CORS middleware
origins = [
    "http://localhost:3000",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(document.router)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)