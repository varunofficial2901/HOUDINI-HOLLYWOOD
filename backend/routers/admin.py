from fastapi import APIRouter, Depends, Query
from datetime import datetime
from typing import List
from bson import ObjectId
from core.database import get_db
from core.security import get_current_admin, hash_password
from models.schemas import DashboardStats, UserOut, MessageResponse

router = APIRouter(prefix="/api/admin", tags=["Admin"])

# ── Dashboard Stats ────────────────────────────────────────
@router.get("/dashboard", response_model=DashboardStats)
async def dashboard_stats(db=Depends(get_db), _=Depends(get_current_admin)):
    total_enrollments = await db.enrollments.count_documents({})
    pending = await db.enrollments.count_documents({"status": "pending"})
    confirmed = await db.enrollments.count_documents({"status": "confirmed"})
    total_students = await db.users.count_documents({"role": "student"})
    total_courses = await db.courses.count_documents({"is_active": True})
    total_messages = await db.contact_messages.count_documents({})
    unread = await db.contact_messages.count_documents({"is_read": False})

    return DashboardStats(
        total_enrollments=total_enrollments,
        pending_enrollments=pending,
        confirmed_enrollments=confirmed,
        total_students=total_students,
        total_courses=total_courses,
        total_messages=total_messages,
        unread_messages=unread,
        revenue_this_month=0,  # placeholder — wire real payment later
    )

# ── List Students ──────────────────────────────────────────
@router.get("/students", response_model=List[UserOut])
async def list_students(
    search: str = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db=Depends(get_db),
    _=Depends(get_current_admin)
):
    query = {"role": "student"}
    if search:
        query["$or"] = [
            {"email": {"$regex": search, "$options": "i"}},
            {"first_name": {"$regex": search, "$options": "i"}},
            {"last_name": {"$regex": search, "$options": "i"}},
        ]
    cursor = db.users.find(query).sort("created_at", -1).skip(skip).limit(limit)
    results = await cursor.to_list(length=limit)
    return [
        UserOut(
            id=str(u["_id"]),
            first_name=u["first_name"],
            last_name=u["last_name"],
            email=u["email"],
            role=u.get("role", "student"),
            is_active=u.get("is_active", True),
            created_at=u.get("created_at", datetime.utcnow())
        )
        for u in results
    ]

# ── Toggle Student Active/Inactive ────────────────────────
@router.patch("/students/{user_id}/toggle", response_model=MessageResponse)
async def toggle_student(
    user_id: str,
    db=Depends(get_db),
    _=Depends(get_current_admin)
):
    try:
        oid = ObjectId(user_id)
    except Exception:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Invalid ID")

    user = await db.users.find_one({"_id": oid})
    if not user:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found")

    new_status = not user.get("is_active", True)
    await db.users.update_one({"_id": oid}, {"$set": {"is_active": new_status}})
    state = "activated" if new_status else "deactivated"
    return MessageResponse(message=f"Student {state} successfully")
