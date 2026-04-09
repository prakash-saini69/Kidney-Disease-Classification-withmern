import io
import os
from typing import Dict, List

import numpy as np
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from PIL import Image
from tensorflow.keras.models import load_model


def resolve_model_path() -> str:
    candidates = [
        os.getenv("MODEL_PATH", ""),
        os.path.join("artifacts", "training", "model.h5"),
        os.path.join("model", "model.h5"),
    ]
    for path in candidates:
        if path and os.path.exists(path):
            return path
    raise FileNotFoundError("No model file found in expected paths.")


def default_label_map(num_classes: int) -> Dict[int, str]:
    if num_classes <= 2:
        return {0: "Normal", 1: "Tumor"}
    if num_classes == 4:
        return {0: "Normal", 1: "Cyst", 2: "Tumor", 3: "Stone"}
    return {i: f"Class_{i}" for i in range(num_classes)}


app = FastAPI(title="Kidney ML Inference Service", version="1.0.0")
model_path = resolve_model_path()
model = load_model(model_path)
num_classes = int(model.output_shape[-1])
LABEL_MAP = default_label_map(num_classes)


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize((224, 224))
    arr = np.asarray(image, dtype=np.float32)
    arr = np.expand_dims(arr, axis=0)
    return arr


def probabilities_to_list(pred: np.ndarray) -> List[float]:
    probs = pred.astype(np.float32).flatten().tolist()
    return [float(x) for x in probs]


@app.get("/health")
def health():
    return {"success": True, "service": "ml-service", "status": "ok", "model_path": model_path}


@app.post("/predict")
async def predict(file: UploadFile = File(...), request_id: str = Form(default="")):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

        image_bytes = await file.read()
        input_tensor = preprocess_image(image_bytes)
        prediction_vector = model.predict(input_tensor, verbose=0)[0]

        class_index = int(np.argmax(prediction_vector))
        confidence = float(prediction_vector[class_index])
        prediction_label = LABEL_MAP.get(class_index, f"Class_{class_index}")

        return {
            "success": True,
            "request_id": request_id,
            "prediction": prediction_label,
            "confidence": confidence,
            "raw_output": {
                "class_index": class_index,
                "probabilities": probabilities_to_list(prediction_vector),
                "labels": LABEL_MAP,
            },
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(exc)}") from exc
