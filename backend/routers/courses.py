from fastapi import APIRouter, HTTPException, Depends, Query
from datetime import datetime
from bson import ObjectId
from typing import List, Optional
from core.database import get_db
from core.security import get_current_admin
from models.schemas import CourseCreate, CourseUpdate, CourseOut, MessageResponse

router = APIRouter(prefix="/api/courses", tags=["Courses"])

def fmt(c: dict) -> CourseOut:
    lessons = c.get("lessons", [])
    return CourseOut(
        id=str(c["_id"]),
        category=c["category"],
        tag=c["tag"],
        color=c.get("color", "#8b5cf6"),
        icon=c.get("icon", "🎬"),
        level=c.get("level", "Intermediate"),
        total_lessons=len(lessons),
        lessons=lessons,
        is_active=c.get("is_active", True),
        created_at=c["created_at"],
        updated_at=c["updated_at"],
    )

# ── Public: list active courses ────────────────────────────
@router.get("", response_model=List[CourseOut])
async def list_courses(
    category: Optional[str] = Query(None),
    db=Depends(get_db)
):
    query = {"is_active": True}
    if category:
        query["tag"] = category
    cursor = db.courses.find(query).sort("created_at", 1)
    results = await cursor.to_list(length=100)
    return [fmt(c) for c in results]

# ── Public: get single course ──────────────────────────────
@router.get("/{course_id}", response_model=CourseOut)
async def get_course(course_id: str, db=Depends(get_db)):
    try:
        oid = ObjectId(course_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")
    c = await db.courses.find_one({"_id": oid})
    if not c:
        raise HTTPException(status_code=404, detail="Course not found")
    return fmt(c)

# ── Admin: create course ───────────────────────────────────
@router.post("", response_model=CourseOut, status_code=201)
async def create_course(
    data: CourseCreate,
    db=Depends(get_db),
    _=Depends(get_current_admin)
):
    now = datetime.utcnow()
    doc = {
        **data.model_dump(),
        "is_active": True,
        "created_at": now,
        "updated_at": now,
    }
    result = await db.courses.insert_one(doc)
    doc["_id"] = result.inserted_id
    return fmt(doc)

# ── Admin: update course ───────────────────────────────────
@router.patch("/{course_id}", response_model=CourseOut)
async def update_course(
    course_id: str,
    data: CourseUpdate,
    db=Depends(get_db),
    _=Depends(get_current_admin)
):
    try:
        oid = ObjectId(course_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")

    update_fields = {k: v for k, v in data.model_dump().items() if v is not None}
    update_fields["updated_at"] = datetime.utcnow()

    result = await db.courses.find_one_and_update(
        {"_id": oid}, {"$set": update_fields}, return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Course not found")
    return fmt(result)

# ── Admin: delete course ───────────────────────────────────
@router.delete("/{course_id}", response_model=MessageResponse)
async def delete_course(
    course_id: str,
    db=Depends(get_db),
    _=Depends(get_current_admin)
):
    try:
        oid = ObjectId(course_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")
    result = await db.courses.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")
    return MessageResponse(message="Course deleted")

# ── Admin: list ALL courses (including inactive) ───────────
@router.get("/admin/all", response_model=List[CourseOut])
async def admin_list_all_courses(
    db=Depends(get_db),
    _=Depends(get_current_admin)
):
    cursor = db.courses.find({}).sort("created_at", 1)
    results = await cursor.to_list(length=100)
    return [fmt(c) for c in results]
