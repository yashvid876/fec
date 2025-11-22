from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session, select, func
from typing import List
from contextlib import asynccontextmanager

from database import create_db_and_tables, get_session
from models import Product, Order, OrderLine, OrderType, OrderStatus

# --- Seeding Script ---
def create_dummy_data(session: Session):
    # Check if data exists
    existing_products = session.exec(select(Product)).first()
    if existing_products:
        return

    # Create Products
    products = [
        Product(name="Steel Rod", sku="SR-001", category="Construction", uom="kg", cost_price=50.0, sales_price=80.0, current_stock=100),
        Product(name="Cement", sku="CM-001", category="Construction", uom="bag", cost_price=300.0, sales_price=450.0, current_stock=200),
        Product(name="Drill Machine", sku="DM-001", category="Tools", uom="unit", cost_price=2500.0, sales_price=4000.0, current_stock=20),
        Product(name="Paint Bucket", sku="PB-001", category="Finishing", uom="bucket", cost_price=1200.0, sales_price=1800.0, current_stock=50),
        Product(name="Safety Helmet", sku="SH-001", category="Safety", uom="unit", cost_price=150.0, sales_price=300.0, current_stock=150),
    ]
    for p in products:
        session.add(p)
    session.commit()
    
    # Refresh products to get IDs
    for p in products:
        session.refresh(p)

    # Create 1 "Done" Receipt (IN)
    order = Order(type=OrderType.IN, partner_name="Initial Supplier", status=OrderStatus.DONE)
    session.add(order)
    session.commit()
    session.refresh(order)

    # Add lines to the order
    # Adding some stock (already reflected in current_stock above, but for record)
    # Note: In a real system, current_stock would be 0 and this order would increase it.
    # For this dummy data, we assume the current_stock is the result of this order + others.
    # But to match the requirement "1 Done Receipt so dashboard isn't zero", we just add it.
    
    lines = [
        OrderLine(order_id=order.id, product_id=products[0].id, quantity=50),
        OrderLine(order_id=order.id, product_id=products[1].id, quantity=100),
    ]
    for l in lines:
        session.add(l)
    session.commit()

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    # Create a session for seeding
    from database import engine
    with Session(engine) as session:
        create_dummy_data(session)
    yield

app = FastAPI(lifespan=lifespan, title="StockMaster 2.0")

# --- Endpoints ---

@app.post("/orders", response_model=Order)
def create_order(order: Order, session: Session = Depends(get_session)):
    # Force status to Draft
    order.status = OrderStatus.DRAFT
    session.add(order)
    session.commit()
    session.refresh(order)
    return order

@app.post("/orders/{order_id}/lines", response_model=OrderLine)
def add_order_line(order_id: int, line: OrderLine, session: Session = Depends(get_session)):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status == OrderStatus.DONE:
        raise HTTPException(status_code=400, detail="Cannot modify a Done order")
    
    line.order_id = order_id
    session.add(line)
    session.commit()
    session.refresh(line)
    return line

@app.post("/orders/{order_id}/validate", response_model=Order)
def validate_order(order_id: int, session: Session = Depends(get_session)):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.status == OrderStatus.DONE:
        raise HTTPException(status_code=400, detail="Order is already Done")

    # Fetch lines
    # Note: SQLModel relationships are lazy by default, but accessing them loads them if session is active
    # However, it's safer to explicitly select them or rely on lazy loading within the session
    lines = order.lines

    for line in lines:
        product = session.get(Product, line.product_id)
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {line.product_id} not found")

        if order.type == OrderType.IN:
            product.current_stock += line.quantity
        elif order.type == OrderType.OUT:
            if product.current_stock >= line.quantity:
                product.current_stock -= line.quantity
            else:
                raise HTTPException(status_code=400, detail=f"Insufficient stock for product {product.name}")
        
        session.add(product)

    # TODO: Call ML Prediction here
    
    order.status = OrderStatus.DONE
    session.add(order)
    session.commit()
    session.refresh(order)
    return order

@app.get("/dashboard")
def get_dashboard(session: Session = Depends(get_session)):
    products = session.exec(select(Product)).all()
    
    total_items = sum(p.current_stock for p in products)
    inventory_value = sum(p.cost_price * p.current_stock for p in products)
    potential_profit = sum((p.sales_price - p.cost_price) * p.current_stock for p in products)
    low_stock_alert = sum(1 for p in products if p.current_stock < 10)

    return {
        "total_items": total_items,
        "inventory_value": inventory_value,
        "potential_profit": potential_profit,
        "low_stock_alert": low_stock_alert
    }

@app.get("/products", response_model=List[Product])
def list_products(session: Session = Depends(get_session)):
    return session.exec(select(Product)).all()

@app.get("/orders", response_model=List[Order])
def list_orders(session: Session = Depends(get_session)):
    return session.exec(select(Order)).all()
