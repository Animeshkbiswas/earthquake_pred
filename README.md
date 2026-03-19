# Earthquake Damage Predictor

This project includes:

- A **React + Tailwind** frontend (`frontend/`) that calls your FastAPI backend
- A **FastAPI** backend (`app.py`) that exposes `POST /predict` locally
- A **Vercel serverless** backend (`api/predict.py`) that exposes `POST /predict` on Vercel

## 1) Start the FastAPI backend (local)

From the repo root (`adarsh/`):

```bash
python -m uvicorn api.predict:app --host 127.0.0.1 --port 8000 --reload
```

The frontend expects the backend at `http://127.0.0.1:8000/predict`.

Note: Option 2 requires the ONNX artifacts to exist in the repo root:
- `earthquake_model.onnx`
- `encoders.json`

## 2) Start the React frontend

```bash
cd frontend
npm install
npm start
```

Then open:

- `http://localhost:5173/`

## Notes

- During development, the frontend uses a Vite proxy (see `frontend/vite.config.ts`) to forward requests to the FastAPI backend, so you should not need to enable CORS for local dev.

## Deploy to Vercel (Frontend + Backend together)

### 1. Ensure required files are present in the repo you upload
For Option 2, the Vercel function loads these from the repo root:
- `earthquake_model.onnx`
- `encoders.json`

Make sure they are included in the deployment source (for example, committed to your Git repo).

#### Generate ONNX + encoder mappings (run locally once)
1. Install conversion dependencies:
   - `pip install skl2onnx onnx`
2. Run:
   - `python export_onnx.py`
3. Commit the generated files:
   - `earthquake_model.onnx`
   - `encoders.json`

### 2. You should now have these Vercel files
- `api/predict.py` (FastAPI serverless function)
- `requirements.txt` (Python dependencies)
- `vercel.json` (rewrite `/predict` -> `/api/predict`)

### 3. Create a Vercel project
1. Go to Vercel and click **Add New… → Project**
2. Connect your repo (GitHub/GitLab/Bitbucket) or upload from your source.
3. Set **Project Root Directory** to the repo root (the folder that contains `frontend/`, `api/`, `vercel.json`).

### 4. Configure the frontend build settings
In your Vercel project settings:
1. Framework preset: you can use **Other** (or Vite if it appears)
2. Build command:
   - `cd frontend && npm install && npm run build`
3. Output directory:
   - `frontend/dist`

### 5. Deploy
Click **Deploy**.

### 6. Verify production endpoints
After deployment:
- Open your app URL and click **Predict**
- The frontend calls `POST /predict` (same domain)
- Vercel rewrite sends it to the serverless function at `api/predict.py`

Optional quick test: from any REST client, call `POST https://<your-domain>/predict` with the JSON body your frontend sends.

