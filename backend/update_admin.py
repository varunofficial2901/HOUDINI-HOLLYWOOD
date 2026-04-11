import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext

pwd = CryptContext(schemes=["bcrypt"])

async def update():
    client = AsyncIOMotorClient('mongodb+srv://varun:46btP71KZZYebABT@cluster0.fvlhe7g.mongodb.net/houdini_hollywood')
    db = client["houdini_hollywood"]
    
    new_email = "gauravsangwan275@gmail.com"
    new_password = "creativeindiaschool@0404"
    hashed = pwd.hash(new_password)
    
    # Update ALL users with role admin — fix both field names
    result = await db.users.update_one(
        {"role": "admin"},
        {"$set": {
            "email": new_email,
            "password_hash": hashed,
        },
        "$unset": {
            "password": ""  # remove old wrong field if exists
        }}
    )
    
    if result.modified_count == 1:
        print("Done! Admin credentials updated successfully.")
    else:
        print("No admin found. Creating one...")
        now = __import__("datetime").datetime.utcnow()
        await db.users.insert_one({
            "first_name": "Admin",
            "last_name": "",
            "email": new_email,
            "password_hash": hashed,
            "role": "admin",
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        })
        print("Admin created successfully.")
    
    client.close()

asyncio.run(update())