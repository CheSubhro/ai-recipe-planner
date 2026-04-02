
import os
import json
from google import genai
from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai.types import HttpOptions

# Import your custom modules
from database import recipe_collection, test_connection
from models import RecipeSchema

load_dotenv()

if "GOOGLE_API_KEY" in os.environ:
    del os.environ["GOOGLE_API_KEY"]

# Gemini Configure
genai_client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY"),
    http_options=HttpOptions(api_version="v1") 
)


app = FastAPI()

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IngredientsInput(BaseModel):
    ingredients: str

@app.on_event("startup")
async def startup_db_client():
    await test_connection()

# --- Recipe Save API (POST) ---
@app.post("/api/recipes")
async def create_recipe(recipe: RecipeSchema = Body(...)):
    # convert Pydantic model to Dictionary 
    recipe_dict = jsonable_encoder(recipe)
    
    # insert MongoDB
    new_recipe = await recipe_collection.insert_one(recipe_dict)
    
    return {"id": str(new_recipe.inserted_id), "message": "Recipe added successfully!"}

# --- All Recipe API (GET) ---
@app.get("/api/recipes")
async def get_all_recipes():
    recipes = []
    # fetch form Database 
    async for recipe in recipe_collection.find():
        recipe["_id"] = str(recipe["_id"]) # convert MongoDB ID- to string
        recipes.append(recipe)
    return recipes

@app.post("/api/recipes/search")
async def search_recipes(user_ingredients: list = Body(...)): # Body(...) add 
    matched_recipes = []
    
    async for recipe in recipe_collection.find():
        # compare Recipe ingredients and user ingredients 
        recipe_ingredients = [i.lower() for i in recipe['ingredients']]
        
        if any(item.lower() in recipe_ingredients for item in user_ingredients):
            recipe["_id"] = str(recipe["_id"])
            matched_recipes.append(recipe)
            
    return matched_recipes 

# --- AI GENERATOR ---
@app.post("/api/ai/generate")
async def generate_ai_recipe(data: IngredientsInput):
    try:
        # Improved Prompt for 2026 standards
        prompt = f"""
        Suggest a recipe using {data.ingredients}. 
        Return ONLY a JSON object. 
        Structure: 
        {{
            "title": "string",
            "ingredients": ["string", "string"],
            "instructions": "string steps separated by periods"
        }}
        Do not use markdown or extra text.
        """

        response = genai_client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )

        # Clean JSON String
        recipe_text = response.text.strip()
        if "```" in recipe_text:
            # More robust cleaning
            recipe_text = recipe_text.replace("```json", "").replace("```", "").strip()
        
        recipe_data = json.loads(recipe_text)

        # Ensure the AI didn't miss any keys (Safety check)
        required_keys = ["title", "ingredients", "instructions"]
        if not all(key in recipe_data for key in required_keys):
            raise ValueError("AI response missing required fields")

        # Save to MongoDB
        new_recipe = await recipe_collection.insert_one(recipe_data)
        recipe_data["_id"] = str(new_recipe.inserted_id)

        return recipe_data

    except Exception as e:
        print(f"AI Error: {e}")
        # Return 429 specifically if it's a quota issue
        if "429" in str(e):
             raise HTTPException(status_code=429, detail="API Quota full. Please wait 1 minute.")
        raise HTTPException(status_code=500, detail="Chef is busy. Try again later!")