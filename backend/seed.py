"""
Run once to seed the database with admin user + default courses + pricing plans.
Usage: python seed.py
"""
import asyncio
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DEFAULT_COURSES = [
    {
        "category": "FLIP & River Simulation", "tag": "FLIP & River",
        "color": "#1a6fff", "icon": "💧", "level": "Intermediate",
        "lessons": [
            {"id": 1, "title": "River Simulation / Meshing / Render", "duration": "2h 15m", "preview": True},
            {"id": 2, "title": "FLIP Tank Simulation / Narrow Band", "duration": "1h 45m", "preview": False},
            {"id": 3, "title": "FLIP Tank Meshing", "duration": "1h 20m", "preview": False},
            {"id": 4, "title": "Ocean Spectrum — Setting Up White Water", "duration": "2h 00m", "preview": True},
        ],
        "is_active": True,
    },
    {
        "category": "Pyro", "tag": "Pyro",
        "color": "#ff5c35", "icon": "🔥", "level": "Advanced",
        "lessons": [
            {"id": 1, "title": "Air Concept Explanation", "duration": "1h 00m", "preview": True},
            {"id": 2, "title": "Divergence and Velocity Field", "duration": "1h 20m", "preview": False},
            {"id": 3, "title": "Realistic Fire", "duration": "1h 35m", "preview": False},
        ],
        "is_active": True,
    },
    {
        "category": "RBD", "tag": "RBD",
        "color": "#00d4aa", "icon": "💥", "level": "Advanced",
        "lessons": [
            {"id": 1, "title": "Different Types of Fractures", "duration": "2h 00m", "preview": True},
            {"id": 2, "title": "Ground Destruction With Custom Fractures", "duration": "1h 45m", "preview": False},
            {"id": 3, "title": "Building Destruction", "duration": "2h 10m", "preview": False},
        ],
        "is_active": True,
    },
    {
        "category": "Vellum", "tag": "Vellum",
        "color": "#a855f7", "icon": "🧵", "level": "Intermediate",
        "lessons": [
            {"id": 1, "title": "Cloth Working With Particles", "duration": "1h 30m", "preview": True},
            {"id": 2, "title": "Soft Bodies and Constraints", "duration": "1h 45m", "preview": False},
        ],
        "is_active": True,
    },
    {
        "category": "POP", "tag": "POP",
        "color": "#ffbe00", "icon": "✨", "level": "Beginner",
        "lessons": [
            {"id": 1, "title": "Friction, Bounce, Bounce Forward Inherit", "duration": "1h 10m", "preview": True},
            {"id": 2, "title": "POP Tornado", "duration": "1h 30m", "preview": False},
            {"id": 3, "title": "POP Fireworks", "duration": "1h 45m", "preview": False},
        ],
        "is_active": True,
    },
    {
        "category": "Nuke", "tag": "Nuke",
        "color": "#00cfff", "icon": "🎬", "level": "Intermediate",
        "lessons": [
            {"id": 1, "title": "All Basics — Navigation and UI", "duration": "2h 00m", "preview": True},
            {"id": 2, "title": "Multi-Pass Compositing", "duration": "2h 30m", "preview": False},
            {"id": 3, "title": "ACES Workflow", "duration": "1h 45m", "preview": False},
            {"id": 4, "title": "Houdini Renders Compositing", "duration": "2h 15m", "preview": False},
        ],
        "is_active": True,
    },
]

