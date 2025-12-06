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
from sqlalchemy.orm import declarative_base
from starlette.types import HTTPExceptionHandler

app = FastAPI()
Base = declarative_base()


class TaskSQL(Base):
    __tablename__ = "courses"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    data = Column(String, nullable=False)
    text = Column(String, nullable=True)
    video = Column(String, nullable=True)
    image = Column(String, nullable=True)


class CourseSchema(BaseModel):
    name: str


class TaskCreate(BaseModel):
    title: str
    data: str | None
    text: str | None
    video: str | None
    image: str | None


class TaskUpdate(BaseModel):
    title: str | None = None
    data: str | None = None
    text: str | None = None
    video: str | None = None
    image: str | None = None


class TaskSchema(TaskCreate):
    id: str


courses = [
    CourseSchema(name="first"),
    CourseSchema(name="second"),
    CourseSchema(name="thirt"),
]


def get_db(name: str):
    conn = sqlite3.connect(f"{name}.db")
    conn.row_factory = sqlite3.Row  # чтобы получать dict-like результаты
    return conn


@app.post("/courses", summary="make course", tags=["TASKS"])
def create_course(new_course: CourseSchema):
    init_course_db(new_course.name)
    return {"status": "created", "course": new_course.name}


@app.post(
    "/courses/{course_name}/tasks",
    response_model=TaskSchema,
    summary="make task",
    tags=["TASKS"],
)
def create_task(task: TaskCreate, course_name: str):
    conn = get_db(course_name)
    cur = conn.cursor()
    new_task_id = str(uuid.uuid4())
    cur.execute(
        "INSERT INTO tasks (id, title, data, text, video, image) VALUES (?, ?, ?, ?, ?, ?)",
        (new_task_id, task.title, task.data, task.text, task.video, task.image),
    )
    conn.commit()
    # task_id = cur.lastrowid
    # assert task_id is not None
    conn.close()

    return TaskSchema(id=new_task_id, **task.dict())


def init_course_db(course_name: str):
    conn = get_db(course_name)
    cur = conn.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        data TEXT,
        text TEXT,
        video TEXT,
        image TEXT
    )
    """)
    conn.commit()
    conn.close()


@app.get(
    "/courses/{course_name}/tasks", summary="get all tasks from course", tags=["TASKS"]
)
def get_tasks(course_name: str):
    init_course_db(course_name)  # гарантия, что таблица есть

    conn = get_db(course_name)
    cur = conn.cursor()

    cur.execute("SELECT id, title, data, text, video, image FROM tasks")
    rows = cur.fetchall()
    conn.close()

    # преобразуем sqlite3.Row → dict
    tasks = [dict(row) for row in rows]

    return tasks


@app.get(
    "/courses/{course_name}/tasks/{task_id}",
    response_model=TaskSchema,
    summary="get task by id",
    tags=["TASKS"],
)
def get_task_by_id(course_name: str, task_id: str):
    # Проверка, что task_id корректный UUID
    try:
        UUID(task_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")

    init_course_db(course_name)

    conn = get_db(course_name)
    cur = conn.cursor()

    cur.execute(
        "SELECT id, title, data, text, video, image FROM tasks WHERE id = ?", (task_id,)
    )
    row = cur.fetchone()
    conn.close()

    if row is None:
        raise HTTPException(status_code=404, detail="Task not found")

    return TaskSchema(**dict(row))


@app.patch(
    "/courses/{course_name}/tasks/{task_id}",
    response_model=TaskSchema,
    summary="update task by id",
    tags=["TASKS"],
)
def update_task(course_name: str, task_id: str, updates: TaskUpdate):
    # Проверка UUID
    try:
        UUID(task_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")

    init_course_db(course_name)

    conn = get_db(course_name)
    cur = conn.cursor()

    # Проверяем существование
    cur.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    row = cur.fetchone()

    if row is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = updates.dict(exclude_unset=True)

    if not update_data:
        conn.close()
        return TaskSchema(**dict(row))

    fields = ", ".join([f"{key} = ?" for key in update_data.keys()])
    values = list(update_data.values()) + [task_id]

    cur.execute(f"UPDATE tasks SET {fields} WHERE id = ?", values)
    conn.commit()

    # Возвращаем обновлённую запись
    cur.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    updated_row = cur.fetchone()
    conn.close()

    return TaskSchema(**dict(updated_row))


@app.delete(
    "/courses/{course_name}/tasks/{task_id}",
    summary="delete task by id",
    tags=["TASKS"],
)
def delete_task(course_name: str, task_id: str):
    # Проверка UUID
    try:
        UUID(task_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")

    init_course_db(course_name)

    conn = get_db(course_name)
    cur = conn.cursor()

    # Проверяем, есть ли задача
    cur.execute("SELECT id FROM tasks WHERE id = ?", (task_id,))
    row = cur.fetchone()

    if row is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")

    # Удаляем
    cur.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()

    return {"status": "deleted", "task_id": task_id}
