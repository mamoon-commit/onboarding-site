from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
from bson import ObjectId
from typing import List
from datetime import datetime
from fastapi.responses import FileResponse
import os
import shutil
from pathlib import Path


from app.models.document import CreateDocument, DocumentResponse, UpdateDocument, DocumentCategory
from app.core.database import users_collection, documents_collection
from app.core.security import verify_token

router = APIRouter(prefix="/api/documents", tags=["documents"])

@router.get("/users")
def get_all_users(current_user = Depends(verify_token)):
    user = users_collection.find_one({"email": current_user["email"]})
    
    if not user or user["role"] not in ["hr", "manager"]:
        raise HTTPException(status_code=403, detail="Not enough privileges")
    
    users = list(users_collection.find({"isActive": True}))
    
    for user in users:
        user["_id"] = str(user["_id"])
    
    return {"users": users}

@router.get("/user/{user_id}/categories")
def get_user_document_categories(user_id: str, current_user = Depends(verify_token)):
    user = users_collection.find_one({"email": current_user["email"]})
    
    if not user or user["role"] not in ["hr", "manager"]:
        raise HTTPException(status_code=403, detail="Not enough privileges")
    
    target_user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    categories = []
    for category in DocumentCategory:
        categories.append({
            "category": category.value,
            "display_name": category.value.replace("_", " ").title()
        })
    
    return {
        "user_id": user_id,
        "user_name": target_user.get("name", "Unknown"),
        "categories": categories
    }

@router.get("/user/{user_id}/category/{category}")
def get_documents_by_category(user_id: str, category: str, current_user = Depends(verify_token)):
    user = users_collection.find_one({"email": current_user["email"]})
    
    if not user or user["role"] not in ["hr", "manager"]:
        raise HTTPException(status_code=403, detail="Not enough privileges")
    
    try:
        doc_category = DocumentCategory(category)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid document category")
    
    target_user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    documents = list(documents_collection.find({
        "employee_id": user_id,
        "category": category 
    }))

    for doc in documents:
        doc["_id"] = str(doc["_id"])
    
    return {
        "user_id": user_id,
        "user_name": target_user.get("name", "Unknown"),
        "category": category,
        "documents": documents
        
    }


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    employee_id: str = Form(...),
    category: str = Form(...),
    current_user = Depends(verify_token)
):
    user = users_collection.find_one({"email": current_user["email"]})

    if not user or user["role"] not in ["hr", "manager"]:
        raise HTTPException(status_code=403, detail="Not enough privileges")

    # Validate category
    try:
        doc_category = DocumentCategory(category)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid document category")

    # Check if employee exists
    target_user = users_collection.find_one({"_id": ObjectId(employee_id)})
    if not target_user:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Create directory structure: uploads/employee_id/category/
    upload_dir = Path(f"uploads/{employee_id}/{category}")
    upload_dir.mkdir(parents=True, exist_ok=True)

    # Generate file path
    file_path = upload_dir / file.filename
    
    # Save the file to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Create document record in MongoDB
    document = {
        "employee_id": employee_id,
        "category": category,
        "file_name": file.filename,
        "file_path": str(file_path),
        "file_size": file.size if hasattr(file, 'size') else os.path.getsize(file_path),
        "mime_type": file.content_type,
        "uploaded_by": user["email"],
        "uploaded_at": datetime.utcnow().isoformat(),
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    result = documents_collection.insert_one(document)
    document["_id"] = str(result.inserted_id)
    
    return {"message": "Document uploaded successfully", "document": document}

@router.get("/download/{document_id}")
async def download_document(document_id: str, current_user = Depends(verify_token)):
    user = users_collection.find_one({"email": current_user["email"]})
    
    if not user or user["role"] not in ["hr", "manager"]:
        raise HTTPException(status_code=403, detail="Not enough privileges")
    
    document = documents_collection.find_one({"_id": ObjectId(document_id)})
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Check if file exists on disk
    file_path = Path(document["file_path"])
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found on server")
    
    # Return the file for download
    return FileResponse(
        path=str(file_path),
        filename=document["file_name"],
        media_type=document["mime_type"]
    )