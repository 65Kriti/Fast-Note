# Fast Note

A simple full-stack note application with a **FastAPI** backend and **React** frontend. It demonstrates a basic **CRUD** API with a SQLite (default) / PostgreSQL database and a lightweight front-end UI.

![App Screenshot](./frontend/public/info.gif)

---

## 🚀 Tech Stack

- **Backend**: FastAPI, SQLAlchemy, Pydantic
- **Database**: SQLite (default) / PostgreSQL (via `DATABASE_URL`)
- **Frontend**: React + Tailwind CSS

---

## 🧩 Project Structure

```
.
├── app/               # FastAPI backend
│   ├── main.py        # FastAPI app entrypoint
│   ├── routes.py      # CRUD API routes
│   ├── models.py      # SQLAlchemy models
│   ├── schemas.py     # Pydantic schemas
│   ├── crud.py        # Database operations
│   └── database.py    # DB connection + initialization
├── frontend/          # React frontend
├── requirements.txt   # Python dependencies (backend)
└── README.md          # <-- you are here
```

---

## ▶️ Getting Started

### 1) Backend (FastAPI)

1. Create & activate a Python virtual environment:

   ```bash
   python -m venv venv
   # Windows (PowerShell)
   .\venv\Scripts\Activate.ps1
   # macOS / Linux
   # source venv/bin/activate
   ```

2. Install backend dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. (Optional) Configure database connection:

   Create a `.env` file in the project root to override the default SQLite DB:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/your_db
   ```

   By default, the app uses `sqlite:///./test.db`.

4. Run the backend server:

   ```bash
   uvicorn app.main:app --reload
   ```

   The API will be available at: `http://127.0.0.1:8000`

5. API docs (Swagger):

   - Open: `http://127.0.0.1:8000/docs`

---

### 2) Frontend (React)

1. Change into the frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the frontend dev server:

   ```bash
   npm run dev
   ```

   The app will be available at: `http://localhost:5173`

---

## 🧠 API Endpoints

All routes are prefixed with `/api/v1`.

### Blog Post CRUD

- `GET /api/v1/blog_posts/` - List posts
- `POST /api/v1/blog_posts/` - Create a post
- `GET /api/v1/blog_posts/{id}` - Read a post
- `PUT /api/v1/blog_posts/{id}` - Update a post
- `DELETE /api/v1/blog_posts/{id}` - Delete a post

---

## ⚙️ Notes

- The backend automatically creates database tables on startup.
- CORS is enabled for all origins (`*`) in development; tighten this in production.

---

## 🧪 Troubleshooting

- If you run into dependency issues, confirm you have a supported Python version (3.10+ recommended).
- If the frontend can’t reach the API, confirm the backend is running and check the API URL (default: `http://127.0.0.1:8000/api/v1`).

---



