from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from core.config import settings
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from datetime import datetime
from bson import ObjectId
from core.database import get_db
from core.security import (
    hash_password, verify_password,
    create_access_token, create_refresh_token,
    decode_token, get_current_user
)
from models.schemas import (
    UserRegister, UserLogin, TokenResponse, UserOut,
    RefreshTokenRequest, ChangePasswordRequest, MessageResponse
)

router = APIRouter(prefix="/api/auth", tags=["Auth"])

def format_user(user: dict) -> UserOut:
    return UserOut(
        id=str(user["_id"]),
        first_name=user["first_name"],
        last_name=user["last_name"],
        email=user["email"],
        role=user.get("role", "student"),
        is_active=user.get("is_active", True),
        created_at=user.get("created_at", datetime.utcnow())
    )

@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(data: UserRegister, db=Depends(get_db)):
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    now = datetime.utcnow()
    user_doc = {
        "first_name": data.first_name,
        "last_name": data.last_name,
        "email": data.email,
        "password_hash": hash_password(data.password),
        "phone": data.phone,
        "gender": data.gender,
        "role": "student",
        "is_active": True,
        "created_at": now,
        "updated_at": now,
    }
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    token_data = {"sub": data.email, "role": "student"}
    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
        user=format_user(user_doc)
    )

@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin, db=Depends(get_db)):
    user = await db.users.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.get("is_active", True):
        raise HTTPException(status_code=403, detail="Account is disabled")

    token_data = {"sub": user["email"], "role": user.get("role", "student")}
    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
        user=format_user(user)
    )

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(data: RefreshTokenRequest, db=Depends(get_db)):
    payload = decode_token(data.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    email = payload.get("sub")
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    token_data = {"sub": user["email"], "role": user.get("role", "student")}
    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
        user=format_user(user)
    )

@router.get("/me", response_model=UserOut)
async def get_me(current_user=Depends(get_current_user)):
    return format_user(current_user)

@router.post("/change-password", response_model=MessageResponse)
async def change_password(
    data: ChangePasswordRequest,
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    if not verify_password(data.current_password, current_user["password_hash"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"password_hash": hash_password(data.new_password), "updated_at": datetime.utcnow()}}
    )
    return MessageResponse(message="Password updated successfully")
class GoogleTokenRequest(BaseModel):
    token: str

@router.post("/google", response_model=TokenResponse)
async def google_login(data: GoogleTokenRequest, db=Depends(get_db)):
    try:
        # Verify the Google token
        idinfo = id_token.verify_oauth2_token(
            data.token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    email = idinfo.get("email")
    first_name = idinfo.get("given_name", "")
    last_name = idinfo.get("family_name", "")

    if not email:
        raise HTTPException(status_code=400, detail="Could not get email from Google")

    # Check if user exists
    user = await db.users.find_one({"email": email})

    if not user:
        # Auto-register new user
        now = datetime.utcnow()
        user_doc = {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "password_hash": None,
            "phone": None,
            "gender": None,
            "role": "student",
            "is_active": True,
            "auth_provider": "google",
            "created_at": now,
            "updated_at": now,
        }
        result = await db.users.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id
        user = user_doc

    if not user.get("is_active", True):
        raise HTTPException(status_code=403, detail="Account is disabled")

    token_data = {"sub": user["email"], "role": user.get("role", "student")}
    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
        user=format_user(user)
    )
