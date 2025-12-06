FROM python:3.12-slim

WORKDIR /app

RUN apt update && apt install -y \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    && apt clean

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
