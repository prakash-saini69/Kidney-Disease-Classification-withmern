FROM python:3.10-slim

WORKDIR /app

COPY ml-service/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY ml-service/app.py ./app.py
COPY ml-service/model ./model

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
