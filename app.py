from fastapi import FastAPI
import pandas as pd
import joblib

app = FastAPI()

model = joblib.load("earthquake_model.pkl")
encoders = joblib.load("encoders.pkl")

@app.post("/predict")
def predict(data: dict):

    soil = encoders["soil_type"].transform([data["soil_type"]])[0]
    material = encoders["building_material"].transform([data["building_material"]])[0]
    foundation = encoders["foundation_type"].transform([data["foundation_type"]])[0]

    # Richter scale (magnitude). Support a few common keys.
    richter = data.get("richter")
    if richter is None:
        richter = data.get("richter_scale")
    if richter is None:
        richter = data.get("magnitude")

    # Some deployments may still load an 8-feature model; adapt to avoid 500s.
    expected = getattr(model, "n_features_in_", None)
    if expected == 8:
        input_df = pd.DataFrame([[
            data["latitude"], data["longitude"], data["vs30"],
            soil, data["floors"], material,
            data["building_age"], foundation
        ]], columns=[
            "latitude","longitude","vs30","soil_type","floors",
            "building_material","building_age","foundation_type"
        ])
    else:
        input_df = pd.DataFrame([[
            data["latitude"], data["longitude"], data["vs30"],
            float(richter), soil, data["floors"], material,
            data["building_age"], foundation
        ]], columns=[
            "latitude","longitude","vs30","richter","soil_type","floors",
            "building_material","building_age","foundation_type"
        ])

    pred = model.predict(input_df)[0]

    return {"prediction": int(pred)}