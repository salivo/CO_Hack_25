import io
import os
import uuid
from pathlib import Path

import cv2
import numpy as np
import requests
from authx import AuthX, AuthXConfig
from fastapi import FastAPI, File, HTTPException, Query, Request, UploadFile
from fastapi.exceptions import RequestValidationError
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from PIL import Image
from pydantic import BaseModel, Field
from pydantic.fields import FieldInfo
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from starlette.types import HTTPExceptionHandler

app = FastAPI()


class Msg(BaseModel):
    type: str


VIDEO_EXTENSIONS = [".mp4", ".mov", ".avi", ".mkv", ".webm"]

FILES_DIR = Path("./uploaded_files")


@app.post("/upload", summary="upload file", tags=["FILES"])
async def upload_file(uploaded_file: UploadFile):
    file = uploaded_file.file
    filename = uploaded_file.filename
    if not filename:
        raise HTTPException(400, "Filename is empty")

    ###names & same
    ext = Path(filename).suffix
    new_id = str(uuid.uuid4())
    # new_dir = FILES_DIR / new_id
    new_name = f"{new_id}{ext}"
    file_path = os.path.join(FILES_DIR, new_name)
    original_bytes = await uploaded_file.read()

    ###prev maker
    if ext not in [".txt", ".mp4"]:
        prev_name = f"{new_id}_prev.webp"
        file_prev_path = os.path.join(FILES_DIR, prev_name)
        compressed_file = await compress_to_webp_target_size(
            original_bytes, target_kb=0
        )
        with open(file_prev_path, "wb") as f:
            f.write(compressed_file)

        with open(file_path, "wb") as f:
            f.write(original_bytes)

    elif ext == ".txt":
        with open(file_path, "wb") as f:
            f.write(original_bytes)

    elif ext in VIDEO_EXTENSIONS:
        prev_name = f"{new_id}_prev.webp"
        preview_path = FILES_DIR / prev_name

        frame_bytes = await extract_video_frame_bytes(original_bytes)
        preview_path.write_bytes(frame_bytes)
        with open(file_path, "wb") as f:
            f.write(original_bytes)

    return {"id": new_id}


async def compress_to_webp_target_size(
    content: bytes,
    target_kb: int,
    min_quality: int = 20,
    max_quality: int = 90,
):
    img = Image.open(io.BytesIO(content))

    if img.mode not in ["RGB", "RGBA"]:
        img = img.convert("RGB")

    max_width = 1024
    if img.width > max_width:
        ratio = max_width / img.width
        new_size = (max_width, int(img.height * ratio))
        img = img.resize(new_size, Image.Resampling.LANCZOS)

    target_bytes = target_kb * 1024
    quality = max_quality

    while quality >= min_quality:
        buf = io.BytesIO()
        img.save(buf, format="WEBP", quality=quality, method=6)
        data = buf.getvalue()

        if len(data) <= target_bytes:
            return data  # достигли цели

        quality -= 10  # уменьшаем качество и пробуем снова

    # Если минимальное качество достигнуто, возвращаем лучший результат
    return data


@app.get("/download/{file_id}", summary="download file", tags=["FILES"])
async def download_file(
    file_id: str, mode: str = Query("full", enum=["full", "prev", "text"])
):
    if mode == "prev":
        preview_path = FILES_DIR / f"{file_id}_prev.webp"
        if not preview_path.exists():
            raise HTTPException(404, "Preview not found")

        return FileResponse(
            preview_path,
            filename=f"{file_id}_prev.webp",
            media_type="image/webp",
        )

    if mode == "text":
        text_path = FILES_DIR / f"{file_id}.txt"
        if not text_path.exists():
            raise HTTPException(404, "Text file not found")

        return FileResponse(
            text_path,
            filename=f"{file_id}.txt",
            media_type="text/txt",
        )

    # mode == "full"
    for file in FILES_DIR.iterdir():
        if file.name.startswith(file_id) and "_prev" not in file.name:
            return FileResponse(
                file, filename=file.name, media_type="application/octet-stream"
            )

    raise HTTPException(404, "File not found")


@app.get("/stream/{file_id}", summary="stream video", tags=["FILES"])
async def streaming_file(file_id: str):
    file_path = FILES_DIR / f"{file_id}.mp4"
    if not file_path.exists():
        raise HTTPException(404, "Video not found")

    return StreamingResponse(iterfile(str(file_path)), media_type="video/mp4")


async def extract_video_frame_bytes(video_bytes: bytes) -> bytes:
    # пишем во временный файл
    tmp_path = "/tmp/video_upload.mp4"
    with open(tmp_path, "wb") as f:
        f.write(video_bytes)

    cap = cv2.VideoCapture(tmp_path)

    success, frame = cap.read()
    cap.release()

    if not success:
        raise ValueError("Cannot extract frame")

    # конвертируем кадр в JPEG
    _, jpg_bytes = cv2.imencode(".jpg", frame)

    # превращаем JPEG в webp-превью
    compressed_prev = await compress_to_webp_target_size(
        jpg_bytes.tobytes(), target_kb=0
    )

    return compressed_prev


def iterfile(file_id: str):
    with open(file_id, "rb") as f:
        while chunk := f.read(1024 * 1024):
            yield chunk
