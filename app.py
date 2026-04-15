from fastapi import FastAPI, HTTPException
import pandas as pd
import joblib

app = FastAPI()

# Load model and encoders
model = joblib.load("earthquake_model.pkl")
encoders = joblib.load("encoders.pkl")

# Expected feature order from training
FEATURE_COLUMNS = [
    "latitude", "longitude", "vs30", "richter_scale",
    "soil_type", "floors",
    "building_material", "building_age",
    "foundation_type"
]


@app.get("/")
def home():
    return {"message": "Earthquake Damage Prediction API is running."}


@app.post("/predict")
def predict(data: dict):
    try:
        # Encode categorical inputs
        soil = encoders["soil_type"].transform(
            [data["soil_type"].lower()]
        )[0]

        material = encoders["building_material"].transform(
            [data["building_material"].lower()]
        )[0]

        foundation = encoders["foundation_type"].transform(
            [data["foundation_type"].lower()]
        )[0]

        # Ensure Richter scale is provided
        richter_scale = data.get("richter_scale") or data.get("richter") or data.get("magnitude")
        if richter_scale is None:
            raise HTTPException(
                status_code=400,
                detail="Richter scale is required. Use 'richter_scale'."
            )

        # Create DataFrame with correct feature names and order
        input_df = pd.DataFrame([[
            float(data["latitude"]),
            float(data["longitude"]),
            float(data["vs30"]),
            float(richter_scale),
            soil,
            int(data["floors"]),
            material,
            int(data["building_age"]),
            foundation
        ]], columns=FEATURE_COLUMNS)

        # Make prediction
        pred = model.predict(input_df)[0]

        labels = {
            0: "No Damage",
            1: "Minor Damage",
            2: "Moderate Damage",
            3: "Severe Damage",
            4: "Collapse Risk"
        }

        return {
            "prediction": int(pred),
            "damage_label": labels[int(pred)]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))