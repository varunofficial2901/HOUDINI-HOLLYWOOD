import os
from datetime import datetime
from bson import ObjectId
from typing import Optional, List
import cloudinary
import cloudinary.uploader
from core.database import get_db
from core.security import get_current_admin
from core.config import settings
from models.schemas import (
    EnrollmentCreate, EnrollmentUpdate, EnrollmentOut, MessageResponse
)
from fastapi import APIRouter, HTTPException, Depends, Query, Form, UploadFile, File

router = APIRouter(prefix="/api/enrollments", tags=["Enrollments"])

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

def fmt(e: dict) -> EnrollmentOut:
    return EnrollmentOut(
        id=str(e["_id"]),
        first_name=e["first_name"],
        last_name=e["last_name"],
        email=e["email"],
        phone=e.get("phone", ""),
        country_code=e.get("country_code", "+91"),
        gender=e.get("gender"),
        plan=e["plan"],
        billing=e["billing"],
        status=e.get("status", "pending"),
        admin_notes=e.get("admin_notes"),
        screenshot=e.get("screenshot"),
        created_at=e["created_at"],
        updated_at=e["updated_at"],
    )

# ── Public: Payment screenshot submit ─────────────────────
@router.post("/payment-submit")
async def payment_submit(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(""),
    course: str = Form(...),
    payment_type: str = Form(...),
    screenshot: UploadFile = File(...),
    db=Depends(get_db)
):
    # Upload to Cloudinary
    contents = await screenshot.read()
    upload_result = cloudinary.uploader.upload(
        contents,
        folder="payment_screenshots",
        resource_type="image"
    )
    file_url = upload_result["secure_url"]

    now = datetime.utcnow()
    result = await db.enrollments.insert_one({
        "first_name": name,
        "last_name": "",
        "email": email,
        "phone": phone,
        "country_code": "+91",
        "gender": None,
        "plan": course,
        "billing": payment_type,
        "screenshot": file_url,
        "status": "pending",
        "admin_notes": None,
        "created_at": now,
        "updated_at": now,
    })

    return {
        "message": "Payment submitted successfully",
        "enrollment_id": str(result.inserted_id)
    }

