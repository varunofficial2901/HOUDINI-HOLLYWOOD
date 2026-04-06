from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

# ── Enums ─────────────────────────────────────────────────
class UserRole(str, Enum):
    admin = "admin"
    student = "student"

class EnrollmentStatus(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"
    completed = "completed"

class BillingCycle(str, Enum):
    monthly = "monthly"
    yearly = "yearly"

class PlanName(str, Enum):
    starter = "starter"
    pro = "pro"
    master = "master"
    houdini = "houdini"
    aftereffects = "aftereffects"
    nuke = "nuke"
    photoshop = "PhotoShop"

class CourseLevel(str, Enum):
    beginner = "Beginner"
    intermediate = "Intermediate"
    advanced = "Advanced"

# ── User Models ───────────────────────────────────────────
class UserRegister(BaseModel):
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    phone: Optional[str] = None
    gender: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserOut

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)

# ── Enrollment Models ─────────────────────────────────────
class EnrollmentCreate(BaseModel):
    first_name: str = Field(..., min_length=2)
    last_name: str = Field(..., min_length=2)
    email: EmailStr
    country_code: str = Field(default="+91")
    phone: str = Field(..., min_length=7)
    gender: Optional[str] = None
    plan: PlanName
    billing: BillingCycle

class EnrollmentUpdate(BaseModel):
    status: Optional[EnrollmentStatus] = None
    admin_notes: Optional[str] = None

class EnrollmentOut(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    phone: str
    country_code: str
    gender: Optional[str]
    plan: str
    billing: str
    status: str
    admin_notes: Optional[str]
    created_at: datetime
    updated_at: datetime

# ── Course Models ─────────────────────────────────────────
class CourseLesson(BaseModel):
    id: int
    title: str
    duration: str
    preview: bool = False

class CourseCreate(BaseModel):
    category: str = Field(..., min_length=2)
    tag: str
    color: str = "#8b5cf6"
    icon: str = "🎬"
    level: CourseLevel
    lessons: List[CourseLesson] = []

class CourseUpdate(BaseModel):
    category: Optional[str] = None
    tag: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    level: Optional[CourseLevel] = None
    lessons: Optional[List[CourseLesson]] = None
    is_active: Optional[bool] = None

class CourseOut(BaseModel):
    id: str
    category: str
    tag: str
    color: str
    icon: str
    level: str
    total_lessons: int
    lessons: List[CourseLesson]
    is_active: bool
    created_at: datetime
    updated_at: datetime

# ── Pricing Models ────────────────────────────────────────
class PlanFeature(BaseModel):
    text: str
    active: bool = True

class PricingPlanCreate(BaseModel):
    name: PlanName
    tag: str
    desc: str
    price_monthly: str
    price_yearly: str
    old_yearly: str
    savings: Optional[str] = None
    features: List[PlanFeature] = []
    is_popular: bool = False
    is_active: bool = True
    sort_order: int = 0

class PricingPlanUpdate(BaseModel):
    tag: Optional[str] = None
    desc: Optional[str] = None
    price_monthly: Optional[str] = None
    price_yearly: Optional[str] = None
    old_yearly: Optional[str] = None
    savings: Optional[str] = None
    features: Optional[List[PlanFeature]] = None
    is_popular: Optional[bool] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None

class PricingPlanOut(BaseModel):
    id: str
    name: str
    tag: str
    desc: str
    price_monthly: str
    price_yearly: str
    old_yearly: str
    savings: Optional[str]
    features: List[PlanFeature]
    is_popular: bool
    is_active: bool
    sort_order: int
    updated_at: datetime

# ── Contact Message Models ─────────────────────────────────
class ContactMessageCreate(BaseModel):
    email: EmailStr
    message: str = Field(..., min_length=10)

class ContactMessageOut(BaseModel):
    id: str
    email: str
    message: str
    is_read: bool
    created_at: datetime

# ── Dashboard Stats ────────────────────────────────────────
class DashboardStats(BaseModel):
    total_enrollments: int
    pending_enrollments: int
    confirmed_enrollments: int
    total_students: int
    total_courses: int
    total_messages: int
    unread_messages: int
    revenue_this_month: int

# ── Generic Response ───────────────────────────────────────
class MessageResponse(BaseModel):
    message: str
    success: bool = True
