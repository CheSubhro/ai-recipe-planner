# MongoDB connection

import motor.motor_asyncio
from dotenv import load_dotenv
import os

# .env file load
load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_DETAILS")

# MongoDB client Create
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)

# Database Name (RecipePlanner)
database = client.RecipePlanner

# Collection name (recipes)
recipe_collection = database.get_collection("recipes_collection")

# Connection check function
async def test_connection():
    try:
        await client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")