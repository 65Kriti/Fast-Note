from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from . import crud, models, schemas, database

router = APIRouter()

# Dependency to properly manage DB sessions
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- CREATE ---
@router.post("/blog_posts/", response_model=schemas.BlogPost)
def create_blog_post(blog_post: schemas.BlogPostCreate, db: Session = Depends(get_db)):
    return crud.create_blog_post(db=db, blog_post=blog_post)

# --- READ ---
@router.get("/blog_posts/{blog_post_id}", response_model=schemas.BlogPost)
def read_blog_post(blog_post_id: int, db: Session = Depends(get_db)):
    db_blog_post = crud.get_blog_post(db, blog_post_id=blog_post_id)
    if db_blog_post is None:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return db_blog_post

@router.get("/blog_posts/", response_model=List[schemas.BlogPost])
def read_blog_posts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_blog_posts(db, skip=skip, limit=limit)

# --- UPDATE ---
@router.put("/blog_posts/{blog_post_id}", response_model=schemas.BlogPost)
def update_blog_post(blog_post_id: int, blog_post: schemas.BlogPostUpdate, db: Session = Depends(get_db)):
    db_blog_post = crud.update_blog_post(db, blog_post_id=blog_post_id, blog_post=blog_post)
    if db_blog_post is None:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return db_blog_post

# --- DELETE ---
@router.delete("/blog_posts/{blog_post_id}")
def delete_blog_post(blog_post_id: int, db: Session = Depends(get_db)):
    db_blog_post = crud.delete_blog_post(db, blog_post_id=blog_post_id)
    if db_blog_post is None:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"message": "Blog post successfully deleted"}