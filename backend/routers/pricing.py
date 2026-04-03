from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from bson import ObjectId
from typing import List
from core.database import get_db
from core.security import get_current_admin
from models.schemas import PricingPlanCreate, PricingPlanUpdate, PricingPlanOut, MessageResponse

router = APIRouter(prefix="/api/pricing", tags=["Pricing"])

def fmt(p: dict) -> PricingPlanOut:
    return PricingPlanOut(
        id=str(p["_id"]),
        name=p["name"],
        tag=p["tag"],
        desc=p["desc"],
        price_monthly=p["price_monthly"],
        price_yearly=p["price_yearly"],
        old_yearly=p["old_yearly"],
        savings=p.get("savings"),
        features=p.get("features", []),
        is_popular=p.get("is_popular", False),
        is_active=p.get("is_active", True),
        sort_order=p.get("sort_order", 0),
        updated_at=p["updated_at"],
    )

# ── Public: get active pricing plans ──────────────────────
@router.get("", response_model=List[PricingPlanOut])
async def get_pricing(db=Depends(get_db)):
    cursor = db.pricing_plans.find({"is_active": True}).sort("sort_order", 1)
    results = await cursor.to_list(length=10)
    return [fmt(p) for p in results]

# ── Admin: get ALL plans ───────────────────────────────────
@router.get("/admin/all", response_model=List[PricingPlanOut])
async def admin_list_plans(db=Depends(get_db), _=Depends(get_current_admin)):
    cursor = db.pricing_plans.find({}).sort("sort_order", 1)
    results = await cursor.to_list(length=10)
    return [fmt(p) for p in results]

# ── Admin: create plan ─────────────────────────────────────
@router.post("", response_model=PricingPlanOut, status_code=201)
async def create_plan(
    data: PricingPlanCreate,
    db=Depends(get_db),
    _=Depends(get_current_admin)
):
    existing = await db.pricing_plans.find_one({"name": data.name})
    if existing:
        raise HTTPException(status_code=409, detail=f"Plan '{data.name}' already exists")

    now = datetime.utcnow()
    doc = {**data.model_dump(), "created_at": now, "updated_at": now}
    result = await db.pricing_plans.insert_one(doc)
    doc["_id"] = result.inserted_id
    return fmt(doc)

# ── Admin: update plan ─────────────────────────────────────
@router.patch("/{plan_id}", response_model=PricingPlanOut)
async def update_plan(
    plan_id: str,
    data: PricingPlanUpdate,
    db=Depends(get_db),
    _=Depends(get_current_admin)
):
    try:
        oid = ObjectId(plan_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")

    update_fields = {k: v for k, v in data.model_dump().items() if v is not None}
    update_fields["updated_at"] = datetime.utcnow()

    result = await db.pricing_plans.find_one_and_update(
        {"_id": oid}, {"$set": update_fields}, return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Plan not found")
    return fmt(result)

# ── Admin: delete plan ─────────────────────────────────────
@router.delete("/{plan_id}", response_model=MessageResponse)
async def delete_plan(
    plan_id: str,
    db=Depends(get_db),
    _=Depends(get_current_admin)
):
    try:
        oid = ObjectId(plan_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")
    result = await db.pricing_plans.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Plan not found")
    return MessageResponse(message="Plan deleted")
