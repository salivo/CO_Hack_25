import io
import os
import sqlite3
import uuid
from pathlib import Path
from uuid import UUID

import requests
from authx import AuthX, AuthXConfig
from fastapi import FastAPI, File, HTTPException, Query, Request, UploadFile
from fastapi.exceptions import RequestValidationError
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from PIL import Image
from pydantic import BaseModel, Field
from pydantic.fields import FieldInfo
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import Session, declarative_base
from starlette.types import HTTPExceptionHandler

app = FastAPI()
Base = declarative_base()
DATABASE_URL = "sqlite:///./users.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})


class UserSQL(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    avatar = Column(String, nullable=False)
    role = Column(String, nullable=False)

    xp_points = Column(Integer, nullable=False, default=0)
    level = Column(Integer, nullable=False, default=0)
    learning_streak = Column(Integer, nullable=False, default=0)
    completed_lessons_count = Column(Integer, nullable=False, default=0)
    # last_active_at =

    # created_at =
    # updated_at =


class UserCreate(BaseModel):
    name: str
    avatar: str | None
    role: str = Query("student", enum=["student", "teacher", "administrator"])

    xp_points: int = Field(0, ge=0)
    level: int = Field(0, ge=0)
    learning_streak: int = Field(0, ge=0)
    completed_lessons_count: int = Field(0, ge=0)


class UserSchema(UserCreate):
    id: str

    class Config:
        from_attributes = True  # ORM mode


class UserUpdate(BaseModel):
    name: str | None = None
    avatar: str | None = None
    role: str | None = None

    xp_points: int | None = Field(None, ge=0)
    level: int | None = Field(None, ge=0)
    learning_streak: int | None = Field(None, ge=0)
    completed_lessons_count: int | None = Field(None, ge=0)


def get_db():
    conn = sqlite3.connect("users.db")
    conn.row_factory = sqlite3.Row  # чтобы получать dict-like результаты
    return conn


@app.post(
    "/users",
    response_model=UserSchema,
    summary="make user",
    tags=["USERS"],
)
def create_user(user: UserCreate):
    conn = get_db()
    cur = conn.cursor()
    new_user_id = str(uuid.uuid4())
    cur.execute(
        "INSERT INTO users (id, name, avatar, role, xp_points, level, learning_streak, completed_lessons_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (
            new_user_id,
            user.name,
            user.avatar,
            user.role,
            0,
            0,
            0,
            0,
        ),
    )
    conn.commit()
    # user_id = cur.lastrowid
    # assert user_id is not None
    conn.close()

    return UserSchema(id=new_user_id, **user.dict())


def init_course_db():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        avatar TEXT,
        role TEXT,
        xp_points INTEGER DEFAULT 0,
        level INTEGER DEFAULT 0,
        learning_streak INTEGER DEFAULT 0,
        completed_lessons_count INTEGER DEFAULT 0
    )
    """)
    conn.commit()
    conn.close()


@app.get("/users", summary="get all users", tags=["USERS"])
def get_users():
    init_course_db()

    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        "SELECT id, name, avatar, role, xp_points, level, learning_streak, completed_lessons_count FROM users"
    )
    rows = cur.fetchall()
    conn.close()

    # преобразуем sqlite3.Row → dict
    users = [dict(row) for row in rows]

    return users


@app.get(
    "/users/{user_id}",
    response_model=UserSchema,
    summary="get user by id",
    tags=["USERS"],
)
def get_user_by_id(user_id: str):
    try:
        UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")

    init_course_db()

    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        "SELECT id, name, avatar, role, xp_points, level, learning_streak, completed_lessons_count FROM users WHERE id = ?",
        (user_id,),
    )
    row = cur.fetchone()
    conn.close()

    if row is None:
        raise HTTPException(status_code=404, detail="user not found")

    return UserSchema(**dict(row))


@app.patch(
    "/users/{user_id}", response_model=UserSchema, summary="Update user", tags=["USERS"]
)
def update_user(user_id: str, data: UserUpdate):
    # validate UUID
    try:
        UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID")

    with Session(engine) as session:
        user = session.query(UserSQL).filter(UserSQL.id == user_id).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # APPLY ONLY PROVIDED FIELDS
        for field, value in data.dict(exclude_unset=True).items():
            setattr(user, field, value)

        session.commit()

        return UserSchema.model_validate(user)


init_course_db()
######  uvicorn main:app --reload --host 0.0.0.0 --port 8003
#
