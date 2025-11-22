"""Debug script to run training logic directly"""
import pathlib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import joblib

# Constants
CSV_PATH = pathlib.Path("dynamic_supply_chain_logistics_dataset.csv").resolve()
MODEL_PATH = pathlib.Path("model.pkl").resolve()
WAREHOUSE_IDS = ["WH-MUM", "WH-DEL", "WH-BLR", "WH-PUN"]
PRODUCT_IDS = [f"PROD-{i:03d}" for i in range(1, 21)]

# Global objects
model = None
warehouse_encoder = None
product_encoder = None

def _enrich_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    rng = np.random.default_rng(seed=42)
    df["warehouse_id"] = rng.choice(WAREHOUSE_IDS, size=len(df))
    df["product_id"] = rng.choice(PRODUCT_IDS, size=len(df))
    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")
    df["day_of_week"] = df["timestamp"].dt.dayofweek
    df["month"] = df["timestamp"].dt.month
    return df

def _prepare_features(df: pd.DataFrame):
    global warehouse_encoder, product_encoder
    warehouse_encoder = LabelEncoder()
    product_encoder = LabelEncoder()
    df["warehouse_id_enc"] = warehouse_encoder.fit_transform(df["warehouse_id"])
    df["product_id_enc"] = product_encoder.fit_transform(df["product_id"])

    feature_cols = [
        "warehouse_id_enc",
        "product_id_enc",
        "day_of_week",
        "traffic_congestion_level",
    ]
    X = df[feature_cols].values
    y = df["warehouse_inventory_level"].values
    return X, y

def train():
    print(f"Loading data from {CSV_PATH}")
    if not CSV_PATH.is_file():
        print(f"Error: File not found at {CSV_PATH}")
        return

    raw_df = pd.read_csv(CSV_PATH)
    print("Enriching dataframe...")
    enriched_df = _enrich_dataframe(raw_df)
    
    print("Preparing features...")
    X, y = _prepare_features(enriched_df)
    
    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training model...")
    rf = RandomForestRegressor(random_state=42, n_estimators=100)
    rf.fit(X_train, y_train)
    
    print("Calculating metrics...")
    y_pred = rf.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = mean_squared_error(y_test, y_pred, squared=False)
    
    print(f"R2: {r2}")
    print(f"MAE: {mae}")
    print(f"RMSE: {rmse}")

if __name__ == "__main__":
    try:
        train()
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
