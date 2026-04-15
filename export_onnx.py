"""
Export the deployed model artifacts to ONNX + JSON label-encoder mappings.

This is the "Option 2" deployment path for Vercel serverless functions:
- Vercel will run inference via `onnxruntime` (small runtime deps)
- You commit `earthquake_model.onnx` and `encoders.json`
"""

from __future__ import annotations

import json
import joblib
import os

import onnx
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType


def _root_path(*parts: str) -> str:
  return os.path.join(os.path.dirname(__file__), *parts)


def main() -> None:
  model = joblib.load(_root_path("earthquake_model.pkl"))
  encoders = joblib.load(_root_path("encoders.pkl"))

  # Training feature order:
  # latitude, longitude, vs30, soil_type, floors, building_material, building_age, foundation_type
  num_features = 9

  initial_type = [("input", FloatTensorType([None, num_features]))]
  onnx_model = convert_sklearn(model, initial_types=initial_type)
  onnx.save(onnx_model, _root_path("earthquake_model.onnx"))

  # Convert LabelEncoders to simple lookup tables for inference.
  def export_mapping(le) -> dict[str, int]:
    # LabelEncoder has `classes_` in the order used by `.transform()`.
    mapping: dict[str, int] = {}
    for idx, cls in enumerate(le.classes_):
      mapping[str(cls)] = int(idx)
    return mapping

  out_encoders = {
    "soil_type": export_mapping(encoders["soil_type"]),
    "building_material": export_mapping(encoders["building_material"]),
    "foundation_type": export_mapping(encoders["foundation_type"]),
  }

  with open(_root_path("encoders.json"), "w", encoding="utf-8") as f:
    json.dump(out_encoders, f, indent=2)

  print("Export complete:")
  print("- earthquake_model.onnx")
  print("- encoders.json")


if __name__ == "__main__":
  main()

