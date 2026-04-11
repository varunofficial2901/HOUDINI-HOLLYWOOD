from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_db():
    db_instance.client = AsyncIOMotorClient(
        settings.MONGODB_URL,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=10000,
        socketTimeoutMS=10000,
    )
    db_instance.db = db_instance.client[settings.DB_NAME]
    print(f"✅ Connected to MongoDB: {settings.DB_NAME}")

    # Create indexes
    await db_instance.db.users.create_index("email", unique=True)
    await db_instance.db.enrollments.create_index("email")
    await db_instance.db.enrollments.create_index("status")
    await db_instance.db.contact_messages.create_index("created_at")
    await db_instance.db.courses.create_index("category")
    print("✅ Indexes created")

async def close_db():
    if db_instance.client:
        db_instance.client.close()
        print("🔌 MongoDB connection closed")

def get_db():
    return db_instance.db
