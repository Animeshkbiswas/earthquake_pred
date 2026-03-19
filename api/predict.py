from __future__ import annotations

import os
from functools import lru_cache
from typing import Literal

import joblib
import pandas as pd
from fastapi import FastAPI
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


@lru_cache(maxsize=1)
def load_artifacts() -> tuple[object, dict]:
  model = joblib.load(_root_path("earthquake_model.pkl"))
  encoders = joblib.load(_root_path("encoders.pkl"))
  return model, encoders


@app.post("/")
@app.post("/predict")
def predict(req: PredictRequest):
  model, encoders = load_artifacts()

  # The model expects categorical values encoded using the saved LabelEncoders.
  soil = encoders["soil_type"].transform([req.soil_type])[0]
  material = encoders["building_material"].transform([req.building_material])[0]
  foundation = encoders["foundation_type"].transform([req.foundation_type])[0]

  input_df = pd.DataFrame(
    [
      [
        req.latitude,
        req.longitude,
        req.vs30,
        soil,
        req.floors,
        material,
        req.building_age,
        foundation,
      ]
    ],
    columns=[
      "latitude",
      "longitude",
      "vs30",
      "soil_type",
      "floors",
      "building_material",
      "building_age",
      "foundation_type",
    ],
  )

  pred = model.predict(input_df)[0]
  pred_int = int(pred)

  return {"prediction": pred_int, "label": LABELS.get(pred_int, "Unknown")}

