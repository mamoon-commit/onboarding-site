from fastapi import APIRouter, HTTPException
from app.models.user import LoginRequest
from app.core.database import users_collection
from app.core.security import verify_password, create_access_token
from datetime import datetime

router = APIRouter(prefix="/api/auth", tags=["authentication"])

@router.post("/login")
def login(login_data: LoginRequest):
    # Find user by email
    user = users_collection.find_one({"email": login_data.email})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check password
    if not verify_password(login_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Wrong password")
    #update the last_login
    users_collection.update_one({"_id": user["_id"]},
     {"$set": {"last_login": datetime.utcnow().isoformat()}})
    # Create JWT token
    access_token = create_access_token(
        data={"user_id": str(user["_id"]), "email": user["email"]}
    )

    # Success!
    return {
        "message": "Login successful!",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }