"""Evaluate the accuracy of the trained model.pkl"""

import joblib
from pathlib import Path
import sys
import io

# Set UTF-8 encoding for Windows console
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Load the model
MODEL_PATH = Path(__file__).parent / "model.pkl"

if not MODEL_PATH.is_file():
    print("[ERROR] model.pkl not found. Train the model first using the /train endpoint.")
    exit(1)

# Load the persisted model payload
payload = joblib.load(MODEL_PATH)

# Extract metrics
metrics = payload.get("metrics", {})

# Display results
print("=" * 60)
print("MODEL ACCURACY REPORT")
print("=" * 60)
print(f"\nModel Type: RandomForestRegressor")
print(f"Model Path: {MODEL_PATH}")

# Check if metrics exist
if metrics:
    print(f"\nPerformance Metrics:")
    r2_score = metrics.get('r2_score')
    mae = metrics.get('mae')
    rmse = metrics.get('rmse')
    
    if r2_score is not None:
        print(f"   * R2 Score:  {r2_score:.4f}")
    else:
        print("   * R2 Score:  N/A")
        
    if mae is not None:
        print(f"   * MAE:       {mae:.4f}")
    else:
        print("   * MAE:       N/A")
        
    if rmse is not None:
        print(f"   * RMSE:      {rmse:.4f}")
    else:
        print("   * RMSE:      N/A")
    
    print(f"\nDataset Info:")
    print(f"   * Training Samples:  {metrics.get('train_samples', 'N/A')}")
    print(f"   * Test Samples:      {metrics.get('test_samples', 'N/A')}")
    
    print("\n" + "=" * 60)
    
    # Interpretation
    r2 = metrics.get('r2_score', 0)
    if r2 is not None:
        if r2 >= 0.9:
            print("[SUCCESS] Excellent model performance!")
        elif r2 >= 0.7:
            print("[SUCCESS] Good model performance!")
        elif r2 >= 0.5:
            print("[WARNING] Moderate model performance - consider improvement.")
        else:
            print("[WARNING] Poor model performance - retraining recommended.")
    print("=" * 60)
else:
    print("\n[WARNING] No metrics found in model.pkl")
    print("The model was likely trained with an older version of the code.")
    print("Please retrain the model using the /train endpoint to get metrics.")
    print("=" * 60)
