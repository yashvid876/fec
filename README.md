# StockMaster AI - Inventory Demand Prediction System

## 📋 Overview

StockMaster AI is an intelligent inventory management system that uses machine learning to predict warehouse inventory levels based on various factors like traffic congestion, warehouse location, product type, and temporal patterns.

### 🎯 Project Purpose

This system demonstrates the complete ML pipeline from data preprocessing and model training to deployment and frontend integration for inventory demand prediction in supply chain logistics.

## 📁 Project Structure

```
fec-1/
├── 📊 Data Files
│   └── dynamic_supply_chain_logistics_dataset.csv    # Training dataset
│
├── 🤖 ML Model Components
│   ├── ml_service.py                                   # FastAPI backend service
│   ├── model.pkl                                       # Trained ML model
│   ├── train_model.py                                  # Model training script
│   └── evaluate_model.py                               # Model evaluation script
│
├── 🎨 Frontend Demo (Micro Frontend)
│   ├── index.html                                      # Main frontend interface
│   ├── script.js                                       # Frontend JavaScript logic
│   ├── style.css                                       # Styling
│   └── frontend_ml_model.js                            # Frontend ML integration
│
├── ⚙️ Configuration
│   ├── requirements.txt                                # Python dependencies
│   └── training_results.json                          # Training metrics
│
└── 📖 Documentation
    └── README.md                                       # This file
```

## 🔄 Complete Workflow

### 1. Data Preparation & Model Training

#### **Step 1: Train the ML Model**
```bash
python train_model.py
```

**What it does:**
- Loads the supply chain dataset
- Performs feature engineering (warehouse/product encoding, time-based features)
- Trains an XGBoost RandomForest model with GPU acceleration
- Uses early stopping to prevent overfitting
- Saves the trained model as `model.pkl`

**Key Features:**
- **Feature Engineering**: Creates interaction features, polynomial features
- **Advanced Training**: Uses XGBoost with GPU acceleration (`cuda:0`)
- **Optimization**: Early stopping, hyperparameter tuning
- **Validation**: Train/validation split with performance monitoring

#### **Step 2: Evaluate Model Performance**
```bash
python evaluate_model.py
```

**What it does:**
- Loads the trained model from `model.pkl`
- Evaluates performance on test data
- Calculates accuracy metrics (R², MAE, RMSE)
- Generates performance reports
- Saves evaluation results

**Metrics Tracked:**
- **R² Score**: Model's explanatory power
- **Mean Absolute Error (MAE)**: Average prediction error
- **Root Mean Squared Error (RMSE)**: Standard deviation of prediction errors
- **Training Time**: Model training duration
- **Model Size**: Serialized model file size

### 2. Backend API Service

#### **Step 3: Start ML Service**
```bash
python -m uvicorn ml_service:app --host 0.0.0.0 --port 8001 --reload
```

**API Endpoints:**
- `POST /train` - Retrain the ML model
- `POST /predict` - Make predictions
- `GET /model/status` - Check model status
- `GET /health` - Health check

**Features:**
- **FastAPI Integration**: RESTful API with automatic docs
- **Model Loading**: Dynamic model loading from pickle file
- **Feature Processing**: Real-time feature engineering
- **Error Handling**: Comprehensive error management
- **GPU Support**: CUDA acceleration for predictions

### 3. Frontend Demo (Micro Frontend) ⚠️

#### **Important Note**
The frontend is a **demonstration component** created to showcase the ML model's functionality. It is **NOT** part of the main production system and serves only to visualize the model's predictions.

#### **Step 4: Start Frontend Demo**
```bash
python -m http.server 3000
```

**Access:** `http://localhost:3000`

**Frontend Features:**
- **Interactive Interface**: Warehouse/product selection, traffic adjustment
- **Real-time Predictions**: Live ML model predictions
- **Visualization**: Maps, charts, KPI cards
- **Two Integration Modes**:
  1. **Backend Mode**: Calls the FastAPI service
  2. **Frontend Mode**: Uses embedded ML model (`frontend_ml_model.js`)

**Frontend Integration Methods:**

1. **Backend Integration** (Recommended for production):
   ```javascript
   // Calls FastAPI service
   const response = await fetch('http://localhost:8001/predict', {
       method: 'POST',
       body: JSON.stringify(requestData)
   });
   ```

2. **Frontend-Only Mode** (Demo purposes):
   ```javascript
   // Uses embedded ML model
   const prediction = await predictWithFrontendModel(warehouseId, productId, dayOfWeek, trafficLevel);
   ```

## 🧠 ML Model Details

### Model Architecture
- **Algorithm**: XGBoost RandomForest
- **Trees**: 100 estimators with early stopping
- **Features**: 7 engineered features
- **Target**: `warehouse_inventory_level`

### Feature Engineering
1. **Categorical Encoding**: Label encoding for warehouses and products
2. **Temporal Features**: Day of week, month extraction
3. **Interaction Features**: Warehouse × Product interactions
4. **Polynomial Features**: Traffic congestion squared
5. **Advanced Features**: Traffic-based sampling, gradient-based features

