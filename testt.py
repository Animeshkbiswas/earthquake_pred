import joblib
model = joblib.load("earthquake_model.pkl")
print(model.feature_names_in_)