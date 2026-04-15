# ======================================
# EARTHQUAKE DAMAGE PREDICTION (FINAL)
# ======================================

import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix


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
    "latitude", "longitude", "vs30", "richter_scale",
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
    X, y, test_size=0.2, random_state=42, stratify=y
)


# =========================
# RANDOM FOREST MODEL
# =========================
model = RandomForestClassifier(
    n_estimators=300,
    max_depth=10,
    random_state=42,
    class_weight="balanced"
)

model.fit(X_train, y_train)


# =========================
# EVALUATION
# =========================
y_pred = model.predict(X_test)

print("\nModel Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))
print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))


# =========================
# PREDICTION FUNCTION
# =========================
def predict_damage():
    print("\nEnter Inputs:\n")

    lat = float(input("Latitude: "))
    lon = float(input("Longitude: "))
    vs30 = float(input("Vs30: "))
    richter = float(input("Richter Scale (4.0 - 8.5): "))

    soil = input("Soil (rock/sand/clay/alluvium): ").lower()
    floors = int(input("Floors: "))
    material = input("Material (rc/brick/steel): ").lower()
    age = int(input("Building Age: "))
    foundation = input("Foundation (pile/shallow/raft): ").lower()

    try:
        # Encode categorical inputs
        soil_encoded = encoders["soil_type"].transform([soil])[0]
        material_encoded = encoders["building_material"].transform([material])[0]
        foundation_encoded = encoders["foundation_type"].transform([foundation])[0]
    except ValueError as e:
        print("\nError: Invalid categorical input.")
        print("Allowed values:")
        print("Soil:", list(encoders["soil_type"].classes_))
        print("Material:", list(encoders["building_material"].classes_))
        print("Foundation:", list(encoders["foundation_type"].classes_))
        return

    input_df = pd.DataFrame([[
        lat, lon, vs30, richter,
        soil_encoded, floors,
        material_encoded, age,
        foundation_encoded
    ]], columns=features)

    pred = model.predict(input_df)[0]

    labels = {
        0: "No Damage",
        1: "Minor Damage",
        2: "Moderate Damage",
        3: "Severe Damage",
        4: "Collapse Risk"
    }

    print("\nPredicted Damage Level:", labels[pred])


# =========================
# FEATURE IMPORTANCE
# =========================
importance = pd.DataFrame({
    "Feature": features,
    "Importance": model.feature_importances_
}).sort_values(by="Importance", ascending=False)

print("\nFeature Importance:\n", importance)


# =========================
# SAVE MODEL & ENCODERS
# =========================
joblib.dump(model, "earthquake_model.pkl")
joblib.dump(encoders, "encoders.pkl")

print("\nModel and encoders saved successfully.")


# =========================
# RUN PREDICTION (OPTIONAL)
# =========================
# predict_damage()