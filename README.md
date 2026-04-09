# Kidney Disease Classification - MLflow + DVC + Full Stack

Production-oriented monorepo refactor of the original kidney disease classification project.
The ML training pipeline is preserved (`ml-pipeline/`, `dvc.yaml`, `main.py`, `config/`, `params.yaml`) and a full-stack app layer is added.

## Project Structure

```text
.
|- backend/               # Node.js + Express API gateway
|- frontend/              # React + Tailwind UI
|- ml-service/            # FastAPI inference microservice
|- ml-pipeline/           # Existing training pipeline (preserved)
|- config/                # Existing config (preserved)
|- artifacts/             # DVC outputs (generated/preserved if present)
|- dvc.yaml               # Existing DVC stages (preserved)
|- params.yaml            # Existing model params (preserved)
|- main.py                # Existing ML pipeline runner (preserved)
`- docker-compose.yml     # Full local stack orchestration
```

## Architecture

1. **Frontend** (`frontend`)
   - React app with pages: Home, Upload & Predict, History, About
   - Calls backend REST APIs

2. **Backend API** (`backend`)
   - `POST /api/predict`: accepts image upload, calls ML service, stores result in MongoDB
   - `GET /api/history`: fetches latest predictions
   - `GET /api/health`: service health

3. **ML Service** (`ml-service`)
   - `POST /predict`: runs inference using existing trained model
   - `GET /health`: model/service health
   - Loads model once at startup

4. **Database**
   - MongoDB collection: `predictions`
   - Stores request id, file metadata, prediction, confidence, explanation, timestamps

## Preserved MLflow + DVC Workflow

Existing training and experiment tracking workflow remains intact:

- `ml-pipeline/cnnClassifier/...` (components, config, entity, pipeline)
- `dvc.yaml` stages
- `main.py` pipeline execution
- `params.yaml` and `config/config.yaml`

Run training as before:

```bash
python main.py
```

or

```bash
dvc repro
```

## Local Run (Docker - Recommended)

From project root:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- ML Service: `http://localhost:8000`
- MongoDB: `mongodb://localhost:27017`

## Local Run (Without Docker)

### 1) Backend

```bash
cd backend
npm install
# PowerShell: Copy-Item .env.example .env
# Bash: cp .env.example .env
npm run dev
```

### 2) ML Service

```bash
cd ml-service
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```

### 3) Frontend

```bash
cd frontend
npm install
# PowerShell: Copy-Item .env.example .env
# Bash: cp .env.example .env
npm run dev
```

### 4) MongoDB

Run MongoDB locally (or with Docker):

```bash
docker run -d -p 27017:27017 --name kidney-mongo mongo:7
```

## Environment Files

- `frontend/.env.example`
- `backend/.env.example`
- `ml-service/.env.example`

## Basic Verification

1. Open frontend and upload an image on `/predict`
2. Verify prediction result and confidence appears
3. Open `/history` and verify record is persisted
4. Check health endpoints:
   - `GET http://localhost:5000/api/health`
   - `GET http://localhost:8000/health`

## Notes

- Legacy Flask UI layer has been removed to keep the repository clean and service-oriented
- Trained model artifact now lives under `ml-service/model/`
- Training and inference remain separate
