"""Script to trigger model training via the FastAPI endpoint"""

import urllib.request
import json
import sys
import io

# Set UTF-8 encoding for Windows console
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Call the training endpoint
print("Starting model training...")
print("=" * 60)

try:
    req = urllib.request.Request("http://127.0.0.1:8001/train", method="POST")
    with urllib.request.urlopen(req) as response:
        if response.status != 200:
            raise Exception(f"HTTP error: {response.status}")
        
        data = response.read()
        result = json.loads(data)
    
    print("Training completed successfully!")
    print("=" * 60)
    print(f"\nModel saved to: {result['model_path']}")
    print(f"\nPerformance Metrics:")
    print(f"   * R2 Score:  {result['r2_score']:.4f}")
    print(f"   * MAE:       {result['mae']:.4f}")
    print(f"   * RMSE:      {result['rmse']:.4f}")
    print(f"\nDataset Info:")
    print(f"   * Training Samples:  {result['train_samples']}")
    print(f"   * Test Samples:      {result['test_samples']}")
    print("\n" + "=" * 60)
    
    # Interpretation
    r2 = result['r2_score']
    if r2 >= 0.9:
        print("[SUCCESS] Excellent model performance!")
    elif r2 >= 0.7:
        print("[SUCCESS] Good model performance!")
    elif r2 >= 0.5:
        print("[WARNING] Moderate model performance - consider improvement.")
    else:
        print("[WARNING] Poor model performance - retraining recommended.")
    print("=" * 60)
    
except urllib.error.URLError as e:
    print(f"[ERROR] Could not connect to the API server: {e}")
    print("Make sure the FastAPI server is running on http://127.0.0.1:8001")
except Exception as e:
    print(f"[ERROR] An error occurred: {e}")