# ── Admin: Approve enrollment ──────────────────────────────
@router.post("/{enrollment_id}/approve")
async def approve_enrollment(
    enrollment_id: str,
    db=Depends(get_db),
    _=Depends(get_current_admin)
):
    try:
        oid = ObjectId(enrollment_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")

    result = await db.enrollments.find_one_and_update(
        {"_id": oid},
        {"$set": {"status": "confirmed", "updated_at": datetime.utcnow()}}
    )
    if not result:
        raise HTTPException(status_code=404, detail="Enrollment not found")

    return {
        "whatsapp_link": "https://chat.whatsapp.com/IJ6voqFQc4U7y3HwR7kvjl?mode=gi_t",
        "message": "Online classes ke liye yahan join karein"
    }

# ── Public: Submit enrollment form ────────────────────────
@router.post("", response_model=MessageResponse, status_code=201)
async def submit_enrollment(data: EnrollmentCreate, db=Depends(get_db)):
    now = datetime.utcnow()
    doc = {
        **data.model_dump(),
        "status": "pending",
        "admin_notes": None,
        "created_at": now,
        "updated_at": now,
    }
    await db.enrollments.insert_one(doc)
    return MessageResponse(message="Enrollment submitted successfully! We will contact you within 24 hours.")

# ── Admin: List enrollments ────────────────────────────────
@router.get("", response_model=List[EnrollmentOut])
async def list_enrollments(
    status: Optional[str] = Query(None),
    plan: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db=Depends(get_db),
    _=Depends(get_current_admin)
):
    query = {}
    if status:
        query["status"] = status
    if plan:
        query["plan"] = plan
    if search:
        query["$or"] = [
            {"email": {"$regex": search, "$options": "i"}},
            {"first_name": {"$regex": search, "$options": "i"}},
            {"last_name": {"$regex": search, "$options": "i"}},
        ]

    cursor = db.enrollments.find(query).sort("created_at", -1).skip(skip).limit(limit)
    results = await cursor.to_list(length=limit)
    return [fmt(e) for e in results]

# ── Admin: Get enrollment by ID ───────────────────────────
@router.get("/{enrollment_id}", response_model=EnrollmentOut)
async def get_enrollment(
    enrollment_id: str,
    db=Depends(get_db),
    _=Depends(get_current_admin)
):
    try:
        oid = ObjectId(enrollment_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")

    e = await db.enrollments.find_one({"_id": oid})
    if not e:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return fmt(e)

# ── Admin: Update enrollment ───────────────────────────────
@router.patch("/{enrollment_id}", response_model=EnrollmentOut)
async def update_enrollment(
    enrollment_id: str,
    data: EnrollmentUpdate,
    db=Depends(get_db),
    _=Depends(get_current_admin)
):
    try:
        oid = ObjectId(enrollment_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")

    update_fields = {k: v for k, v in data.model_dump().items() if v is not None}
    update_fields["updated_at"] = datetime.utcnow()

    result = await db.enrollments.find_one_and_update(
        {"_id": oid},
        {"$set": update_fields},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return fmt(result)

# ── Admin: Delete enrollment ───────────────────────────────
@router.delete("/{enrollment_id}", response_model=MessageResponse)
async def delete_enrollment(
    enrollment_id: str,
    db=Depends(get_db),
    _=Depends(get_current_admin)
):
    try:
        oid = ObjectId(enrollment_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")

    result = await db.enrollments.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return MessageResponse(message="Enrollment deleted")

# ── Admin: Stats ───────────────────────────────────────────
@router.get("/stats/summary", response_model=dict)
async def enrollment_stats(db=Depends(get_db), _=Depends(get_current_admin)):
    total = await db.enrollments.count_documents({})
    pending = await db.enrollments.count_documents({"status": "pending"})
    confirmed = await db.enrollments.count_documents({"status": "confirmed"})
    cancelled = await db.enrollments.count_documents({"status": "cancelled"})
    completed = await db.enrollments.count_documents({"status": "completed"})
    return {
        "total": total,
        "pending": pending,
        "confirmed": confirmed,
        "cancelled": cancelled,
        "completed": completed,
    }

# ── Public: Check payment status ──────────────────────────
@router.get("/payment-status/{enrollment_id}")
async def payment_status(enrollment_id: str, db=Depends(get_db)):
    try:
        oid = ObjectId(enrollment_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")

    e = await db.enrollments.find_one({"_id": oid})
    if not e:
        raise HTTPException(status_code=404, detail="Not found")

    return {
        "status": e.get("status", "pending"),
        "whatsapp_link": "https://chat.whatsapp.com/IJ6voqFQc4U7y3HwR7kvjl?mode=gi_t" if e.get("status") == "confirmed" else None,
        "message": "Online classes ke liye yahan join karein" if e.get("status") == "confirmed" else None
    }




















# import os
# from datetime import datetime
# from bson import ObjectId
# from typing import Optional, List
# from core.database import get_db
# from core.security import get_current_admin
# from models.schemas import (
#     EnrollmentCreate, EnrollmentUpdate, EnrollmentOut, MessageResponse
# )
# from fastapi import APIRouter, HTTPException, Depends, Query, Form, UploadFile, File

# router = APIRouter(prefix="/api/enrollments", tags=["Enrollments"])

# def fmt(e: dict) -> EnrollmentOut:
#     return EnrollmentOut(
#         id=str(e["_id"]),
#         first_name=e["first_name"],
#         last_name=e["last_name"],
#         email=e["email"],
#         phone=e["phone"],
#         country_code=e.get("country_code", "+91"),
#         gender=e.get("gender"),
#         plan=e["plan"],
#         billing=e["billing"],
#         status=e.get("status", "pending"),
#         admin_notes=e.get("admin_notes"),
#         # ✅ FIX: include screenshot path so admin panel can display it
#         screenshot=e.get("screenshot"),
#         created_at=e["created_at"],
#         updated_at=e["updated_at"],
#     )

# # ── Public: Payment screenshot submit ─────────────────────
# @router.post("/payment-submit")
# async def payment_submit(
#     name: str = Form(...),
#     email: str = Form(...),
#     course: str = Form(...),
#     payment_type: str = Form(...),
#     screenshot: UploadFile = File(...),
#     db=Depends(get_db)
# ):
#     os.makedirs("uploads", exist_ok=True)

#     # ✅ Use a safe unique filename to avoid collisions/overwriting
#     timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
#     ext = os.path.splitext(screenshot.filename)[1]
#     safe_filename = f"{timestamp}_{screenshot.filename.replace(' ', '_')}"
#     file_path = f"uploads/{safe_filename}"

#     with open(file_path, "wb") as f:
#         f.write(await screenshot.read())

#     now = datetime.utcnow()
#     result = await db.enrollments.insert_one({
#         "first_name": name,
#         "last_name": "",
#         "email": email,
#         "phone": "",
#         "country_code": "+91",
#         "gender": None,
#         "plan": course,
#         "billing": payment_type,
#         "screenshot": file_path,   # stored as "uploads/filename.jpg"
#         "status": "pending",
#         "admin_notes": None,
#         "created_at": now,
#         "updated_at": now,
#     })

#     return {
#         "message": "Payment submitted successfully",
#         "enrollment_id": str(result.inserted_id)
#     }

# # ── Admin: Approve enrollment + return WhatsApp link ──────
# @router.post("/{enrollment_id}/approve")
# async def approve_enrollment(
#     enrollment_id: str,
#     db=Depends(get_db),
#     _=Depends(get_current_admin)
# ):
#     try:
#         oid = ObjectId(enrollment_id)
#     except Exception:
#         raise HTTPException(status_code=400, detail="Invalid ID")

#     result = await db.enrollments.find_one_and_update(
#         {"_id": oid},
#         {"$set": {"status": "confirmed", "updated_at": datetime.utcnow()}}
#     )
#     if not result:
#         raise HTTPException(status_code=404, detail="Enrollment not found")

#     return {
#         "whatsapp_link": "https://chat.whatsapp.com/IJ6voqFQc4U7y3HwR7kvjl?mode=gi_t",
#         "message": "Online classes ke liye yahan join karein"
#     }

# # ── Public: Submit enrollment form ────────────────────────
# @router.post("", response_model=MessageResponse, status_code=201)
# async def submit_enrollment(data: EnrollmentCreate, db=Depends(get_db)):
#     now = datetime.utcnow()
#     doc = {
#         **data.model_dump(),
#         "status": "pending",
#         "admin_notes": None,
#         "created_at": now,
#         "updated_at": now,
#     }
#     await db.enrollments.insert_one(doc)
#     return MessageResponse(message="Enrollment submitted successfully! We will contact you within 24 hours.")

# # ── Admin: List enrollments ────────────────────────────────
# @router.get("", response_model=List[EnrollmentOut])
# async def list_enrollments(
#     status: Optional[str] = Query(None),
#     plan: Optional[str] = Query(None),
#     search: Optional[str] = Query(None),
#     skip: int = Query(0, ge=0),
#     limit: int = Query(20, ge=1, le=100),
#     db=Depends(get_db),
#     _=Depends(get_current_admin)
# ):
#     query = {}
#     if status:
#         query["status"] = status
#     if plan:
#         query["plan"] = plan
#     if search:
#         query["$or"] = [
#             {"email": {"$regex": search, "$options": "i"}},
#             {"first_name": {"$regex": search, "$options": "i"}},
#             {"last_name": {"$regex": search, "$options": "i"}},
#         ]

#     cursor = db.enrollments.find(query).sort("created_at", -1).skip(skip).limit(limit)
#     results = await cursor.to_list(length=limit)
#     return [fmt(e) for e in results]

# # ── Admin: Get enrollment by ID ───────────────────────────
# @router.get("/{enrollment_id}", response_model=EnrollmentOut)
# async def get_enrollment(
#     enrollment_id: str,
#     db=Depends(get_db),
#     _=Depends(get_current_admin)
# ):
#     try:
#         oid = ObjectId(enrollment_id)
#     except Exception:
#         raise HTTPException(status_code=400, detail="Invalid ID")

#     e = await db.enrollments.find_one({"_id": oid})
#     if not e:
#         raise HTTPException(status_code=404, detail="Enrollment not found")
#     return fmt(e)

# # ── Admin: Update enrollment ───────────────────────────────
# @router.patch("/{enrollment_id}", response_model=EnrollmentOut)
# async def update_enrollment(
#     enrollment_id: str,
#     data: EnrollmentUpdate,
#     db=Depends(get_db),
#     _=Depends(get_current_admin)
# ):
#     try:
#         oid = ObjectId(enrollment_id)
#     except Exception:
#         raise HTTPException(status_code=400, detail="Invalid ID")

#     update_fields = {k: v for k, v in data.model_dump().items() if v is not None}
#     update_fields["updated_at"] = datetime.utcnow()

#     result = await db.enrollments.find_one_and_update(
#         {"_id": oid},
#         {"$set": update_fields},
#         return_document=True
#     )
#     if not result:
#         raise HTTPException(status_code=404, detail="Enrollment not found")
#     return fmt(result)

# # ── Admin: Delete enrollment ───────────────────────────────
# @router.delete("/{enrollment_id}", response_model=MessageResponse)
# async def delete_enrollment(
#     enrollment_id: str,
#     db=Depends(get_db),
#     _=Depends(get_current_admin)
# ):
#     try:
#         oid = ObjectId(enrollment_id)
#     except Exception:
#         raise HTTPException(status_code=400, detail="Invalid ID")

#     result = await db.enrollments.delete_one({"_id": oid})
#     if result.deleted_count == 0:
#         raise HTTPException(status_code=404, detail="Enrollment not found")
#     return MessageResponse(message="Enrollment deleted")

# # ── Admin: Stats ───────────────────────────────────────────
# @router.get("/stats/summary", response_model=dict)
# async def enrollment_stats(db=Depends(get_db), _=Depends(get_current_admin)):
#     total = await db.enrollments.count_documents({})
#     pending = await db.enrollments.count_documents({"status": "pending"})
#     confirmed = await db.enrollments.count_documents({"status": "confirmed"})
#     cancelled = await db.enrollments.count_documents({"status": "cancelled"})
#     completed = await db.enrollments.count_documents({"status": "completed"})
#     return {
#         "total": total,
#         "pending": pending,
#         "confirmed": confirmed,
#         "cancelled": cancelled,
#         "completed": completed,
#     }

# # ── Public: Check payment status ──────────────────────────
# @router.get("/payment-status/{enrollment_id}")
# async def payment_status(enrollment_id: str, db=Depends(get_db)):
#     try:
#         oid = ObjectId(enrollment_id)
#     except Exception:
#         raise HTTPException(status_code=400, detail="Invalid ID")

#     e = await db.enrollments.find_one({"_id": oid})
#     if not e:
#         raise HTTPException(status_code=404, detail="Not found")

#     return {
#         "status": e.get("status", "pending"),
#         "whatsapp_link": "https://chat.whatsapp.com/IJ6voqFQc4U7y3HwR7kvjl?mode=gi_t" if e.get("status") == "confirmed" else None,
#         "message": "Online classes ke liye yahan join karein" if e.get("status") == "confirmed" else None
#     }


