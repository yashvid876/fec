import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AddDeliveryDialog } from "@/components/dialogs/AddDeliveryDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const initialDeliveries = [
  { id: 1, reference: "DLV-001", customer: "ABC Corp", date: "2025-11-21", products: 2, status: "pending" },
  { id: 2, reference: "DLV-002", customer: "XYZ Ltd", date: "2025-11-22", products: 4, status: "ready" },
  { id: 3, reference: "DLV-003", customer: "Tech Solutions", date: "2025-11-22", products: 1, status: "completed" },
];

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeliveryAdded = (newDelivery: any) => {
    setDeliveries([newDelivery, ...deliveries]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Deliveries</h2>
            <p className="text-muted-foreground mt-1">Manage outgoing stock to customers</p>
          </div>
          <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New Delivery
          </Button>
        </div>

        <AddDeliveryDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onDeliveryAdded={handleDeliveryAdded}
        />

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Delivery Orders</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search deliveries..."
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-mono text-sm font-medium">{delivery.reference}</TableCell>
                    <TableCell>{delivery.customer}</TableCell>
                    <TableCell className="text-muted-foreground">{delivery.date}</TableCell>
                    <TableCell>{delivery.products} items</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          delivery.status === "completed"
                            ? "default"
                            : delivery.status === "ready"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {delivery.status}
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
