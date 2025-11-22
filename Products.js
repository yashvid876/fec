import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import { AddProductDialog } from "@/components/dialogs/AddProductDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const initialProducts = [
  { id: 1, sku: "STL-001", name: "Steel Rods", category: "Raw Materials", stock: 12, unit: "kg", status: "low" },
  { id: 2, sku: "CHR-001", name: "Office Chairs", category: "Furniture", stock: 45, unit: "pcs", status: "good" },
  { id: 3, sku: "LAP-001", name: "Laptops", category: "Electronics", stock: 23, unit: "pcs", status: "good" },
  { id: 4, sku: "DSK-001", name: "Office Desks", category: "Furniture", stock: 8, unit: "pcs", status: "low" },
  { id: 5, sku: "PNT-001", name: "Paint Cans", category: "Supplies", stock: 0, unit: "liters", status: "out" },
  { id: 6, sku: "WRE-001", name: "Wire Spools", category: "Raw Materials", stock: 156, unit: "meters", status: "good" },
];

export default function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleProductAdded = (newProduct: any) => {
    setProducts([newProduct, ...products]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Products</h2>
            <p className="text-muted-foreground mt-1">Manage your inventory products</p>
          </div>
          <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        <AddProductDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onProductAdded={handleProductAdded}
        />

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Product List</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-9 w-64"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">{product.category}</TableCell>
                    <TableCell className="font-semibold">{product.stock}</TableCell>
                    <TableCell className="text-muted-foreground">{product.unit}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === "good"
                            ? "default"
                            : product.status === "low"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {product.status === "good" ? "In Stock" : product.status === "low" ? "Low Stock" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
