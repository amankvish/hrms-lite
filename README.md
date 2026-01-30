# HRMS Lite

HRMS Lite is a full-stack production-ready web application for Employee and Attendance management. Built with Django (Backend) and React (Frontend).

## Tech Stack

- **Backend**: Python, Django, Django REST Framework
- **Frontend**: React, Vite, Vanilla CSS (Glassmorphism design)
- **Database**: SQLite (Local) / PostgreSQL (Production)
- **Deployment**: Render (Backend), Vercel (Frontend)

## Features

- **Employee Management**: Add, View, Delete employees.
- **Attendance Tracking**: Mark Present/Absent for employees by date.
- **RESTful API**: Fully synchronized frontend and backend.
- **Responsive Design**: Modern glassmorphic UI.

## Project Structure

```
hrms-lite/
├── backend/            # Django Project
│   ├── hrms_backend/   # Settings & Config
│   ├── employees/      # Employee App
│   ├── attendance/     # Attendance App
│   └── requirements.txt
├── frontend/           # React App
│   ├── src/
│   └── package.json
└── README.md
```

## Setup Instructions (Local)

### Prerequisites

- Python 3.9+
- Node.js 16+

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs at `http://localhost:8000`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Environment Variables

Create a `.env` file in `backend/` for production:

```
SECRET_KEY=your_secret_key
DEBUG=False
DATABASE_URL=postgres://...
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

Create `.env` in `frontend/` (optional, locally uses localhost proxy):

```
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

## API Documentation

- **GET** `/api/employees/` - List employees
- **POST** `/api/employees/` - Create employee
- **DELETE** `/api/employees/{id}/` - Delete employee
- **GET** `/api/attendance/?date=YYYY-MM-DD&employee_id=ID` - List attendance
- **POST** `/api/attendance/` - Mark attendance

## Deployment

### Backend (Render)

1. Link repository to Render.
2. Set Build Command: `./backend/build.sh`
3. Set Start Command: `cd backend && gunicorn hrms_backend.wsgi`
4. Add Environment Variables (`SECRET_KEY`, `DATABASE_URL`, `CORS_ALLOWED_ORIGINS`).

### Frontend (Vercel)

1. Link repository to Vercel.
2. Set Root Directory to `frontend`.
3. Add `VITE_API_BASE_URL` environment variable pointing to Render Backend.

## License

MIT
