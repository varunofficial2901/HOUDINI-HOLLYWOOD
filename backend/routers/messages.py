from fastapi import APIRouter, HTTPException, Depends, Query
from datetime import datetime
from bson import ObjectId
from typing import List, Optional
from core.database import get_db
from core.security import get_current_admin
from models.schemas import ContactMessageCreate, ContactMessageOut, MessageResponse

router = APIRouter(prefix="/api/messages", tags=["Messages"])

def fmt(m: dict) -> ContactMessageOut:
    return ContactMessageOut(
        id=str(m["_id"]),
        email=m["email"],
        message=m["message"],
        is_read=m.get("is_read", False),
        created_at=m["created_at"],
    )

# ── Public: submit contact message ────────────────────────
@router.post("", response_model=MessageResponse, status_code=201)
async def submit_message(data: ContactMessageCreate, db=Depends(get_db)):
    now = datetime.utcnow()
    doc = {
        "email": data.email,
        "message": data.message,
        "is_read": False,
        "created_at": now,
    }
    await db.contact_messages.insert_one(doc)
    return MessageResponse(message="Message sent! We'll get back to you within 24 hours.")

# ── Admin: list messages ───────────────────────────────────
@router.get("", response_model=List[ContactMessageOut])
async def list_messages(
    is_read: Optional[bool] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db=Depends(get_db),
    _=Depends(get_current_admin)
):
    query = {}
    if is_read is not None:
        query["is_read"] = is_read
    cursor = db.contact_messages.find(query).sort("created_at", -1).skip(skip).limit(limit)
    results = await cursor.to_list(length=limit)
    return [fmt(m) for m in results]

# ── Admin: mark as read ────────────────────────────────────
@router.patch("/{message_id}/read", response_model=ContactMessageOut)
async def mark_read(
    message_id: str,
    db=Depends(get_db),
    _=Depends(get_current_admin)
):
    try:
        oid = ObjectId(message_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")
    result = await db.contact_messages.find_one_and_update(
        {"_id": oid}, {"$set": {"is_read": True}}, return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Message not found")
    return fmt(result)

# ── Admin: delete message ──────────────────────────────────
@router.delete("/{message_id}", response_model=MessageResponse)
async def delete_message(
    message_id: str,
    db=Depends(get_db),
    _=Depends(get_current_admin)
):
    try:
        oid = ObjectId(message_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")
    result = await db.contact_messages.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return MessageResponse(message="Message deleted")
