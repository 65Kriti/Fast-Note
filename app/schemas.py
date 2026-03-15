from pydantic import BaseModel, ConfigDict
from typing import Optional

class BlogPostBase(BaseModel):
    title: str
    content: str

class BlogPostCreate(BlogPostBase):
    pass

# Schema for updating - fields are optional so you can update just the title or just the content
class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class BlogPost(BlogPostBase):
    id: int
    
    # Modern Pydantic v2 configuration
    model_config = ConfigDict(from_attributes=True) 