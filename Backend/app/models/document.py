from pydantic import BaseModel
from typing import Optional
from enum import Enum
from datetime import datetime

class DocumentCategory(str, Enum):
    IQAMA = "iqama"
    ID_COPY = "id_copy"  
    PASSPORT = "passport"
    CERTIFICATE = "certificate"
    RESUME = "resume"
    
class CreateDocument(BaseModel):
    employee_id: str
    category: DocumentCategory
    file_name: str
    file_path: str
    file_size: int
    uploaded_at: Optional[str] = datetime.utcnow().isoformat()
    mime_type: str
    uploaded_by: str  

class DocumentResponse(BaseModel):
    id: str
    employee_id: str
    category: DocumentCategory
    file_name: str
    file_path: str
    file_size: int
    uploaded_at: Optional[str] = datetime.utcnow().isoformat()
    mime_type: str
    uploaded_by: str
    created_at: Optional[str] = datetime.utcnow().isoformat()
    updated_at: Optional[str] = datetime.utcnow().isoformat()

class UpdateDocument(BaseModel):
    category: Optional[DocumentCategory]
    file_name: Optional[str]
    file_path: Optional[str]
    file_size: Optional[int]
    mime_type: Optional[str]
    updated_at: Optional[str] = datetime.utcnow().isoformat()
    updated_by: Optional[str]