DEFAULT_PLANS = [
    {
        "name": "starter", "tag": "SINGLE COURSE", "sort_order": 0,
        "desc": "Perfect for beginners exploring a single FX discipline.",
        "price_monthly": "4,999", "price_yearly": "3,999", "old_yearly": "4,999", "savings": None,
        "features": [
            {"text": "Access to 1 Course of Your Choice", "active": True},
            {"text": "All Lessons in That Course", "active": True},
            {"text": "Lifetime Access to Recordings", "active": True},
            {"text": "Course Completion Certificate", "active": True},
            {"text": "Community Forum Access", "active": True},
            {"text": "Live Q&A Sessions", "active": False},
            {"text": "1-on-1 Mentorship", "active": False},
            {"text": "Placement Assistance", "active": False},
        ],
        "is_popular": False, "is_active": True,
    },
    {
        "name": "pro", "tag": "3 COURSES BUNDLE", "sort_order": 1,
        "desc": "The most chosen plan. Master 3 disciplines and unlock live mentorship.",
        "price_monthly": "12,999", "price_yearly": "9,999", "old_yearly": "12,999", "savings": "3,000",
        "features": [
            {"text": "Access to Any 3 Courses", "active": True},
            {"text": "All Lessons in All 3 Courses", "active": True},
            {"text": "Lifetime Access to Recordings", "active": True},
            {"text": "Course Completion Certificate", "active": True},
            {"text": "Community Forum Access", "active": True},
            {"text": "Weekly Live Q&A Sessions", "active": True},
            {"text": "Priority Support via Discord", "active": True},
            {"text": "1-on-1 Mentorship", "active": False},
            {"text": "Placement Assistance", "active": False},
        ],
        "is_popular": True, "is_active": True,
    },
    {
        "name": "master", "tag": "ALL ACCESS", "sort_order": 2,
        "desc": "The complete Houdini Hollywood experience. Every course, every discipline.",
        "price_monthly": "24,999", "price_yearly": "19,999", "old_yearly": "24,999", "savings": "5,000",
        "features": [
            {"text": "Access to ALL 6 Course Disciplines", "active": True},
            {"text": "All 78+ Lessons — Complete Library", "active": True},
            {"text": "Lifetime Access to Recordings", "active": True},
            {"text": "Course Completion Certificate", "active": True},
            {"text": "Community Forum Access", "active": True},
            {"text": "Weekly Live Q&A Sessions", "active": True},
            {"text": "Priority Support via Discord", "active": True},
            {"text": "Monthly 1-on-1 Mentorship Session", "active": True},
            {"text": "Placement Assistance & Studio Connect", "active": True},
            {"text": "Early Access to New Courses", "active": True},
            {"text": "Exclusive Master Community Badge", "active": True},
        ],
        "is_popular": False, "is_active": True,
    },
]

async def seed():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DB_NAME]
    now = datetime.utcnow()

    # ── Admin user ─────────────────────────────────────────
    existing_admin = await db.users.find_one({"email": settings.ADMIN_EMAIL})
    if not existing_admin:
        await db.users.insert_one({
            "first_name": "Admin",
            "last_name": "Houdini",
            "email": settings.ADMIN_EMAIL,
            "password_hash": pwd_context.hash(settings.ADMIN_PASSWORD),
            "role": "admin",
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        })
        print(f"✅ Admin created: {settings.ADMIN_EMAIL} / {settings.ADMIN_PASSWORD}")
    else:
        print("ℹ️  Admin already exists — skipping")

    # ── Courses ────────────────────────────────────────────
    course_count = await db.courses.count_documents({})
    if course_count == 0:
        for course in DEFAULT_COURSES:
            course["created_at"] = now
            course["updated_at"] = now
        await db.courses.insert_many(DEFAULT_COURSES)
        print(f"✅ Seeded {len(DEFAULT_COURSES)} courses")
    else:
        print(f"ℹ️  Courses already exist ({course_count}) — skipping")

    # ── Pricing plans ──────────────────────────────────────
    plan_count = await db.pricing_plans.count_documents({})
    if plan_count == 0:
        for plan in DEFAULT_PLANS:
            plan["created_at"] = now
            plan["updated_at"] = now
        await db.pricing_plans.insert_many(DEFAULT_PLANS)
        print(f"✅ Seeded {len(DEFAULT_PLANS)} pricing plans")
    else:
        print(f"ℹ️  Pricing plans already exist ({plan_count}) — skipping")

    # ── Indexes ────────────────────────────────────────────
    await db.users.create_index("email", unique=True)
    await db.enrollments.create_index("email")
    await db.enrollments.create_index("status")
    await db.contact_messages.create_index("created_at")
    print("✅ Indexes created")

    client.close()
    print("\n🎉 Database seeding complete!")
    print(f"   Admin login: {settings.ADMIN_EMAIL}")
    print(f"   Admin pass:  {settings.ADMIN_PASSWORD}")
    print(f"   API docs:    http://localhost:{settings.APP_PORT}/docs")

if __name__ == "__main__":
    asyncio.run(seed())
