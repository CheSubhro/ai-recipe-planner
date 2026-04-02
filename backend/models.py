# Pydantic models (Schemas)

from pydantic import BaseModel, Field
from typing import List, Optional

# Recipe schema
class RecipeSchema(BaseModel):
    title: str = Field(...)
    ingredients: List[str] = Field(...)
    instructions: str = Field(...)
    prep_time: Optional[int] = None 

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Alu Bhaji",
                "ingredients": ["Alu", "Piyaj", "Lonka"],
                "instructions": "Alu kete bhajun...",
                "prep_time": 15
            }
        }