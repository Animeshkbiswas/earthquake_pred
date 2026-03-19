# ======================================
# EARTHQUAKE DAMAGE PREDICTION (FINAL)
# ======================================

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score


# =========================
# LOAD DATA
# =========================
data = pd.read_csv("earthquake_damage_2000.csv")


# =========================
# ENCODE CATEGORICAL DATA
# =========================
encoders = {}
categorical_cols = ["soil_type", "building_material", "foundation_type"]

for col in categorical_cols:
    le = LabelEncoder()
    data[col] = le.fit_transform(data[col])
    encoders[col] = le


# =========================
# FEATURES & TARGET
# =========================
features = [
    "latitude", "longitude", "vs30",
    "soil_type", "floors",
    "building_material", "building_age",
    "foundation_type"
]

X = data[features]
y = data["damage_level"]


# =========================
# TRAIN TEST SPLIT
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)


# =========================
# RANDOM FOREST MODEL
# =========================
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=8,
    random_state=42
)

model.fit(X_train, y_train)


# =========================
# EVALUATION
# =========================
y_pred = model.predict(X_test)

print("Model Accuracy:", accuracy_score(y_test, y_pred))


# =========================
# PREDICTION FUNCTION
# =========================
def predict_damage():
    print("\nEnter Inputs:\n")

    lat = float(input("Latitude: "))
    lon = float(input("Longitude: "))
    vs30 = float(input("Vs30: "))

    soil = input("Soil (rock/sand/clay/alluvium): ")
    floors = int(input("Floors: "))
    material = input("Material (rc/brick/steel/wood): ")
    age = int(input("Building Age: "))
    foundation = input("Foundation (pile/shallow/raft): ")

    # Encode
    soil = encoders["soil_type"].transform([soil])[0]
    material = encoders["building_material"].transform([material])[0]
    foundation = encoders["foundation_type"].transform([foundation])[0]

    input_df = pd.DataFrame([[
        lat, lon, vs30, soil,
        floors, material, age, foundation
    ]], columns=features)

    pred = model.predict(input_df)[0]

    labels = {
        0: "No Damage",
        1: "Minor",
        2: "Moderate",
        3: "Severe",
        4: "Collapse Risk"
    }

    print("\nPrediction:", labels[pred])


# =========================
# RUN
# =========================
#predict_damage()

import joblib

joblib.dump(model, "earthquake_model.pkl")
joblib.dump(encoders, "encoders.pkl")