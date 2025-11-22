import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AddReceiptDialog } from "@/components/dialogs/AddReceiptDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const initialReceipts = [
  { id: 1, reference: "RCP-001", supplier: "Steel Inc.", date: "2025-11-20", products: 3, status: "completed" },
  { id: 2, reference: "RCP-002", supplier: "Office Supplies Co.", date: "2025-11-21", products: 5, status: "pending" },
  { id: 3, reference: "RCP-003", supplier: "Tech Distributors", date: "2025-11-22", products: 2, status: "draft" },
];

export default function Receipts() {
  const [receipts, setReceipts] = useState(initialReceipts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleReceiptAdded = (newReceipt: any) => {
    setReceipts([newReceipt, ...receipts]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Receipts</h2>
            <p className="text-muted-foreground mt-1">Manage incoming stock from suppliers</p>
          </div>
          <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New Receipt
          </Button>
        </div>

        <AddReceiptDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onReceiptAdded={handleReceiptAdded}
        />

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Receipt List</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search receipts..."
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
                  <TableHead>Reference</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell className="font-mono text-sm font-medium">{receipt.reference}</TableCell>
                    <TableCell>{receipt.supplier}</TableCell>
                    <TableCell className="text-muted-foreground">{receipt.date}</TableCell>
                    <TableCell>{receipt.products} items</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          receipt.status === "completed"
                            ? "default"
                            : receipt.status === "pending"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {receipt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
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
