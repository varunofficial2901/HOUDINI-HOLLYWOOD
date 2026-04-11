from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from core.config import settings
from core.database import connect_db, close_db
from routers import auth, enrollments, courses, pricing, messages, admin
from fastapi import Request
from fastapi.responses import JSONResponse



@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()
# ── Create app FIRST ──────────────────────────────────────
app = FastAPI(
    title="Houdini Hollywood API",
    description="Backend API for Houdini Hollywood — VFX Animation Course Platform",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ───────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://houdini-hollywood.vercel.app",
        "https://houdini-hollywood-1nk6.vercel.app",
        "https://www.creativeindiaschool.com",
        "https://creativeindiaschool.com",
        "https://admin.creativeindiaschool.com",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.options("/{rest_of_path:path}")
async def preflight_handler(request: Request, rest_of_path: str):
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
            "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": "true",
        }
    )
# ── Routers ────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(enrollments.router)
app.include_router(courses.router)
app.include_router(pricing.router)
app.include_router(messages.router)
app.include_router(admin.router)

@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "ok",
        "app": "Houdini Hollywood API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.APP_PORT,
        reload=settings.APP_ENV == "development"
    )
