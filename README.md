# Employee Onboarding & Document Management System

A full-stack web application for managing employee onboarding processes and document management.

## Tech Stack

- **Frontend:** React + TypeScript + Shadcn/UI
- **Backend:** Python + FastAPI + MongoDB
- **Authentication:** JWT tokens
- **File Storage:** Local file system

## Features

- Multi-role authentication (Employee, HR, Manager)
- Document management with 5 categories (Iqama, Passport, Certificate, Resume, ID Copy)
- Drag-and-drop file upload
- Document download functionality
- Role-based access control

## Setup Instructions

### Backend
```bash
cd Backend
pip install -r requirements.txt
python main.py
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

## Project Structure
```
EmpOnboardingSystem/
├── Backend/
│   ├── app/
│   ├── uploads/
│   └── main.py
└── Frontend/
    └── src/
```