from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId

from app.models.user import UserCreate, UpdateRole, UserUpdate
from app.core.database import users_collection
from app.core.security import hash_password, verify_token
from datetime import datetime

router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("/create")
def create_user(user_data: UserCreate, current_user = Depends(verify_token)):
    user = users_collection.find_one({"email": current_user["email"]})

    if not user or user["role"] not in ["hr", "manager"]:
        return {"error": "not enough privileges"}
    
    # Hash the password
    hashed_password = hash_password(user_data.password)
    
    # Create user document for MongoDB
    user_doc = {
        "name": user_data.name,
        "employee_id": user_data.employee_id,
        "email": user_data.email,
        "password": hashed_password,
        "phone": user_data.phone,
        "emergency_contact": user_data.emergency_contact,
        "address": user_data.address,
        "manager_id": user_data.manager_id,
        "role": user_data.role,
        "isActive": user_data.isActive,
        "position": user_data.position,
        "department": user_data.department,
        "status": user_data.status,
        "employment_type": user_data.employment_type,
        "last_login": None,
        "start_date": user_data.start_date,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    # Save to MongoDB
    result = users_collection.insert_one(user_doc)
    
    return {"message": f"User {user_data.name} created!", "user_id": str(result.inserted_id)}

@router.get("/list")
def get_all_users(skip: int = 0, limit: int = 10, current_user = Depends(verify_token)):
    # Check if user has HR role
    user = users_collection.find_one({"email": current_user["email"]})
    
    if not user or user["role"] not in ["hr", "manager"]:
        raise HTTPException(status_code=403, detail="Access denied. HR or Manager role required.")
    
    # Get users with pagination
    users = list(users_collection.find(
        {},  # Empty filter = get all users
        {"password": 0}  # Don't return passwords for security
    ).skip(skip).limit(limit))
    
    # Convert ObjectId to string for JSON response
    for user in users:
        user["_id"] = str(user["_id"])
    
    return {"users": users, "total": users_collection.count_documents({})}

@router.get("/{user_id}")
def get_user_id(user_id: str, current_user = Depends(verify_token)):
    # Check if user has HR role
    user = users_collection.find_one({"email": current_user["email"]})
    if not user or user["role"] not in ["hr", "manager"]:
        raise HTTPException(status_code=403, detail="Access denied. HR or Manager role required.")

    try:
        target_user = users_collection.find_one(
            {"_id": ObjectId(user_id)},
            {"password": 0}  # Don't return password for security
        )
        
        if not target_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Convert ObjectId to string
        target_user["_id"] = str(target_user["_id"])
        
        return {"user": target_user}
        
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

@router.put("/{user_id}/role")    
def update_user_role(user_id: str, role_data: UpdateRole, current_user = Depends(verify_token)):
    user = users_collection.find_one({"email": current_user["email"]})

    if not user or user["role"] not in ["hr", "manager"]:
        raise HTTPException(status_code=403, detail="Access denied, not enough privilege")

    result = users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"role": role_data.role}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found or role not changed")

    return {"message": "User role updated successfully!"}

@router.put("/{user_id}")    
def update_user_data(user_id: str, user_data: UserUpdate, current_user = Depends(verify_token)):
    user = users_collection.find_one({"email": current_user["email"]})

    if not user or user["role"] not in ["hr", "manager"]:
        raise HTTPException(status_code=403, detail="Access denied, not enough privilege")

    update_data = {}
    if user_data.name is not None:
        update_data["name"] = user_data.name
    if user_data.ID is not None:
        update_data["employee_id"] = user_data.employee_id
    if user_data.email is not None:
        update_data["email"] = user_data.email
    if user_data.phone is not None:
        update_data["phone"] = user_data.phone
    if user_data.emergency_contact is not None:
        update_data["emergency_contact"] = user_data.emergency_contact
    if user_data.manager_id is not None:
        update_data["manager_id"] = user_data.manager_id
    if user_data.address is not None:
        update_data["address"] = user_data.address
    if user_data.position is not None:
        update_data["position"] = user_data.position
    if user_data.department is not None:
        update_data["department"] = user_data.department
    if user_data.employment_type is not None:
        update_data["employment_type"] = user_data.employment_type
    if user_data.start_date is not None:
        update_data["start_date"] = user_data.start_date
     
    update_data["updated_at"] = datetime.utcnow().isoformat()

    result = users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found or role not changed")

    return {"message": "User data updated successfully!"}

@router.delete("/{user_id}")    
def deactivate_user(user_id: str, current_user = Depends(verify_token)):
    user = users_collection.find_one({"email": current_user["email"]})

    if not user or user["role"] not in ["hr", "manager"]:
        raise HTTPException(status_code=403, detail="Access denied, not enough privilege")

    result = users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"isActive": False}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found or role not changed")

    return {"message": "User deactivated successfully!"}

@router.put("/{user_id}/activate")    
def activate_user(user_id: str, current_user = Depends(verify_token)):
    user = users_collection.find_one({"email": current_user["email"]})

    if not user or user["role"] not in ["hr", "manager"]:
        raise HTTPException(status_code=403, detail="Access denied, not enough privilege")

    result = users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"isActive": True}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found or role not changed")

    return {"message": "User activated successfully!"}