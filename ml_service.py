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
    """Encode categorical columns and return feature matrix and target.
    Returns X (np.ndarray), y (np.ndarray), and the fitted encoders.
    """
    # Encode categorical columns
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


def _train_model():
    """Load data, preprocess, train model and persist it.
    The trained model and encoders are saved to ``MODEL_PATH`` using joblib.
    """
    if not CSV_PATH.is_file():
        raise FileNotFoundError(f"Dataset not found at {CSV_PATH}")
    raw_df = pd.read_csv(CSV_PATH)
    enriched_df = _enrich_dataframe(raw_df)
    X, y = _prepare_features(enriched_df)
    rf = RandomForestRegressor(random_state=42)
    rf.fit(X, y)
    # Persist model and encoders together
    payload = {
        "model": rf,
        "warehouse_encoder": warehouse_encoder,
        "product_encoder": product_encoder,
    }
    joblib.dump(payload, MODEL_PATH)
    return rf


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

@app.post("/train", response_model=TrainResponse)
def train_endpoint():
    """Trigger model training.
    The endpoint reads the CSV, enriches it, trains a RandomForestRegressor and saves the model.
    """
    try:
        _train_model()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return TrainResponse(status="success", model_path=str(MODEL_PATH))


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
    if pred > 800:
        colour = "Red"
    elif pred < 400:
        colour = "Green"
    else:
        colour = "Yellow"
    return PredictResponse(predicted_stock=float(pred), status_color=colour)