### Model Performance
- **Training Accuracy**: ~85-90% R² score
- **Prediction Speed**: <100ms per request
- **Model Size**: ~50MB (compressed)
- **Inference**: GPU/CPU optimized

## 🚀 Quick Start

### Prerequisites
```bash
# Install dependencies
pip install -r requirements.txt
```

### Complete Workflow
```bash
# 1. Train the model
python train_model.py

# 2. Evaluate performance
python evaluate_model.py

# 3. Start backend service
python -m uvicorn ml_service:app --host 0.0.0.0 --port 8001 --reload

# 4. Start frontend demo (optional)
python -m http.server 3000
```

### Testing the System
```bash
# Test backend API
curl -X POST "http://localhost:8001/predict" \
     -H "Content-Type: application/json" \
     -d '{
       "warehouse_id": "WH-MUM",
       "product_id": "PROD-001", 
       "day_of_week": 1,
       "traffic_level": 5.0
     }'
```

## 📊 Model Evaluation Results

After running `evaluate_model.py`, you'll get metrics like:

```json
{
  "r2_score": 0.87,
  "mae": 45.2,
  "rmse": 67.8,
  "training_time": "2.5 minutes",
  "model_size": "47.3 MB",
  "feature_importance": {
    "traffic_congestion_level": 0.25,
    "warehouse_product_interaction": 0.20,
    "warehouse_id_enc": 0.15,
    "product_id_enc": 0.12,
    "month": 0.10,
    "traffic_squared": 0.10,
    "day_of_week": 0.08
  }
}
```

## 🎯 Use Cases

### Production Integration
The trained model (`model.pkl`) and backend service (`ml_service.py`) are designed for integration into larger supply chain management systems.

### Demo & Visualization
The frontend demonstrates:
- Real-time prediction capabilities
- Interactive parameter adjustment
- Visual feedback and KPI monitoring
- Geographic warehouse visualization

## 🛠️ Technical Stack

### Backend
- **Python 3.13**
- **FastAPI**: REST API framework
- **XGBoost**: ML model training/inference
- **scikit-learn**: Data preprocessing
- **pandas**: Data manipulation
- **joblib**: Model serialization

### Frontend (Demo)
- **HTML5/CSS3**: Modern UI with glassmorphism
- **JavaScript**: Vanilla JS with ES6+ features
- **Leaflet**: Interactive maps
- **Chart.js**: Data visualization
- **No Framework Dependencies**: Lightweight implementation

## 📝 API Documentation

### Predict Endpoint
```http
POST /predict
Content-Type: application/json

{
  "warehouse_id": "WH-MUM",
  "product_id": "PROD-001",
  "day_of_week": 1,
  "traffic_level": 5.0
}
```

**Response:**
```json
{
  "predicted_stock": 450,
  "status_color": "Yellow",
  "confidence": 0.87,
  "processing_time": "45ms"
}
```

## 🔧 Configuration

### Environment Variables
```bash
# Optional: GPU settings
export CUDA_VISIBLE_DEVICES=0

# Optional: Model paths
export MODEL_PATH="./model.pkl"
export DATA_PATH="./dynamic_supply_chain_logistics_dataset.csv"
```

### Model Parameters
Key parameters in `train_model.py`:
- `n_estimators`: 100 (with early stopping)
- `max_depth`: 12
- `learning_rate`: 0.005
- `early_stopping_rounds`: 100

## 🚨 Important Notes

1. **Frontend is Demo Only**: The frontend interface is for demonstration purposes and not intended for production use
2. **GPU Requirements**: Model training benefits from CUDA-enabled GPU
3. **Data Privacy**: All processing happens locally; no external API calls
4. **Model Retraining**: Model should be retrained periodically with new data
5. **Feature Consistency**: Production systems must use identical feature engineering

## 📈 Performance Optimization

### Training Optimization
- Use GPU acceleration (`device='cuda:0'`)
- Enable early stopping to prevent overfitting
- Use histogram-based tree building (`tree_method='hist'`)
- Optimize memory usage with `single_precision_histogram=True`

### Inference Optimization
- Batch predictions for better throughput
- Use GPU prediction (`predictor='gpu_predictor'`)
- Cache feature encoders
- Implement model versioning

## 🔄 Model Maintenance

### Retraining Schedule
- **Weekly**: For high-volume operations
- **Monthly**: For moderate operations
- **Quarterly**: For stable operations

### Monitoring
- Track prediction accuracy drift
- Monitor feature distribution changes
- Log prediction confidence scores
- Set up alerts for performance degradation

## 📞 Support

For technical questions or issues:
1. Check model evaluation results first
2. Verify data format consistency
3. Ensure all dependencies are installed
4. Review API endpoint configurations

---

**⚠️ Disclaimer**: This frontend demo is provided for visualization and testing purposes only. For production deployment, integrate the backend API (`ml_service.py`) and trained model (`model.pkl`) into your existing infrastructure.
