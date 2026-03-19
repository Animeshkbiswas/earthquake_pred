from __future__ import annotations

import json
import os
from functools import lru_cache
from typing import Any, Literal

import numpy as np
import onnxruntime as ort
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()


class PredictRequest(BaseModel):
  latitude: float
  longitude: float
  vs30: float
  soil_type: Literal["rock", "sand", "clay", "alluvium"]
  floors: int
  building_material: Literal["rc", "brick", "steel", "wood"]
  building_age: int
  foundation_type: Literal["pile", "shallow", "raft"]


LABELS: dict[int, str] = {
  0: "No Damage",
  1: "Minor",
  2: "Moderate",
  3: "Severe",
  4: "Collapse Risk",
}


def _root_path(*parts: str) -> str:
  # `api/` lives under the repo root.
  return os.path.join(os.path.dirname(__file__), "..", *parts)


def _extract_prediction(onnx_outputs: list[Any]) -> int:
  # ONNX conversion for sklearn classifiers can output:
  # - label (shape: [1])
  # - probabilities (shape: [1, num_classes])
  for out in onnx_outputs:
    if not isinstance(out, np.ndarray):
      continue

    if out.ndim == 1 and out.shape[0] >= 1:
      # Often label output: [pred_label]
      value = out[0]
      try:
        return int(value)
      except Exception:
        pass

      value_f = float(value)
      if value_f.is_integer():
        return int(value_f)

    if out.ndim == 2 and out.shape[0] == 1 and out.shape[1] >= 2:
      # Probabilities output: [prob_0, prob_1, ...]
      return int(np.argmax(out[0]))

  raise ValueError("Could not extract prediction from ONNX outputs.")


@lru_cache(maxsize=1)
def load_artifacts() -> tuple[ort.InferenceSession, dict[str, dict[str, int]], str]:
  model_path = _root_path("earthquake_model.onnx")
  encoders_path = _root_path("encoders.json")

  if not os.path.exists(model_path):
    raise FileNotFoundError(
      "Missing `earthquake_model.onnx`. Run `python export_onnx.py` locally and commit the generated files."
    )
  if not os.path.exists(encoders_path):
    raise FileNotFoundError(
      "Missing `encoders.json`. Run `python export_onnx.py` locally and commit the generated files."
    )

  with open(encoders_path, "r", encoding="utf-8") as f:
    encoders: dict[str, dict[str, int]] = json.load(f)

  session = ort.InferenceSession(model_path, providers=["CPUExecutionProvider"])
  input_name = session.get_inputs()[0].name
  return session, encoders, input_name


@app.post("/")
@app.post("/predict")
def predict(req: PredictRequest):
  session, encoders, input_name = load_artifacts()

  try:
    soil = encoders["soil_type"][req.soil_type]
    material = encoders["building_material"][req.building_material]
    foundation = encoders["foundation_type"][req.foundation_type]
  except KeyError as e:
    raise HTTPException(status_code=400, detail=f"Unknown categorical value: {e}")

  # Feature order must match training:
  # latitude, longitude, vs30, soil_type, floors, building_material, building_age, foundation_type
  input_array = np.array(
    [
      [
        float(req.latitude),
        float(req.longitude),
        float(req.vs30),
        float(soil),
        float(req.floors),
        float(material),
        float(req.building_age),
        float(foundation),
      ]
    ],
    dtype=np.float32,
  )

  outputs = session.run(None, {input_name: input_array})
  pred_int = _extract_prediction(outputs)

  return {"prediction": pred_int, "label": LABELS.get(pred_int, "Unknown")}

