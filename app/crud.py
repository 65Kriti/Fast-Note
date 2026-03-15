from sqlalchemy.orm import Session
from . import models, schemas

# --- READ ---
def get_blog_post(db: Session, blog_post_id: int):
    return db.query(models.BlogPost).filter(models.BlogPost.id == blog_post_id).first()

def get_blog_posts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.BlogPost).offset(skip).limit(limit).all()

# --- CREATE ---
def create_blog_post(db: Session, blog_post: schemas.BlogPostCreate):
    db_blog_post = models.BlogPost(**blog_post.model_dump())
    db.add(db_blog_post)
    db.commit()
    db.refresh(db_blog_post)
    return db_blog_post

# --- UPDATE ---
def update_blog_post(db: Session, blog_post_id: int, blog_post: schemas.BlogPostUpdate):
    db_blog_post = db.query(models.BlogPost).filter(models.BlogPost.id == blog_post_id).first()
    if db_blog_post:
        # exclude_unset=True ensures we only update fields the user actually sent
        update_data = blog_post.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_blog_post, key, value)
        db.commit()
        db.refresh(db_blog_post)
    return db_blog_post

# --- DELETE ---
def delete_blog_post(db: Session, blog_post_id: int):
    db_blog_post = db.query(models.BlogPost).filter(models.BlogPost.id == blog_post_id).first()
    if db_blog_post:
        db.delete(db_blog_post)
        db.commit()
    return db_blog_post