# Deployment Guide (Vercel + Render + MongoDB Atlas)

This project is deployed as:

- Frontend (`frontend`) -> Vercel
- Backend (`backend`) -> Render Web Service (Docker)
- ML Service (`ml-service`) -> Render Web Service (Docker)
- Database -> MongoDB Atlas

## 1) Prerequisites

- Code pushed to GitHub
- MongoDB Atlas cluster ready
- Model file present at `ml-service/model/model.h5`

## 2) MongoDB Atlas Setup

1. Create a free cluster (M0).
2. Create a database user (example: `prakash`).
3. Add Network Access:
   - For initial setup: `0.0.0.0/0`
   - Tighten this later for better security.
4. Copy connection URI and replace placeholders:

```env
mongodb+srv://<username>:<password>@<cluster-host>/kidneyDB?retryWrites=true&w=majority
```

## 3) Deploy ML Service to Render

Create a new Render **Web Service**:

- Runtime: `Docker`
- Dockerfile path: `ml-service/Dockerfile`
- Name: `kidney-ml-service` (or your choice)

Environment variables:

```env
MODEL_PATH=model/model.h5
PORT=8000
```

After deploy, verify:

- `https://<ml-service>.onrender.com/health`

## 4) Deploy Backend to Render

Create another Render **Web Service**:

- Runtime: `Docker`
- Dockerfile path: `backend/Dockerfile`
- Name: `kidney-backend` (or your choice)

Environment variables:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/kidneyDB?retryWrites=true&w=majority
ML_SERVICE_URL=https://<ml-service>.onrender.com
FRONTEND_ORIGIN=https://<frontend>.vercel.app
```

After deploy, verify:

- `https://<backend>.onrender.com/api/health`

## 5) Deploy Frontend to Vercel

Import GitHub repository in Vercel.

Project settings:

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

Environment variable:

```env
VITE_API_BASE_URL=https://<backend>.onrender.com/api
```

Deploy and open:

- `https://<frontend>.vercel.app`

## 6) End-to-End Test

1. Open frontend URL.
2. Upload an image on Predict page.
3. Click submit.
4. Expected flow:
   - Frontend -> Backend -> ML Service -> MongoDB -> Frontend response
5. Verify history endpoint from frontend page and/or backend logs.

## 7) Common Issues

- `401 Unauthorized` on `/api/predict`
  - Backend not running or wrong service on same port.
- CORS error
  - Set `FRONTEND_ORIGIN` to exact Vercel domain and redeploy backend.
- Backend cannot reach ML service
  - Check `ML_SERVICE_URL` and ML health endpoint.
- MongoDB connection fails
  - Verify Atlas user/password, URI, and network access rules.
- Slow first request
  - Render free services may sleep and take time to wake.

## 8) Security Notes

- Never commit real credentials.
- Keep secrets only in Render/Vercel environment variables.
- Use strong Atlas password and rotate regularly.
