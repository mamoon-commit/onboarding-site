from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str # "employee", "hr", "manager"
    position: Optional[str] = None
    department: Optional[str] = None
    isActive: bool = True
    status: str = "pending"  # "pending", "in-progress", "completed"


class UserResponse(BaseModel):
    employee_id: int
    name: str
    ID: int
    email: EmailStr
    role: str # "employee", "hr", "manager"
    phone: Optional[int] = None
    emergency_contact: Optional[int] = None
    manager_id: Optional[int] = None
    address: Optional[str] = None
    position: Optional[str] = None
    department: Optional[str] = None
    isActive: bool = True
    status: str = "pending"  # "pending", "in-progress", "completed"
    employment_type: str
    last_login: str
    start_date: str
    created_at: str
    updated_at: str

class UserUpdate(BaseModel):
    employee_id: Optional[int] = None
    ID: Optional[str] = None
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[int] = None
    emergency_contact: Optional[int] = None
    manager_id: Optional[int] = None
    address: Optional[str] = None
    position: Optional[str] = None
    department: Optional[str] = None
    employment_type: Optional[str] = None
    start_date: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UpdateRole(BaseModel):
    role: str