from enum import Enum
from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel
from datetime import datetime

class OrderType(str, Enum):
    IN = "IN"
    OUT = "OUT"

class OrderStatus(str, Enum):
    DRAFT = "Draft"
    DONE = "Done"

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    sku: str = Field(unique=True, index=True)
    category: str
    uom: str
    cost_price: float
    sales_price: float
    current_stock: int = Field(default=0)

    order_lines: List["OrderLine"] = Relationship(back_populates="product")

class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    type: OrderType
    partner_name: str
    date: datetime = Field(default_factory=datetime.utcnow)
    status: OrderStatus = Field(default=OrderStatus.DRAFT)

    lines: List["OrderLine"] = Relationship(back_populates="order")

class OrderLine(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: Optional[int] = Field(default=None, foreign_key="order.id")
    product_id: Optional[int] = Field(default=None, foreign_key="product.id")
    quantity: int

    order: Optional[Order] = Relationship(back_populates="lines")
    product: Optional[Product] = Relationship(back_populates="order_lines")
