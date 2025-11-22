# StockMaster 2.0 - Backend

A robust, production-ready Inventory Management System built with FastAPI and SQLModel. StockMaster provides comprehensive stock tracking, order management, and real-time dashboard analytics for modern businesses.

## 🚀 Features

- **Product Management**: Track products with SKU, category, UOM, pricing, and stock levels
- **Order Processing**: Handle both IN (receipts) and OUT (deliveries) orders with draft/done workflow
- **Stock Validation**: Automatic stock level validation to prevent overselling
- **Dashboard Analytics**: Real-time KPIs including inventory value, potential profit, and low-stock alerts
- **Auto-seeding**: Pre-populated dummy data for immediate testing
- **RESTful API**: Clean, well-structured endpoints with automatic OpenAPI documentation

## 🛠️ Tech Stack

- **FastAPI**: Modern, high-performance Python web framework
- **SQLModel**: SQL database ORM with Pydantic validation
- **SQLite**: Lightweight, serverless database
- **Uvicorn**: Lightning-fast ASGI server
- **Python 3.x**: Latest Python features and type hints

## 📋 Prerequisites

- Python 3.7 or higher
- pip (Python package manager)

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd stockmaster2.0
```

### 2. Create Virtual Environment

```bash
python -m venv .venv
```

### 3. Activate Virtual Environment

**Windows:**
```bash
.venv\Scripts\activate
```

**macOS/Linux:**
```bash
source .venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Run the Server

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

Once the server is running, access the interactive API documentation at:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔗 API Endpoints

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Get real-time KPIs and analytics |

**Response Example:**
```json
{
  "total_items": 520,
  "inventory_value": 145500.0,
  "potential_profit": 67500.0,
  "low_stock_alert": 1
}
```

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List all products |

**Response Example:**
```json
[
  {
    "id": 1,
    "name": "Steel Rod",
    "sku": "SR-001",
    "category": "Construction",
    "uom": "kg",
    "cost_price": 50.0,
    "sales_price": 80.0,
    "current_stock": 100
  }
]
```

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Create a new order (Draft status) |
| GET | `/orders` | List all orders |
| POST | `/orders/{order_id}/lines` | Add product line to order |
| POST | `/orders/{order_id}/validate` | Validate order and update stock |

**Create Order Example:**
```json
POST /orders
{
  "type": "IN",
  "partner_name": "ABC Suppliers"
}
```

**Add Order Line Example:**
```json
POST /orders/1/lines
{
  "product_id": 1,
  "quantity": 50
}
```

**Validate Order:**
```json
POST /orders/1/validate
```
This will:
- Update stock levels (increase for IN, decrease for OUT)
- Validate sufficient stock for OUT orders
- Change order status from Draft to Done
- Prevent further modifications

## 📊 Database Schema

### Product
- `id`: Primary key
- `name`: Product name
- `sku`: Unique stock keeping unit (indexed)
- `category`: Product category
- `uom`: Unit of measurement
- `cost_price`: Purchase price
- `sales_price`: Selling price
- `current_stock`: Available quantity

### Order
- `id`: Primary key
- `type`: IN (receipt) or OUT (delivery)
- `partner_name`: Supplier or customer name
- `date`: Order timestamp (auto-generated)
- `status`: Draft or Done

### OrderLine
- `id`: Primary key
- `order_id`: Foreign key to Order
- `product_id`: Foreign key to Product
- `quantity`: Number of units

## 🏗️ Project Structure

```
stockmaster2.0/
├── main.py           # FastAPI app, endpoints, and business logic
├── models.py         # SQLModel database models
├── database.py       # Database configuration and session management
├── requirements.txt  # Python dependencies
├── stockmaster.db    # SQLite database (auto-generated)
└── README.md         # This file
```

## 🎯 Business Logic

### Order Workflow

1. **Create Order**: Orders start in `Draft` status
2. **Add Lines**: Add product lines while in Draft
3. **Validate**: Validates and processes the order:
   - **IN Orders**: Increases stock for each product
   - **OUT Orders**: Decreases stock (validates sufficient quantity first)
   - Changes status to `Done`
4. **Locked**: Done orders cannot be modified

### Stock Management

- Automatic stock updates on order validation
- Prevents negative stock (overselling protection)
- Real-time stock level tracking

## 🧪 Sample Data

The application automatically seeds the database with sample data on first run:

- **5 Products**: Steel Rod, Cement, Drill Machine, Paint Bucket, Safety Helmet
- **1 Done Receipt**: Pre-processed IN order for realistic dashboard data

## 🔮 Future Enhancements

- [ ] ML-based demand prediction (placeholder in validation endpoint)
- [ ] User authentication and authorization
- [ ] Multi-warehouse support
- [ ] Advanced reporting and exports
- [ ] Batch operations
- [ ] Product search and filtering

## 🐛 Error Handling

The API includes comprehensive error handling:

- **404**: Resource not found (order, product)
- **400**: Business rule violations (insufficient stock, modifying Done orders)
- Detailed error messages for debugging

## 🤝 Contributing

This is a hackathon project. Feel free to fork and extend!

## 📝 License

Open source - use as you wish!

## 👨‍💻 Development

### Running in Development Mode

```bash
uvicorn main:app --reload --port 8000
```

### Clearing Database

Delete `stockmaster.db` file and restart the server to reset with fresh seed data.

### Adding New Products

Use the POST `/orders` endpoint or directly insert into the database during seeding.

## 📞 Support

For issues or questions, please open an issue in the repository.

---

**Built with ❤️ for modern inventory management**
