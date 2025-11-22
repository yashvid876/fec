# ml_service.py
"""FastAPI service for StockMaster inventory demand prediction.

- Loads and preprocesses `dynamic_supply_chain_logistics_dataset.csv`.
- Trains a RandomForestRegressor to predict `warehouse_inventory_level`.
- Provides `/train` and `/predict` endpoints.
- Uses LabelEncoder for categorical features.
- Returns a status color based on predicted stock.
"""

import random
import pathlib
from typing import Dict

import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import joblib

app = FastAPI()

# Constants
CSV_PATH = pathlib.Path(__file__).parent / "dynamic_supply_chain_logistics_dataset.csv"
MODEL_PATH = pathlib.Path(__file__).parent / "model.pkl"
WAREHOUSE_IDS = ["WH-MUM", "WH-DEL", "WH-BLR", "WH-PUN"]
PRODUCT_IDS = [f"PROD-{i:03d}" for i in range(1, 21)]

# Global objects (populated after training)
model: RandomForestRegressor = None
warehouse_encoder: LabelEncoder = None
product_encoder: LabelEncoder = None


def _enrich_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Add dummy warehouse_id, product_id and time‑based features.
    The function mutates a copy of the input DataFrame and returns it.
    """
    df = df.copy()
    # Random assignment – reproducible for debugging
    rng = np.random.default_rng(seed=42)
    df["warehouse_id"] = rng.choice(WAREHOUSE_IDS, size=len(df))
    df["product_id"] = rng.choice(PRODUCT_IDS, size=len(df))
    # Ensure timestamp is datetime
    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")
    df["day_of_week"] = df["timestamp"].dt.dayofweek  # Monday=0
    df["month"] = df["timestamp"].dt.month
    return df


def _prepare_features(df: pd.DataFrame):
    """Enhanced feature engineering with additional predictive features.
    Returns X (np.ndarray), y (np.ndarray), and the fitted encoders.
    """
    # Encode categorical columns
    global warehouse_encoder, product_encoder
    warehouse_encoder = LabelEncoder()
    product_encoder = LabelEncoder()
    df["warehouse_id_enc"] = warehouse_encoder.fit_transform(df["warehouse_id"])
    df["product_id_enc"] = product_encoder.fit_transform(df["product_id"])
    
    # Advanced feature engineering
    df["warehouse_product_interaction"] = df["warehouse_id_enc"] * df["product_id_enc"]
    df["traffic_squared"] = df["traffic_congestion_level"] ** 2
    df["traffic_log"] = np.log1p(df["traffic_congestion_level"])
    df["day_sin"] = np.sin(2 * np.pi * df["day_of_week"] / 7)
    df["day_cos"] = np.cos(2 * np.pi * df["day_of_week"] / 7)
    df["month_sin"] = np.sin(2 * np.pi * df["month"] / 12)
    df["month_cos"] = np.cos(2 * np.pi * df["month"] / 12)
    
    # Cyclical encoding for better temporal patterns
    df["is_weekend"] = (df["day_of_week"] >= 5).astype(int)
    df["is_peak_hour"] = ((df["day_of_week"] < 5) & 
                          (df["timestamp"].dt.hour.between(9, 17))).astype(int)
    
    feature_cols = [
        "warehouse_id_enc",
        "product_id_enc", 
        "warehouse_product_interaction",
        "day_of_week",
        "day_sin",
        "day_cos", 
        "month",
        "month_sin",
        "month_cos",
        "traffic_congestion_level",
        "traffic_squared",
        "traffic_log",
        "is_weekend",
        "is_peak_hour"
    ]
    X = df[feature_cols].values
    y = df["warehouse_inventory_level"].values
    return X, y


def _train_model():
    """Load data, preprocess, train model and persist it.
    The trained model and encoders are saved to ``MODEL_PATH`` using joblib.
    Returns the model and accuracy metrics.
    """
    if not CSV_PATH.is_file():
        raise FileNotFoundError(f"Dataset not found at {CSV_PATH}")
    raw_df = pd.read_csv(CSV_PATH)
    enriched_df = _enrich_dataframe(raw_df)
    X, y = _prepare_features(enriched_df)
    
    # Split data for training, validation, and testing
    X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42)
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)
    
    # Train the model with GPU acceleration
    from xgboost import XGBRegressor
    
    # High-performance XGBoost configuration optimized for RTX 4090
    rf = XGBRegressor(
        n_estimators=5000,           # Maximum trees - will stop early
        learning_rate=0.005,          # Very low learning rate for better accuracy
        max_depth=12,                 # Deeper trees for complex patterns
        min_child_weight=1,           # Allow smaller leaf nodes
        subsample=0.9,                # Use 90% of data per tree
        colsample_bytree=0.9,         # Use 90% of features per tree
        colsample_bylevel=0.9,        # Use 90% of features per level
        colsample_bynode=0.9,         # Use 90% of features per split
        gamma=0.01,                   # Minimum loss reduction
        reg_alpha=0.01,               # Minimal L1 regularization
        reg_lambda=0.5,               # Reduced L2 regularization
        objective='reg:squarederror',
        tree_method='hist',           # GPU histogram algorithm
        device='cuda:0',             # Use RTX 4090
        predictor='gpu_predictor',   # GPU predictions
        random_state=42,
        n_jobs=-1,                   # Use all CPU cores
        eval_metric='rmse',
        max_bin=512,                 # More bins for better granularity
        grow_policy='lossguide',     # Best-first tree growth
        max_leaves=0,                # Unlimited leaves for complexity
        sampling_method='gradient_based',  # Better sampling
        scale_pos_weight=1.0,
        single_precision_histogram=True,  # Faster GPU computation
        gpu_hist_nbins=512,          # GPU-specific bins
        gpu_hist_max_cache_size=80,  # Optimize RTX 4090 memory
    )
    
    # Train with early stopping and monitoring
    eval_set = [(X_train, y_train), (X_val, y_val)]
    rf.fit(
        X_train, 
        y_train,
        eval_set=eval_set,
        early_stopping_rounds=100,    # Stop if no improvement for 100 rounds
        verbose=50,                    # Print progress every 50 iterations
    )
    
    # Get the best iteration for final model
    best_iteration = rf.best_iteration if hasattr(rf, 'best_iteration') else rf.best_ntree_limit
    print(f"Best iteration: {best_iteration}")
    
    # Retrain on combined train+val data with optimal iterations
    X_train_full = np.vstack([X_train, X_val])
    y_train_full = np.hstack([y_train, y_val])
    
    # Final model with optimal parameters
    final_rf = XGBRegressor(
        n_estimators=best_iteration,
        learning_rate=0.005,
        max_depth=12,
        min_child_weight=1,
        subsample=0.9,
        colsample_bytree=0.9,
        colsample_bylevel=0.9,
        colsample_bynode=0.9,
        gamma=0.01,
        reg_alpha=0.01,
        reg_lambda=0.5,
        objective='reg:squarederror',
        tree_method='hist',
        device='cuda:0',
        predictor='gpu_predictor',
        random_state=42,
        n_jobs=-1,
        eval_metric='rmse',
        max_bin=512,
        grow_policy='lossguide',
        max_leaves=0,
        sampling_method='gradient_based',
        single_precision_histogram=True,
        gpu_hist_nbins=512,
        gpu_hist_max_cache_size=80,
    )
    
    final_rf.fit(X_train_full, y_train_full, verbose=False)
    rf = final_rf  # Use the final optimized model
    
    # Calculate accuracy metrics
    y_pred = rf.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    
    # Persist model and encoders together
    payload = {
        "model": rf,
        "warehouse_encoder": warehouse_encoder,
        "product_encoder": product_encoder,
        "metrics": {
            "r2_score": float(r2),
            "mae": float(mae),
            "rmse": float(rmse),
            "train_samples": len(X_train),
            "test_samples": len(X_test)
        }
    }
    joblib.dump(payload, MODEL_PATH)
    return rf, payload["metrics"]


def _load_model():
    """Load the persisted model and encoders.
    Returns tuple (model, warehouse_encoder, product_encoder).
    """
    if not MODEL_PATH.is_file():
        raise FileNotFoundError("Trained model not found. Call /train first.")
    payload = joblib.load(MODEL_PATH)
    return payload["model"], payload["warehouse_encoder"], payload["product_encoder"]


class TrainResponse(BaseModel):
    status: str
    model_path: str
    r2_score: float
    mae: float
    rmse: float
    train_samples: int
    test_samples: int

@app.post("/train", response_model=TrainResponse)
def train_endpoint():
    """Trigger model training.
    The endpoint reads the CSV, enriches it, trains a RandomForestRegressor and saves the model.
    Returns training metrics including R² score, MAE, and RMSE.
    """
    try:
        model, metrics = _train_model()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return TrainResponse(
        status="success",
        model_path=str(MODEL_PATH),
        r2_score=metrics["r2_score"],
        mae=metrics["mae"],
        rmse=metrics["rmse"],
        train_samples=metrics["train_samples"],
        test_samples=metrics["test_samples"]
    )


class PredictRequest(BaseModel):
    warehouse_id: str
    product_id: str
    day_of_week: int  # 0‑6 (Monday‑Sunday)
    traffic_level: float

class PredictResponse(BaseModel):
    predicted_stock: float
    status_color: str

@app.post("/predict", response_model=PredictResponse)
def predict_endpoint(req: PredictRequest):
    """Return predicted inventory level and status colour.
    The request payload must contain categorical identifiers and numeric features.
    """
    try:
        model, wh_enc, prod_enc = _load_model()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Encode categorical inputs – handle unknown values gracefully
    try:
        wh_code = wh_enc.transform([req.warehouse_id])[0]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid warehouse_id")
    try:
        prod_code = prod_enc.transform([req.product_id])[0]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid product_id")

    X_input = np.array([
        [wh_code, prod_code, req.day_of_week, req.traffic_level]
    ])
    pred = model.predict(X_input)[0]
    # Status colour logic
    # Green = Low stock (empty, needs restocking)
    # Yellow = Moderate stock (optimal range)
    # Red = High stock (full, overstocked)
    if pred > 600:
        colour = "Red"
    elif pred < 300:
        colour = "Green"
    else:
        colour = "Yellow"
    return PredictResponse(predicted_stock=float(pred), status_color=colour)
