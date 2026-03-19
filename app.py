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

    input_df = pd.DataFrame([[ 
        data["latitude"], data["longitude"], data["vs30"],
        soil, data["floors"], material,
        data["building_age"], foundation
    ]], columns=[
        "latitude","longitude","vs30","soil_type","floors",
        "building_material","building_age","foundation_type"
    ])

    pred = model.predict(input_df)[0]

    return {"prediction": int(pred)}