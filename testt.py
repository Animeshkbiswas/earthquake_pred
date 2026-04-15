import onnxruntime as ort

# Load the ONNX model
session = ort.InferenceSession("earthquake_model.onnx")

# Get input details
input_info = session.get_inputs()[0]

print("Input Name:", input_info.name)
print("Input Shape:", input_info.shape)
print("Input Type:", input_info.type)